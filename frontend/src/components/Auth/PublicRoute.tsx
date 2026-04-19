import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/components/Auth/AuthContext";

export function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  return isAuthenticated ? <Navigate to="/mock-exams" replace /> : <Outlet />;
}
