// src/api/axios.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,        // only root URL here
  withCredentials: true,   // send cookies with every request
});

export default api;
