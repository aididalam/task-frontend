Here is the updated README with the new details:

---

# Task Manager App - Frontend

This is the frontend for a **Task Manager App** built with **ReactJS**, using features such as JWT authentication, real-time updates via WebSocket, and offline support with **PWA**. The application allows users to create, update, delete, filter, and search tasks with an intuitive, responsive UI.

## Demo URL
You can access the live demo of the application at:  
[http://178.16.142.140:8333](http://178.16.142.140:8333)

### Demo Credentials
- **Email**: task@task.com
- **Password**: task1234

## Features
- **Authentication**: Demonstrates the use of JWT for secure authentication.
- **Component-based Architecture**: Reusable React components for modular design.
- **State Management**: Uses **React Query** for fetching and caching data, and **Zustand** for managing the task store.
- **Task List Page**:  
    - Display tasks in a list with columns.
    - Sorting and filtering tasks by status (To Do, In Progress, Done) and due date.
    - Search tasks with debounced search bar.
    - Inline editing (click to edit task name, description, and status).
    - Drag-and-drop support to move tasks between different statuses.
- **Task Creation Form**:  
    - Uses **Formik** and **Yup** for form validation (required fields, max length, proper date format).
    - Optimistic UI updates for real-time user experience (using Zustand).
    - Tailwind CSS used for responsive, modern styling.
    - Basic animations (e.g., transitions when moving tasks).
- **WebSocket Integration**:  
    - Real-time updates for task changes.
- **Offline Support (PWA)**:  
    - Uses **Dexie.js** to store tasks in IndexedDB when offline and sync when the app is online again.

## Setup Instructions

1. Clone the repository:

    ```bash
    git clone https://github.com/aididalam/task-frontend
    cd task-frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up the `.env` file by copying `.env.example` and updating it with the following:

    ```env
    VITE_API_URL=http://127.0.0.1:8330
    VITE_WEB_SOCKET_URL=ws://127.0.0.1:8331
    ```

4. Run the app in development mode:

    ```bash
    npm run dev
    ```

5. To build and preview the PWA version:

    ```bash
    npm run build && npm run preview
    ```

## Technologies Used
- **ReactJS**: JavaScript library for building user interfaces.
- **React Query**: Data fetching and state management.
- **Zustand**: State management for global tasks.
- **Tailwind CSS**: Utility-first CSS framework.
- **WebSocket**: Real-time communication for task updates.
- **Dexie.js**: IndexedDB wrapper for offline storage.
- **Vite**: Build tool for fast development.

## How the App Uses Key Libraries and Features:

### **Zustand** (State Management)
Zustand is used to manage the state of tasks locally before sending any updates to the server. When changes are made, the state is first updated optimistically in the app and then synced with the server.

### **React Query** (Data Fetching and Caching)
React Query is used to fetch and cache task data from the backend. The query key is set dynamically with filters such as `search`, `startDate`, `endDate`, and `filteredStatuses` to fetch filtered task data.

```js
queryKey: ["tasks", search, startDate, endDate, ...filteredStatuses]
```

### **WebSocket** (Real-Time Updates)
WebSocket is used to provide real-time updates on task changes (edit, delete, add). Whenever a task is edited, deleted, or added, the task list is updated instantly without needing a page refresh.

### **Dexie.js** (Offline Support)
Dexie.js is used to store tasks locally in **IndexedDB** when the app is offline. When the app regains internet access, the stored data is synced with the server, allowing the user to continue working seamlessly without interruption.

### **Debounced Search**
A debounced search feature is used to reduce unnecessary server requests while the user is typing. It waits for the user to stop typing for a set amount of time before sending the search query to the backend.

### **Drag-and-Drop**
The application utilizes **react-dnd** with **TouchBackend** for mobile and **HTML5Backend** for PC to enable drag-and-drop functionality to rearrange tasks across different status columns.

### **Formik and Yup** (Form Validation)
Formik is used to handle form state, while Yup is used for form validation. Validation includes checking for required fields, ensuring proper date format, and checking for max length, ensuring a user-friendly experience when creating or editing tasks.

