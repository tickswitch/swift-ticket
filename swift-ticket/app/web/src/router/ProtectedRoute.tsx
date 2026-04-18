import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }: {children : React.ReactNode}) => {
  const {  loading } = useAuth();
  const token = localStorage.getItem("token");

  if (loading) {
    return <div>Loading...</div>; // Or your preferred loading state
  }

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
