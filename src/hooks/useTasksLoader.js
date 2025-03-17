import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import useTaskStore from "../store/useTaskStore";

const useTasksLoader = (search = "", startDate = "", endDate = "", selectedStatuses = []) => {
  const { authState } = useAuth();
  const wsRef = useRef(null);
  const { setTasks } = useTaskStore();

  useEffect(() => {
    // Only create WebSocket connection if it doesn't exist
    if (!wsRef.current) {
      const wsUrl = `${import.meta.env.VITE_WEB_SOCKET_URL}`; // Change this to your WebSocket URL

      // WebSocket options
      const wsOptions = {
        maxRetries: 3, // max retries before giving up
        reconnectInterval: 2000 // 2 seconds between attempts
      };

      // Initialize ReconnectingWebSocket with options
      wsRef.current = new ReconnectingWebSocket(wsUrl, null, wsOptions);

      // Event handlers for WebSocket
      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data); // Convert string to object

          const { type, task } = data;
          const tasks = useTaskStore.getState().tasks;
          if (type === "task_update") {
            console.log("Task:", task);
            setTasks(tasks.map((t) => (t.id === task.id ? { ...t, ...task } : t)));
          } else if (type === "task_delete") {
            setTasks(tasks.filter((t) => t.id !== task.id));
          } else if (type === "task_added") {
            const isDuplicate = tasks.some((t) => t.id === task.id);
            if (!isDuplicate) {
              // Only add the task if it's not a duplicate
              setTasks([...tasks, task]);
            } else {
              console.log(`Task with ID ${task.id} already exists, not adding.`);
            }
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket disconnected, attempting to reconnect...");
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }

    // Cleanup on component unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs only once

  const filteredStatuses = Object.entries(selectedStatuses)
    .filter(([status, isSelected]) => isSelected)
    .map(([status]) => status);

  return useQuery({
    queryKey: ["tasks", search, startDate, endDate, ...filteredStatuses],
    queryFn: async () => {
      // Construct query params
      let queryParams = "";
      if (search) queryParams += `q=${search}`;
      if (startDate) {
        queryParams += `${queryParams ? "&" : ""}startDate=${startDate}`;
      }
      if (endDate) {
        queryParams += `${queryParams ? "&" : ""}endDate=${endDate}`;
      }

      if (filteredStatuses.length > 0) {
        queryParams += `${queryParams ? "&" : ""}statuses=${filteredStatuses.join(",")}`;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/tasks${queryParams ? "?" + queryParams : ""}`,
        {
          headers: {
            Authorization: authState?.access_token ? `Bearer ${authState.access_token}` : ""
          }
        }
      );
      return response.data;
    }
  });
};

export default useTasksLoader;
