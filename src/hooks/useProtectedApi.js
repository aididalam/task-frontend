import { useQuery } from "@tanstack/react-query";
import axios from "axios";
// import useAuthStore from "../store/useAuthStore";

const useProtectedApi = (key, url, options = {}) => {
  //   const { accessToken } = useAuthStore();
  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      const response = await axios.get(url, {
        // headers: { Authorization: accessToken ? `Bearer ${accessToken}` : "" },
      });
      return response.data;
    },
    ...options
  });
};

export default useProtectedApi;
