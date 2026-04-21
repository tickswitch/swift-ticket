import { bannerBg } from "@/assets";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router";
import { AppleIcon, EyeIcon, FacebookIcon, GoogleIcon } from "./AuthIcons";
import { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { setAuthToken } from "@/API/API";

// Google OAuth types
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (
            element: HTMLElement,
            config: Record<string, unknown>
          ) => void;
          prompt: () => void;
          revoke: (accessToken: string, callback: () => void) => void;
        };
        oauth2: {
          initTokenClient: (
            config: Record<string, unknown>
          ) => { requestAccessToken: (opts?: Record<string, unknown>) => void };
        };
      };
    };
  }
}

type AuthTab = "email" | "emailOtp";
type OtpScreen = "enter-email" | "enter-otp";

const RESEND_COOLDOWN_SECONDS = 30;

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<AuthTab>("email");

  // Email OTP flow state
  const [otpScreen, setOtpScreen] = useState<OtpScreen>("enter-email");
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const navigate = useNavigate();
  const { state } = useLocation();
  const redirectTo: string = (state as any)?.from ?? "/";
  const { login } = useAuth();

  const otpEmailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(otpEmail);

  // Load Google OAuth script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      );
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  // Resend cooldown timer (only while on OTP screen)
  useEffect(() => {
    if (otpScreen !== "enter-otp" || resendCooldown <= 0) return;
    const id = window.setTimeout(
      () => setResendCooldown((s) => s - 1),
      1000
    );
    return () => window.clearTimeout(id);
  }, [resendCooldown, otpScreen]);

  const handleGoogleSignIn = async () => {
    if (!window.google) {
      toast.error("Google OAuth not loaded properly");
      return;
    }

    setIsGoogleLoading(true);

    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: "email profile openid",
        callback: async (response: { access_token?: string; error?: string }) => {
          if (response.error) {
            console.error("Google OAuth error:", response.error);
            toast.error("Google authentication failed");
            setIsGoogleLoading(false);
            return;
          }

          try {
            const userInfoResponse = await fetch(
              `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${response.access_token}`
            );

            if (!userInfoResponse.ok) {
              throw new Error("Failed to fetch user info");
            }

            const res = await axios.post(
              `${import.meta.env.VITE_BASE_URL}/social-login`,
              {
                provider: "google",
                token: response.access_token,
              }
            );

            if (res.data) {
              localStorage.setItem("token", res?.data?.token);
              toast.success("Google login successful");
              navigate(redirectTo);
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
          } catch (error) {
            console.log("Google OAuth API error", error);
            const msg =
              axios.isAxiosError(error) && error.response?.data?.errors
                ? String(error.response.data.errors)
                : "Google authentication failed.";
            toast.error(msg);
          } finally {
            setIsGoogleLoading(false);
          }
        },
      });

      tokenClient.requestAccessToken({ prompt: "consent" });
    } catch (error) {
      console.error("Google OAuth initialization error:", error);
      toast.error("Failed to initialize Google authentication");
      setIsGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    if (!data.email || !data.password) {
      toast.error("Please provide the necessary credentials.");
      return;
    }

    try {
      setIsPending(true);
      await login(data.email, data.password);
      navigate(redirectTo);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsPending(false);
    }
  };

  const handleSendOtp = async () => {
    if (!otpEmailIsValid) {
      toast.error("Enter a valid email address");
      return;
    }
    try {
      setIsSendingOtp(true);
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/email/send-otp`,
        { email: otpEmail }
      );
      toast.success("OTP sent to your email");
      setOtpCode("");
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setOtpScreen("enter-otp");
    } catch (error) {
      const msg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? String(error.response.data.message)
          : "Failed to send OTP";
      toast.error(msg);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }
    try {
      setIsVerifyingOtp(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/email/verify-otp`,
        { email: otpEmail, otp: otpCode }
      );
      const token = res?.data?.token;
      const userData = res?.data?.userData;
      if (!token) {
        throw new Error("No token in response");
      }
      setAuthToken(token);
      localStorage.setItem("token", token);
      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
      }
      toast.success(res?.data?.message || "Login successful");
      navigate(redirectTo);
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      const msg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? String(error.response.data.message)
          : "Failed to verify OTP";
      toast.error(msg);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    await handleSendOtp();
  };

  const handleBackToEmail = () => {
    setOtpScreen("enter-email");
    setOtpCode("");
    setResendCooldown(0);
  };

  const tabButtonCls = (isActive: boolean) =>
    `flex-1 py-2 sm:py-2.5 text-sm sm:text-base font-medium rounded-full transition-all duration-200 ${
      isActive
        ? "bg-white text-black"
        : "bg-transparent text-white/80 hover:text-white"
    }`;

  return (
    <div className="fixed inset-0 overflow-y-auto">
      {/* Fixed Background */}
      <div className="fixed inset-0">
        <img
          src={bannerBg}
          alt="login-image"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary001 mix-blend-hue" />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 min-h-screen">
        <div className="flex items-center justify-center min-h-screen p-4 py-8">
          <div className="w-full max-w-lg sm:max-w-xl lg:max-w-2xl py-20 xl:py-0">
            <div className="rounded-4xl border p-4 sm:p-6 lg:p-8 bg-black/20 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <p className="text-2xl sm:text-3xl lg:text-[32px] font-semibold text-white text-center">
                  Log in
                </p>
                <p className="text-white pb-2 sm:pb-3 text-center text-sm sm:text-base">
                  Don't have an account?{" "}
                  <Link
                    to={"/auth/register"}
                    className="underline hover:text-white/80 transition-colors"
                  >
                    Sign up
                  </Link>
                </p>

                {/* Social Login Buttons */}
                <div className="w-full space-y-2 sm:space-y-3">
                  <Button
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleLoading}
                    data-testid="google-login-btn"
                    className="w-full bg-white py-3 sm:py-4 h-10 sm:h-12 hover:bg-red-300 transition-all duration-300 hover:text-black rounded-full flex items-center justify-center gap-2 text-black text-base sm:text-lg font-medium"
                  >
                    {isGoogleLoading ? (
                      <BeatLoader color="#000000" size={6} />
                    ) : (
                      <>
                        <GoogleIcon />
                        <span className="hidden sm:inline">
                          Continue with Google
                        </span>
                        <span className="sm:hidden">Google</span>
                      </>
                    )}
                  </Button>
                  <Button className="w-full bg-white py-3 sm:py-4 h-10 sm:h-12 hover:bg-blue-300 transition-all duration-300 rounded-full flex items-center justify-center gap-2 text-black text-base sm:text-lg font-medium">
                    <FacebookIcon />
                    <span className="hidden sm:inline">
                      Continue with Facebook
                    </span>
                    <span className="sm:hidden">Facebook</span>
                  </Button>
                  <Button className="w-full bg-white py-3 sm:py-4 h-10 sm:h-12 hover:bg-gray-600 hover:text-white transition-all duration-300 rounded-full flex items-center justify-center gap-2 text-black text-base sm:text-lg font-medium">
                    <AppleIcon />
                    <span className="hidden sm:inline">
                      Continue with Apple
                    </span>
                    <span className="sm:hidden">Apple</span>
                  </Button>
                </div>
              </div>

              <div className="pt-3 sm:pt-4 flex flex-col gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <hr className="bg-gray-600 border-0 h-0.5 w-full" />
                  <p className="text-nowrap text-white text-sm sm:text-base lg:text-lg px-2">
                    Or continue with
                  </p>
                  <hr className="bg-gray-600 border-0 h-0.5 w-full" />
                </div>

                {/* Tabs */}
                <div
                  role="tablist"
                  aria-label="Login method"
                  className="flex gap-2 p-1 rounded-full border border-white/30 bg-white/5"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "email"}
                    data-testid="login-tab-email"
                    onClick={() => setActiveTab("email")}
                    className={tabButtonCls(activeTab === "email")}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "emailOtp"}
                    data-testid="login-tab-otp"
                    onClick={() => {
                      setActiveTab("emailOtp");
                      setOtpScreen("enter-email");
                    }}
                    className={tabButtonCls(activeTab === "emailOtp")}
                  >
                    Login with OTP
                  </button>
                </div>

                {activeTab === "email" && (
                  <form
                    className="flex flex-col gap-3 sm:gap-4"
                    onSubmit={handleLogin}
                    data-testid="email-login-form"
                  >
                    <div className="flex flex-col gap-2">
                      <label className="text-white/80 text-sm sm:text-base">
                        Email address or user name
                      </label>
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        data-testid="email-input"
                        className="border border-white/50 bg-white/10 backdrop-blur-sm rounded-md px-3 py-2.5 sm:py-3 w-full text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/20 transition-all duration-200 text-sm sm:text-base"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-white/80 text-sm sm:text-base flex items-center justify-between">
                        Password{" "}
                        <button
                          onClick={() => setShowPass(!showPass)}
                          type="button"
                          className="flex items-center gap-1 bg-transparent hover:bg-transparent text-white/60 hover:text-white text-xs sm:text-sm transition-colors"
                        >
                          <EyeIcon /> {showPass ? "Hide" : "Show"}
                        </button>
                      </label>
                      <input
                        type={showPass ? "text" : "password"}
                        name="password"
                        autoComplete="current-password"
                        required
                        data-testid="password-input"
                        className="border border-white/50 bg-white/10 backdrop-blur-sm rounded-md px-3 py-2.5 sm:py-3 w-full text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/20 transition-all duration-200 text-sm sm:text-base"
                        placeholder="Enter your password"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-white/80 text-sm sm:text-base">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="remember_me"
                          className="w-4 h-4 text-primary001 bg-white/10 border-white/50 rounded focus:ring-primary001"
                        />
                        <label htmlFor="remember_me">Remember Me</label>
                      </div>
                      <Link
                        to={"/auth/forgot-password"}
                        className="underline hover:text-white transition-colors"
                      >
                        Forgot Password?
                      </Link>
                    </div>

                    <div className="pt-3 sm:pt-5">
                      <Button
                        type="submit"
                        data-testid="email-login-submit"
                        className="w-full rounded-full font-medium text-lg sm:text-xl bg-primary001 hover:bg-primary001/90 h-12 sm:h-14 flex items-center justify-center transition-all duration-300"
                        disabled={isPending}
                      >
                        {isPending ? (
                          <div className="flex items-center justify-center">
                            <BeatLoader color="#ffffff" size={8} />
                          </div>
                        ) : (
                          "Log in"
                        )}
                      </Button>
                    </div>
                  </form>
                )}

                {activeTab === "emailOtp" && otpScreen === "enter-email" && (
                  <div
                    className="flex flex-col gap-3 sm:gap-4"
                    data-testid="otp-enter-email"
                  >
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="otp-email-input"
                        className="text-white/80 text-sm sm:text-base"
                      >
                        Email address
                      </label>
                      <input
                        id="otp-email-input"
                        type="email"
                        autoComplete="email"
                        value={otpEmail}
                        onChange={(e) => setOtpEmail(e.target.value.trim())}
                        data-testid="otp-email-input"
                        className="border border-white/50 bg-white/10 backdrop-blur-sm rounded-md px-3 py-2.5 sm:py-3 w-full text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/20 transition-all duration-200 text-sm sm:text-base"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="pt-2 sm:pt-3">
                      <Button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={!otpEmailIsValid || isSendingOtp}
                        data-testid="send-otp-btn"
                        className="w-full rounded-full font-medium text-lg sm:text-xl bg-primary001 hover:bg-primary001/90 h-12 sm:h-14 flex items-center justify-center transition-all duration-300"
                      >
                        {isSendingOtp ? (
                          <BeatLoader color="#ffffff" size={8} />
                        ) : (
                          "Send OTP"
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === "emailOtp" && otpScreen === "enter-otp" && (
                  <div
                    className="flex flex-col gap-3 sm:gap-4"
                    data-testid="email-enter-otp"
                  >
                    <div className="flex flex-col gap-2">
                      <p className="text-white/80 text-sm sm:text-base">
                        We sent a 6-digit code to{" "}
                        <span className="text-white font-medium">
                          {otpEmail}
                        </span>
                      </p>
                      <div className="flex justify-center pt-2">
                        <InputOTP
                          maxLength={6}
                          value={otpCode}
                          onChange={(val) =>
                            setOtpCode(val.replace(/\D/g, "").slice(0, 6))
                          }
                          data-testid="otp-input"
                        >
                          <InputOTPGroup className="gap-2">
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                              <InputOTPSlot
                                key={i}
                                index={i}
                                className="h-11 w-11 sm:h-12 sm:w-12 text-lg sm:text-xl text-white border-white/50 bg-white/10 rounded-md first:rounded-l-md last:rounded-r-md"
                              />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-white/80 text-sm sm:text-base">
                      <button
                        type="button"
                        onClick={handleBackToEmail}
                        data-testid="otp-back-btn"
                        className="underline hover:text-white transition-colors"
                      >
                        Change email
                      </button>
                      {resendCooldown > 0 ? (
                        <span
                          className="text-white/60"
                          data-testid="resend-cooldown"
                        >
                          Resend in {resendCooldown}s
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={isSendingOtp}
                          data-testid="resend-otp-btn"
                          className="underline hover:text-white transition-colors disabled:opacity-50"
                        >
                          {isSendingOtp ? "Resending..." : "Resend OTP"}
                        </button>
                      )}
                    </div>

                    <div className="pt-2 sm:pt-3">
                      <Button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={otpCode.length !== 6 || isVerifyingOtp}
                        data-testid="verify-otp-btn"
                        className="w-full rounded-full font-medium text-lg sm:text-xl bg-primary001 hover:bg-primary001/90 h-12 sm:h-14 flex items-center justify-center transition-all duration-300"
                      >
                        {isVerifyingOtp ? (
                          <BeatLoader color="#ffffff" size={8} />
                        ) : (
                          "Verify OTP"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
