import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Navigate } from "react-router-dom";
import TasksList from "./pages/TasksList";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./Components/Universal/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "./utils/constant";

// Import the AuthProvider

// Create an instance of QueryClient
const queryClient = new QueryClient();

const App = () => {
  console.log("API", API_URL);
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

const AppRoutes = () => {
  const { authState, isAuthReady } = useAuth();
  return (
    <>
      <ToastContainer />
      {!isAuthReady ? (
        <div className="flex justify-center items-center h-screen bg-white">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
        </div>
      ) : (
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={authState ? <Navigate to="/tasks" /> : <Login />} />

          {/* Register Route */}
          <Route path="/register" element={authState ? <Navigate to="/tasks" /> : <Register />} />

          {/* Protected Route for Tasks List */}
          <Route
            path="/tasks"
            element={
              authState ? (
                <>
                  <Navbar />
                  <TasksList />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Default Route (redirect to /login if no route is matched) */}
          <Route path="*" element={authState ? <Navigate to="/tasks" /> : <Navigate to="/login" />} />
        </Routes>
      )}
    </>
  );
};

export default App;
