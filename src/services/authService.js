import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Update with your backend API URL

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const register = async (firstName, lastName, email, password) => {
  const response = await axios.post(`${API_URL}/register`, {
    firstName,
    lastName,
    email,
    password
  });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("auth_token"); // Clear token from localStorage on logout
};
