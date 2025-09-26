// src/api/auth.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// -------------------
// REGISTER
// -------------------
export const register = async (name: string, email: string, password: string) => {
  try {
    const res = await axios.post(
      `${API_URL}/auth/signup`,
      { name, email, password },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  } catch (e: any) {
    throw e.response?.data?.detail || "SIGNUP FAILED";
  }
};

// -------------------
// LOGIN
// -------------------
export const login = async (email: string, password: string) => {
  try {
    const res = await axios.post(
      `${API_URL}/auth/signin`,
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );

    // ✅ Store JWT from backend response
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
    }

    return res.data;
  } catch (e: any) {
    throw e.response?.data?.detail || "LOGIN FAILED";
  }
};

// -------------------
// CHECK AUTH
// -------------------
export const checkAuth = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;

    const res = await axios.get(`${API_URL}/auth/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return !!res.data;
  } catch {
    return false;
  }
};

// -------------------
// LOGOUT HELPER
// -------------------
// export const logout = () => {
//   localStorage.removeItem("token");
// };
