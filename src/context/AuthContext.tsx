// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

type User = {
  id: number;
  email: string;
  name: string;
  role: string;
} | null;

type AuthContextType = {
  userDetails: User;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userDetails, setUserDetails] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  //  get user details if token exists
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserDetails(null);
        setLoading(false);
        return;
      }

      const res = await api.get("/auth/details", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserDetails(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setUserDetails(null);
      localStorage.removeItem("token"); // clear invalid token
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ userDetails, loading, refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
