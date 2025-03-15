import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
// import useAuthStore from "../store/useAuthStore";

const useTasksLoader = (search = "", startDate = "", endDate = "", selectedStatuses = []) => {
  const { authState } = useAuth();
  const filteredStatuses = Object.entries(selectedStatuses)
    .filter(([status, isSelected]) => isSelected)
    .map(([status]) => status);

  return useQuery({
    queryKey: ["tasks", search, startDate, endDate, ...filteredStatuses], // Add startDate and endDate to the queryKey to invalidate the query when these change
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
