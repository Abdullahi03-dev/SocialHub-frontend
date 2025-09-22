import axios from "axios";

const api = axios.create({
  baseURL: "https://socialhub-backend-se80.onrender.com", // adjust to your backend
  withCredentials: true,            // send cookies
});

export default api;
