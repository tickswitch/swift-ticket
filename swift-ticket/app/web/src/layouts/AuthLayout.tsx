import Forgot_password from "@/pages/auth/Forgot_password";
import Login from "@/pages/auth/Login";
import NewPassword from "@/pages/auth/NewPassword";
import Register from "@/pages/auth/Register";
import VarificationCode from "@/pages/auth/VarificationCode";
import { useLocation } from "react-router";

const AuthLayout = () => {
  const { pathname } = useLocation();
  console.log("pathanme", pathname);
  const login = "/auth/login";
  const register = "/auth/register";
  const forgot_password = "/auth/forgot-password";
  const varification_code = "/auth/varification-code";
  const new_password = "/auth/new-password";
  return (
    <div>
      {(pathname === login && <Login />) ||
        (pathname === register && <Register />) ||
        (pathname === forgot_password && <Forgot_password />) ||
        (pathname === varification_code && <VarificationCode />) ||
        (pathname === new_password && <NewPassword />)  
        }
    </div>
  );
};

export default AuthLayout;
