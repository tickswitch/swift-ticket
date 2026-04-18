import { bannerBg } from "@/assets";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { AppleIcon, EyeIcon, FacebookIcon, GoogleIcon } from "./AuthIcons";
import { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

// Google OAuth types
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
          revoke: (accessToken: string, callback: () => void) => void;
        };
        oauth2: {
          initTokenClient: (config: any) => any;
        };
      };
    };
  }
}

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

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

  const handleGoogleSignIn = async () => {
    if (!window.google) {
      toast.error("Google OAuth not loaded properly");
      return;
    }

    setIsGoogleLoading(true);

    try {
      // Initialize token client for popup flow
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: "email profile openid",
        callback: async (response: any) => {
          if (response.error) {
            console.error("Google OAuth error:", response.error);
            toast.error("Google authentication failed");
            setIsGoogleLoading(false);
            return;
          }

          try {
            // Get user info using the access token
            const userInfoResponse = await fetch(
              `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${response.access_token}`
            );

            if (!userInfoResponse.ok) {
              throw new Error("Failed to fetch user info");
            }

            // Send to your backend
            const res = await axios.post(
              `${import.meta.env.VITE_BASE_URL}/social-login`,
              {
                provider: "google",
                token: response.access_token,
              }
            );

            // Handle successful login response - you may need to adjust this based on your backend response structure
            console.log("res", res?.data);
            if (res.data) {
              localStorage.setItem("token", res?.data?.token);
              toast.success("Google login successful");
              navigate("/");
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
          } catch (error: any) {
            console.log("Google OAuth API error", error);
            toast.error(
              error?.response?.data?.errors || "Google authentication failed."
            );
          } finally {
            setIsGoogleLoading(false);
          }
        },
      });

      // Request access token (this opens the popup)
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
      navigate("/");
    } catch (error) {
      // Error is already handled in the auth context
      console.error("Login error:", error);
    } finally {
      setIsPending(false);
    }
  };

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
                    Or continue with email
                  </p>
                  <hr className="bg-gray-600 border-0 h-0.5 w-full" />
                </div>

                <form
                  className="flex flex-col gap-3 sm:gap-4"
                  onSubmit={handleLogin}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
