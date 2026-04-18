
import { ReactNode } from "react";

interface PublicOnlyRouteProps {
  children: ReactNode;
}  

const PublicOnlyRoute = ({ children }: PublicOnlyRouteProps) => {
  // const { currentUser } = useAuth();

  // if (currentUser) {
  //   return <Navigate to="/dashboard" replace />;
  // }

  return children;
};

export default PublicOnlyRoute;
