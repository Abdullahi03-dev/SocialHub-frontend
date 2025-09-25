import axios from "axios";
const API_URL=import.meta.env.VITE_API_URL
const api = axios.create({
  baseURL: `${API_URL}`, // adjust to your backend
  withCredentials: true,            // send cookies
});

export default api;
