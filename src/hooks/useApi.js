import { useState } from "react";

const useApi = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [code, setCode] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchApi = async (endpoint, method = "GET", options = {}) => {
    setLoading(true);
    setError(null);
    setData(null);
    setCode(null);

    const API_URL = import.meta.env.VITE_API_URL; // Get API base URL
    const url = `${API_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}) // Allow custom headers
        },
        body: options.body ? JSON.stringify(options.body) : null
      });

      const responseData = await response.json();
      setCode(response.status);

      if (!response.ok) {
        setError(responseData || { message: "An error occurred" }); // Set the error message from the response
      } else {
        setData(responseData);
      }
      return responseData;
    } catch (err) {
      setError({ message: err.message || "Network error" }); // Set error message on failure
    } finally {
      setLoading(false);
    }
  };

  return { fetchApi, data, error, code, loading };
};

export default useApi;
