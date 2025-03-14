import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      setTasks: (tasks) => set({ tasks }),

      addTask: async (newTask) => {
        const taskWithId = {
          id: crypto.randomUUID(), // Generate a unique temporary ID
          ...newTask
        };

        // Optimistically add the new task to the state
        set((state) => ({
          tasks: [...state.tasks, taskWithId]
        }));

        try {
          const response = await axios.post("http://localhost:5001/tasks", taskWithId);
          const savedTask = response.data;

          // Replace temporary ID with actual ID from the backend if necessary
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === taskWithId.id ? { ...task, id: savedTask.id } : task
            )
          }));
        } catch (error) {
          console.error("Failed to add task:", error);
          // Optionally remove the optimistically added task if the API request fails
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== taskWithId.id)
          }));
        }
      },

      updateTask: async (taskId, updatedFields) => {
        console.log(updatedFields);
        const tasks = get().tasks.map((task) => (task.id === taskId ? { ...task, ...updatedFields } : task));
        set({ tasks });

        // API call to update task status, name, description, and due_date
        try {
          await axios.put(`http://localhost:5001/tasks/${taskId}`, updatedFields);
        } catch (error) {
          console.error("Failed to update task:", error);
          // Optionally handle error by reverting the changes if needed
        }
      },

      deleteTask: async (taskId) => {
        // Optimistically remove the task from state
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId)
        }));

        try {
          await axios.delete(`http://localhost:5001/tasks/${taskId}`);
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
