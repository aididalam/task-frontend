import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { getPendingActions, removeSyncedActions, saveTaskAction } from "./dexieStore";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

// Declare the API URL constant
const API_URL = import.meta.env.VITE_API_URL;

const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      setTasks: (tasks) => set({ tasks }),

      addTask: async (newTask, access_token) => {
        const taskWithId = {
          id: uuidv4(), // Generate a unique temporary ID
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
          if (!navigator.onLine) {
            await saveTaskAction("add", taskWithId);
          } else {
            set((state) => ({
              tasks: state.tasks.filter((task) => task.id !== taskWithId.id)
            }));
          }
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
          if (!navigator.onLine) {
            await saveTaskAction("update", { id: taskId, ...updatedFields });
          }
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
          if (!navigator.onLine) {
            await saveTaskAction("delete", { id: taskId });
          } else {
            set((state) => ({
              tasks: [...state.tasks, get().tasks.find((task) => task.id === taskId)]
            }));
          }
        }
      }
    }),
    { name: "tasks" } // Persist tasks in local storage
  )
);

export const syncOfflineTasks = async (access_token) => {
  const pendingActions = await getPendingActions();

  for (const action of pendingActions) {
    try {
      if (action.type === "add") {
        await axios.post(`${API_URL}/tasks`, action.taskData, {
          headers: { Authorization: `Bearer ${access_token}` }
        });
      } else if (action.type === "update") {
        await axios.put(`${API_URL}/tasks/${action.taskId}`, action.taskData, {
          headers: { Authorization: `Bearer ${access_token}` }
        });
      } else if (action.type === "delete") {
        await axios.delete(`${API_URL}/tasks/${action.taskId}`, {
          headers: { Authorization: `Bearer ${access_token}` }
        });
      }
    } catch (error) {
      console.error(`Failed to sync ${action.type} for task ${action.taskId}`);
    }
  }

  // Remove successfully synced actions
  await removeSyncedActions(pendingActions.map((action) => action.id));
  toast.success("✅ Offline tasks synced!");
};

// Detect when online and sync tasks
window.addEventListener("online", async () => {
  const authState = JSON.parse(localStorage.getItem("authState"));
  if (authState?.access_token) {
    await syncOfflineTasks(authState.access_token);
  }
});

export default useTaskStore;
