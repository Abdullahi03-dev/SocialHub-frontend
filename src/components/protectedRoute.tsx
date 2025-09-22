import { useEffect, useState,type ReactNode } from "react";
import { checkAuth } from "../api/auth";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth().then(auth => setIsAuth(auth));
  }, []);

  if (isAuth === null) return <div>Loading...</div>; // spinner or skeleton

  return isAuth ? <>{children}</> : <Navigate to="/auth" />;
};

export default ProtectedRoute;