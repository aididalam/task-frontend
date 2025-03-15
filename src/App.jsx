import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Navigate } from "react-router-dom";
import TasksList from "./pages/TasksList";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Import the AuthProvider

// Create an instance of QueryClient
const queryClient = new QueryClient();

const App = () => {
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
  const { authState } = useAuth();

  return (
    <Routes>
      {/* Login Route */}
      <Route path="/login" element={authState ? <Navigate to="/tasks" /> : <Login />} />

      {/* Register Route */}
      <Route path="/register" element={authState ? <Navigate to="/tasks" /> : <Register />} />

      {/* Protected Route for Tasks List */}
      <Route path="/tasks" element={authState ? <TasksList /> : <Navigate to="/login" />} />

      {/* Default Route (redirect to /login if no route is matched) */}
      <Route path="*" element={authState ? <Navigate to="/tasks" /> : <Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
