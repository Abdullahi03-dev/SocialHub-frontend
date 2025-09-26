// // src/context/AuthContext.tsx
// import React, { createContext, useContext, useEffect, useState } from "react";
// import api from "../api/axios";

// type User = {
//   id: number;
//   email: string;
//   name: string;
//   role: string;
// } | null;

// type AuthContextType = {
//   userDetails: User;
//   loading: boolean;
//   refreshUser: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [userDetails, setUserDetails] = useState<User>(null);
//   const [loading, setLoading] = useState(true);

//   const fetchUser = async () => {
//     try {
//       const res = await api.get("/auth/details"); // ✅ relative path
//       setUserDetails(res.data);
//     } catch (err) {
//       console.error("Failed to fetch user:", err);
//       setUserDetails(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ userDetails, loading, refreshUser: fetchUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// };
