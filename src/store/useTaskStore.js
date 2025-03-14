import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      setTasks: (tasks) => set({ tasks }),

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
      }
    }),
    { name: "tasks" } // Persist tasks in local storage
  )
);

export default useTaskStore;
