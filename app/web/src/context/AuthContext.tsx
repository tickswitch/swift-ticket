import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Navigate, Outlet } from "react-router";
import axios from "axios";
import { setAuthToken } from "@/API/API";
import toast from "react-hot-toast";

// User interface
export interface User {
  id: string;
  email: string;
  name?: string;
  // Add other user properties as needed
}

// Auth context interface
interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string, options?: { silent?: boolean }) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  loading: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing auth state on mount
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // Check if we have a token in localStorage
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
          setAuthToken(token);
          setCurrentUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Auth state check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const login = async (email: string, password: string, options?: { silent?: boolean }): Promise<void> => {
    try {
      setLoading(true);

      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/login`, {
        email,
        password,
      });

      // Set token and user data
      setAuthToken(res?.data?.token);
      localStorage.setItem("token", res?.data?.token);
      localStorage.setItem("user", JSON.stringify(res?.data?.userData));
      localStorage.setItem("email", JSON.stringify(res?.data?.userData?.email));

      setCurrentUser(res?.data?.userData);

      // Show success message
      toast.success(res.data.message || "Login successful!");
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Login failed";
      if (!options?.silent) toast.error(errMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      // Clear token and user data
      setAuthToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("email");

      setCurrentUser(null);
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name?: string
  ): Promise<void> => {
    try {
      setLoading(true);
      // Replace with actual API call
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/register`,
        {
          email,
          password,
          name,
        }
      );

      // Set token and user data
      setAuthToken(res?.data?.token);
      localStorage.setItem("token", res?.data?.token);
      localStorage.setItem("user", JSON.stringify(res?.data?.userData));
      localStorage.setItem("email", JSON.stringify(res?.data?.userData?.email));

      setCurrentUser(res?.data?.userData);

      // Show success message
      toast.success(res.data.message || "Registration successful!");
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Registration failed";
      toast.error(errMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    currentUser,
    login,
    logout,
    register,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Protected Route component
export const ProtectedRoute: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default AuthContext;
