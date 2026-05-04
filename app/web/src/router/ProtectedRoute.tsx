import { useAuth } from "@/context/AuthContext";
import { Navigate, useLocation } from "react-router";
import toast from "react-hot-toast";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuth();
  const token = localStorage.getItem("token");
  const location = useLocation();

  useEffect(() => {
    if (!loading && !token) {
      toast.error("Please log in to continue.");
    }
  }, [loading, token]);

  if (loading) return <div>Loading...</div>;

  if (!token) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;
