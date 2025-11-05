import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { checkAuth } from "@/api/auth";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const verify = async () => {
      const authStatus = await checkAuth();
      setIsAuth(authStatus);
    };
    verify();
  }, []);

  if (isAuth === null) return <div>Loading...</div>;

  return isAuth ? <>{children}</> : <Navigate to="/auth" />;
};

export default ProtectedRoute;
