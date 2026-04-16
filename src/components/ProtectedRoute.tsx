import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};