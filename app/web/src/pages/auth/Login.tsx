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
  const [loginError, setLoginError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);

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
      await login(data.email, data.password, { silent: true });
      navigate(redirectTo);
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Incorrect password — please try again");
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
        { email: otpEmail },
        { timeout: 30000 }
      );
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
        { email: otpEmail, otp: otpCode },
        { timeout: 30000 }
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
      navigate(redirectTo);
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      console.error("OTP verify error:", error);
      setOtpError("Incorrect code — please try again");
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
    `flex-1 py-1.5 text-sm sm:text-base font-medium rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-white/[0.12] text-white"
        : "bg-transparent text-white/40"
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
        <div className="flex items-start justify-center min-h-screen px-4 pt-10 pb-10">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-white/10 p-7 bg-white/[0.06] backdrop-blur-sm w-full max-w-md">
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="1" y="4" width="12" height="8" rx="2" stroke="white" strokeWidth="1.3"/>
                      <path d="M4 4V3a3 3 0 016 0v1" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-100">SwiftTickets</span>
                </div>
                <p className="text-2xl sm:text-3xl lg:text-[32px] font-semibold text-white text-center">
                  Welcome back
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
                <div className="grid grid-cols-3 gap-2 mb-3 w-full">
                  <Button
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleLoading}
                    data-testid="google-login-btn"
                    className="bg-white/[0.07] border border-white/10 rounded-xl py-2.5 flex items-center justify-center gap-1.5 text-xs font-medium text-white/90 hover:bg-white/10 transition-all duration-200"
                  >
                    {isGoogleLoading ? (
                      <BeatLoader color="#ffffff" size={6} />
                    ) : (
                      <>
                        <GoogleIcon />
                        <span>Google</span>
                      </>
                    )}
                  </Button>
                  <Button className="bg-white/[0.07] border border-white/10 rounded-xl py-2.5 flex items-center justify-center gap-1.5 text-xs font-medium text-white/90 hover:bg-white/10 transition-all duration-200">
                    <FacebookIcon />
                    <span>Facebook</span>
                  </Button>
                  <Button className="bg-white/[0.07] border border-white/10 rounded-xl py-2.5 flex items-center justify-center gap-1.5 text-xs font-medium text-white/90 hover:bg-white/10 transition-all duration-200">
                    <AppleIcon />
                    <span>Apple</span>
                  </Button>
                </div>
              </div>

              <div className="pt-3 sm:pt-4 flex flex-col gap-3">
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
                  className="grid grid-cols-2 p-1 rounded-xl border border-white/10 bg-white/5 mb-3"
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
                    className="flex flex-col gap-3"
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
                        className="border border-white/50 bg-white/10 backdrop-blur-sm rounded-md px-3 py-2 w-full text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/20 transition-all duration-200 text-sm sm:text-base"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <label className="text-white/80 text-sm sm:text-base">
                          Password
                        </label>
                        <Link
                          to={"/auth/forgot-password"}
                          className="underline hover:text-white transition-colors text-white/80 text-sm sm:text-base"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                      <div className="relative">
                        <input
                          type={showPass ? "text" : "password"}
                          name="password"
                          autoComplete="current-password"
                          required
                          data-testid="password-input"
                          className="border border-white/50 bg-white/10 backdrop-blur-sm rounded-md px-3 py-2 w-full text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/20 transition-all duration-200 text-sm sm:text-base pr-14"
                          style={loginError ? { border: '1px solid #ef4444', background: 'rgba(239,68,68,0.08)' } : undefined}
                          placeholder="Enter your password"
                          onChange={() => setLoginError(null)}
                        />
                        <button
                          onClick={() => setShowPass(!showPass)}
                          type="button"
                          className="flex items-center gap-1 bg-transparent hover:bg-transparent text-white/60 hover:text-white text-xs sm:text-sm transition-colors absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          <EyeIcon /> {showPass ? "Hide" : "Show"}
                        </button>
                      </div>
                      {loginError && (
                        <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#ef4444', margin: '-4px 0 10px' }}>
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <circle cx="6.5" cy="6.5" r="6" stroke="#ef4444"/>
                            <path d="M6.5 4v3M6.5 9v.5" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round"/>
                          </svg>
                          {loginError}
                        </p>
                      )}
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
                    className="flex flex-col gap-3"
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
                        className="border border-white/50 bg-white/10 backdrop-blur-sm rounded-md px-3 py-2 w-full text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/20 transition-all duration-200 text-sm sm:text-base"
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
                    className="flex flex-col gap-3"
                    data-testid="email-enter-otp"
                  >
                    <div className="flex flex-col gap-2">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '10px', marginBottom: '14px' }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="7" stroke="#22c55e" strokeWidth="1.2"/>
                          <path d="M5 8.5l2 2 4-4" stroke="#22c55e" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div>
                          <p style={{ fontSize: '12px', fontWeight: 500, color: '#22c55e', margin: 0 }}>OTP sent</p>
                          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', margin: 0 }}>Check {otpEmail}</p>
                        </div>
                      </div>
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
                          onChange={(val) => {
                            setOtpCode(val.replace(/\D/g, "").slice(0, 6));
                            if (otpError) setOtpError(null);
                          }}
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
                      {otpError && (
                        <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#ef4444', margin: '-4px 0 10px' }}>
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <circle cx="6.5" cy="6.5" r="6" stroke="#ef4444"/>
                            <path d="M6.5 4v3M6.5 9v.5" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round"/>
                          </svg>
                          {otpError}
                        </p>
                      )}
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
