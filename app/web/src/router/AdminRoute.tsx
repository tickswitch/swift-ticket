import { Navigate, useLocation } from 'react-router';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  })();

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!token) toast.error('Please log in to continue.');
    else if (!isAdmin) toast.error('Access denied. Admins only.');
  }, [token, isAdmin]);

  if (!token) return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default AdminRoute;
