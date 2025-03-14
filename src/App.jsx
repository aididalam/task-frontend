import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/Login";
import Register from "./pages/Register";
import useAuthStore from "./store/auth";
import { Navigate } from "react-router-dom";
import TasksList from "./pages/TasksList";

// Create an instance of QueryClient
const queryClient = new QueryClient();

const App = () => {
  const token = useAuthStore((state) => state.token);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Register Route */}
          <Route path="/register" element={<Register />} />

          {/* TaskList Route: Protect this with authentication check */}
          <Route path="/tasks" element={!token ? <TasksList /> : <Navigate to="/login" />} />

          {/* Default Route (redirect to /login if no route is matched) */}
          <Route path="/" element={token ? <Navigate to="/tasks" /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
