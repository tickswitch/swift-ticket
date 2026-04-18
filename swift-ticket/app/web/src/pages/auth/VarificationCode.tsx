import { bannerBg } from "@/assets";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const VerificationCode = () => {
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0); // countdown state (seconds)
  const email = JSON.parse(localStorage.getItem("email") || "null");

  // countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerificationCode = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    if (otp.length !== 4) {
      toast.error("Please enter a 4-digit code");
      return;
    }

    try {
      setIsPending(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/verify-otp`,
        { email, otp }
      );

      localStorage.setItem(
        "remember_token",
        JSON.stringify(res?.data?.remember_token)
      );

      toast.success(res?.data?.data?.message || res?.data?.message);
      navigate("/auth/new-password");
    } catch (error: any) {
      const emailError = error?.response?.data?.errors;
      toast.error(emailError || error?.message || "An unexpected error occurred");
    } finally {
      setIsPending(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/resend-otp`,
        { email }
      );
      toast.success(res?.data?.message || "Code resent successfully");

      // start 1-minute cooldown
      setCooldown(60);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to resend code");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen overflow-hidden relative">
      <img
        src={bannerBg}
        alt="VerificationCode-image"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-primary001 mix-blend-hue" />
      <div className="absolute top-0 left-0 w-full h-full bg-black/70" />
      <div className="md:w-[580px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full lg:w-[50%] max-w-5xl rounded-4xl border p-5">
        <div className="flex flex-col items-center gap-2">
          <p className="text-[32px] font-semibold text-white">
            Enter Verification Code
          </p>
          <p className="text-white pb-3">
            Please enter the verification code sent to your email
          </p>
        </div>
        <div className="pt-4 flex flex-col gap-3">
          <form
            className="flex flex-col gap-3"
            onSubmit={handleVerificationCode}
          >
            <div className="flex flex-col gap-3 items-center justify-center">
              <InputOTP maxLength={4} value={otp} onChange={setOtp}>
                <InputOTPGroup className="flex items-center gap-4">
                  {[0, 1, 2, 3].map((i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="w-8 p-8 border rounded-md text-2xl text-white"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div className="pt-5 flex items-center justify-center">
              <Button
                type="submit"
                className="w-[50%] rounded-full font-medium text-xl bg-primary001 hover:bg-primary001 h-14"
                disabled={isPending}
              >
                {isPending ? "Verifying..." : "Verify Code"}
              </Button>
            </div>
            <div>
              <Button
                type="button"
                onClick={handleResendCode}
                className="w-full text-white/60 font-medium rounded-full text-sm bg-transparent hover:bg-transparent h-14"
                disabled={cooldown > 0} // disable while cooldown active
              >
                {cooldown > 0
                  ? `Resend Code in ${cooldown}s`
                  : "Resend Code"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerificationCode;
