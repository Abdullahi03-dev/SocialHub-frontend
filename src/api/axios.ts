import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // adjust to your backend
  withCredentials: true,            // send cookies
});

export default api;
