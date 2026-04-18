import { useState } from "react";
import { bannerBg } from "@/assets";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import axios from "axios";

const Forgot_password = () => {
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  const handleForgot_password = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    if (!email) {
      toast.error("Please provide the email");
      return;
    }

    try {
      setIsPending(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/forgot-password`,
        { email }
      );
      localStorage.setItem("email", JSON.stringify(email));
      toast.success(res?.data?.data?.message || res?.data?.message);
      navigate("/auth/varification-code");
    } catch (error: any) {
      const emailError = error?.response?.data?.error;
      toast.error(
        emailError || error?.message || "An unexpected error occurred"
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen overflow-hidden relative">
      <img
        src={bannerBg}
        alt="Forgot_password-image"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-primary001 mix-blend-hue" />
      <div className="absolute top-0 left-0 w-full h-full bg-black/70" />
      <div className="w-full md:w-[580px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-5xl rounded-4xl border p-5">
        <div className="flex flex-col items-center gap-2">
          <p className="text-[32px] font-semibold text-white">
            Forgot Password
          </p>
          <p className="text-white pb-3">
            Enter your email to reset your password
          </p>
        </div>
        <div className="pt-4 flex flex-col gap-3">
          <form
            className="flex flex-col gap-3"
            onSubmit={handleForgot_password}
          >
            <div className="flex flex-col gap-3">
              <label className="text-white/50">Email address</label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Enter email"
                required
                className="border border-white/50 rounded-md px-3 py-3 w-full text-white/50"
              />
            </div>
            <div className="pt-5">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full rounded-full font-medium text-xl bg-primary001 hover:bg-primary001 h-14"
              >
                {isPending ? "Sending..." : "Send Code"}
              </Button>
            </div>
            <Link to={"/auth/login"}>
              <Button
                type="button"
                className="w-full text-white/60 font-medium rounded-full text-sm bg-transparent hover:bg-transparent h-14"
              >
                Back to Login
              </Button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Forgot_password;
