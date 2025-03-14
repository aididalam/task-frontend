import { useQuery } from "@tanstack/react-query";
import axios from "axios";
// import useAuthStore from "../store/useAuthStore";

const useTasksLoader = (search = "") => {
  //   const { accessToken } = useAuthStore();
  return useQuery({
    queryKey: ["tasks", search],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:5001/tasks${search ? `?q=${search}` : ""}`, {
        // headers: { Authorization: accessToken ? `Bearer ${accessToken}` : "" },
      });
      return response.data;
    }
  });
};

export default useTasksLoader;
