import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

// Declare the API URL constant
const API_URL = import.meta.env.VITE_API_URL;

const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      setTasks: (tasks) => set({ tasks }),

      addTask: async (newTask, access_token) => {
        const taskWithId = {
          id: crypto.randomUUID(), // Generate a unique temporary ID
          ...newTask
        };

        // Optimistically add the new task to the state
        set((state) => ({
          tasks: [...state.tasks, taskWithId]
        }));

        try {
          const response = await axios.post(`${API_URL}/tasks`, newTask, {
            headers: {
              Authorization: `Bearer ${access_token}` // Add the bearer token to the request
            }
          });
          const taskList = response.data;
          set((state) => ({
            tasks: taskList
          }));
        } catch (error) {
          console.error("Failed to add task:", error);
          // Optionally remove the optimistically added task if the API request fails
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== taskWithId.id)
          }));
        }
      },

      updateTask: async (taskId, updatedFields, access_token) => {
        const tasks = get().tasks.map((task) => (task.id === taskId ? { ...task, ...updatedFields } : task));
        set({ tasks });

        // API call to update task status, name, description, and due_date
        try {
          await axios.put(`${API_URL}/tasks/${taskId}`, updatedFields, {
            headers: {
              Authorization: `Bearer ${access_token}` // Add the bearer token to the request
            }
          });
        } catch (error) {
          console.error("Failed to update task:", error);
          // Optionally handle error by reverting the changes if needed
        }
      },

      deleteTask: async (taskId, access_token) => {
        // Optimistically remove the task from state
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId)
        }));

        try {
          await axios.delete(`${API_URL}/tasks/${taskId}`, {
            headers: {
              Authorization: `Bearer ${access_token}` // Add the bearer token to the request
            }
          });
        } catch (error) {
          console.error("Failed to delete task:", error);
          // Optionally restore the deleted task if the API request fails
          set((state) => ({
            tasks: [...state.tasks, get().tasks.find((task) => task.id === taskId)]
          }));
        }
      }
    }),
    { name: "tasks" } // Persist tasks in local storage
  )
);

export default useTaskStore;
