import axios from "axios";
const API_URL=import.meta.env.VITE_API_URL
const api = axios.create({
  baseURL: `${API_URL}/auth/details`, 
  withCredentials: true,         
});

export default api;
