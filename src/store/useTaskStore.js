import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      setTasks: (tasks) => set({ tasks }),

      moveTask: async (taskId, newStatus) => {
        const tasks = get().tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task));
        set({ tasks });

        // API call to update task status
        try {
          await axios.put(`http://localhost:5001/tasks/${taskId}`, { status: newStatus });
        } catch (error) {
          console.error("Failed to update task:", error);
          // Optionally handle error by reverting the status if needed
        }
      }
    }),
    { name: "tasks" } // Persist tasks in local storage
  )
);

export default useTaskStore;
