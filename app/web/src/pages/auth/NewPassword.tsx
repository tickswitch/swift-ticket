import { bannerBg } from "@/assets";
import { Button } from "@/components/ui/button";
import { EyeIcon, GreenCheckIcon } from "./AuthIcons";
import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState({ first: false, second: false });
  const [isPending, setIsPending] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const password = formData.get("new_password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (!password || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      setIsPending(true);
      const email = JSON.parse(localStorage.getItem("email") || "null");
      const rememberToken = JSON.parse(localStorage.getItem("remember_token") || "null");

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/reset-password`,
        {
          email,
          password,
          password_confirmation: confirmPassword,
          remember_token: rememberToken,
        }
      );

      toast.success(res?.data?.data?.message || res?.data?.message);
      navigate("/auth/login");
    } catch (error: any) {
      const emailError = error?.response?.data?.error;
      toast.error(emailError || error?.message || "An unexpected error occurred");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen overflow-hidden relative">
      <img
        src={bannerBg}
        alt="Register-image"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-primary001 mix-blend-hue" />
      <div className="absolute top-0 left-0 w-full h-full bg-black/70" />

      <div className="md:w-[580px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] lg:w-[50%] max-w-5xl rounded-4xl border p-5">
        <div className="pt-4 flex flex-col gap-3">
          <div className="text-white flex flex-col items-center justify-center">
            <p className="text-[32px] font-semibold text-white">Create New Password</p>
            <p className="pt-2">Please create a strong password for your account</p>
          </div>
          <form className="flex flex-col gap-3" onSubmit={handleRegister}>
            <div className="flex flex-col gap-3">
              <button
                onClick={() =>
                  setShowPass((prev) => ({ ...prev, first: !prev.first }))
                }
                type="button"
                className="flex items-center justify-end text-white/50 gap-1 bg-transparent hover:bg-transparent"
              >
                <EyeIcon /> {showPass.first ? "Hide" : "Show"}
              </button>
              <input
                type={showPass.first ? "text" : "password"}
                name="new_password"
                autoComplete="new-password"
                placeholder="Password"
                required
                className="border border-white/50 rounded-md px-3 py-3 w-full text-white/50"
              />
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() =>
                  setShowPass((prev) => ({ ...prev, second: !prev.second }))
                }
                type="button"
                className="flex items-center justify-end text-white/50 gap-1 bg-transparent hover:bg-transparent"
              >
                <EyeIcon /> {showPass.second ? "Hide" : "Show"}
              </button>
              <input
                type={showPass.second ? "text" : "password"}
                name="confirm_password"
                autoComplete="new-password"
                placeholder="Confirm Password"
                required
                className="border border-white/50 rounded-md px-3 py-3 w-full text-white/50"
              />
            </div>

            <div className="py-5 grid grid-cols-2 gap-4 text-green-500">
              <p className={cn("flex items-center gap-2")}>
                <GreenCheckIcon />
                Uppercase letter
              </p>
              <p className={cn("flex items-center gap-2")}>
                <GreenCheckIcon />
                Lowercase letter
              </p>
              <p className={cn("flex items-center gap-2")}>
                <GreenCheckIcon />
                Number
              </p>
              <p className={cn("flex items-center gap-2")}>
                <GreenCheckIcon />
                Special character
              </p>
              <p className={cn("flex items-center gap-2")}>
                <GreenCheckIcon />
                8+ characters
              </p>
            </div>

            <div className="pt-5">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full rounded-full font-medium text-xl bg-primary001 hover:bg-primary001 h-14"
              >
                {isPending ? "Processing..." : "Change"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
