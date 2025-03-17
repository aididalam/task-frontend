import Dexie from "dexie";

// Initialize IndexedDB
const dexieStore = new Dexie("TaskDB");
dexieStore.version(1).stores({
  pendingActions: "++id, type, taskId, created_at" // Unified store with timestamp
});

// Save Task Action Offline (Add, Update, Delete)
export const saveTaskAction = async (type, task) => {
  await dexieStore.pendingActions.add({
    type, // "add", "update", "delete"
    taskId: task.id,
    taskData: task, // Full task object for "add" and "update"
    created_at: Date.now() // Maintain sync order
  });
};

// Get All Pending Actions (Ordered by Timestamp)
export const getPendingActions = async () => {
  return await dexieStore.pendingActions.orderBy("created_at").toArray();
};

// Delete Synced Actions
export const removeSyncedActions = async (actionIds) => {
  await dexieStore.pendingActions.bulkDelete(actionIds);
};

// Clear All Pending Actions (For Debugging)
export const clearAllActions = async () => {
  await dexieStore.pendingActions.clear();
};

export default dexieStore;
