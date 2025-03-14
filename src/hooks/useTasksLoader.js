import { useQuery } from "@tanstack/react-query";
import axios from "axios";
// import useAuthStore from "../store/useAuthStore";

const useTasksLoader = (search = "", startDate = "", endDate = "") => {
  //   const { accessToken } = useAuthStore();
  return useQuery({
    queryKey: ["tasks", search, startDate, endDate], // Add startDate and endDate to the queryKey to invalidate the query when these change
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

      const response = await axios.get(`http://localhost:5001/tasks${queryParams ? "?" + queryParams : ""}`, {
        // headers: { Authorization: accessToken ? `Bearer ${accessToken}` : "" },
      });
      return response.data;
    }
  });
};

export default useTasksLoader;
