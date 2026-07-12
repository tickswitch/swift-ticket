import { bannerBg } from "@/assets";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { AppleIcon, EyeIcon, FacebookIcon, GoogleIcon } from "./AuthIcons";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { firstPasswordError } from "@/utils/password";

interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

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

const Register = () => {
  const [isPending, setIsPending] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

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

            // const userInfo = await userInfoResponse.json();

            // Send to your backend
            const res = await axios.post(
              `${import.meta.env.VITE_BASE_URL}/social-login`,
              {
                provider: "google",
                token: response.access_token,
              }
            );
            localStorage.setItem("token", res?.data?.token);
            toast.success("Google registration successful");
            navigate("/");
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

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const data: RegisterFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      password: formData.get("password") as string,
      password_confirmation: formData.get("password_confirmation") as string,
    };

    if (!data.email || !data.password) {
      toast.error("Please provide the necessary credentials.");
      return;
    }

    if (data.password !== data.password_confirmation) {
      toast.error("Passwords do not match.");
      return;
    }

    const pwError = firstPasswordError(data.password);
    if (pwError) {
      toast.error(pwError);
      return;
    }

    try {
      setIsPending(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/register`,
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
          password_confirmation: data.password_confirmation,
        }
      );

      localStorage.setItem("email", JSON.stringify(res?.data?.userData?.email));
      toast.success("Registration successful");
      navigate("/auth/login");
    } catch (error: any) {
      console.log("err", error);
      toast.error(error?.response?.data?.errors || "Something went wrong.");
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
          alt="Register-image"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary001 mix-blend-hue" />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 min-h-screen ">
        <div className="flex items-center justify-center min-h-screen p-4 py-10">
          <div className="w-full max-w-lg py-20 xl:py-0">
            <div className="rounded-4xl border p-6 bg-black/20 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <p className="text-[32px] font-semibold text-white">
                  Create Account
                </p>
                <div className="text-white pb-3">
                  Already have an account?{" "}
                  <Link to={"/auth/login"} className="underline">
                    Login
                  </Link>
                </div>
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  className="w-full bg-white py-4 h-12 hover:bg-red-300 transition-all duration-300 hover:text-black rounded-full flex items-center gap-2 text-black text-lg font-medium"
                >
                  {isGoogleLoading ? (
                    <BeatLoader color="#000000" size={6} />
                  ) : (
                    <>
                      <GoogleIcon />
                      Continue with Google
                    </>
                  )}
                </Button>
                <Button className="w-full bg-white py-4 h-12 hover:bg-blue-300 transition-all duration-300 rounded-full flex items-center gap-2 text-black text-lg font-medium">
                  <FacebookIcon />
                  Continue with Facebook
                </Button>
                <Button className="w-full bg-white py-4 h-12 hover:bg-gray-600 hover:text-white transition-all duration-300 rounded-full flex items-center gap-2 text-black text-lg font-medium">
                  <AppleIcon />
                  Continue with Apple
                </Button>
              </div>
              <div className="pt-2 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <hr className="bg-gray-600 border-0 h-0.5 w-full" />
                  <p className="text-nowrap text-white text-lg">
                    Or continue with email
                  </p>
                  <hr className="bg-gray-600 border-0 h-0.5 w-full" />
                </div>
                <form className="flex flex-col gap-3" onSubmit={handleRegister}>
                  <div className="flex flex-col gap-2">
                    <label className="text-white/80 text-sm">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      autoComplete="text"
                      required
                      className="border border-white/50 bg-white/10 backdrop-blur-sm rounded-md px-3 py-3 w-full text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/20"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-white/80 text-sm">
                      Email address  
                    </label>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      className="border border-white/50 bg-white/10 backdrop-blur-sm rounded-md px-3 py-3 w-full text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/20"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-white/80 text-sm">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      required
                      className="border border-white/50 bg-white/10 backdrop-blur-sm rounded-md px-3 py-3 w-full text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/20"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-white/80 text-sm flex items-center justify-between">
                      Password{" "}
                      <button
                        onClick={() => setShowPass(!showPass)}
                        type="button"
                        className="flex items-center gap-1 bg-transparent hover:bg-transparent text-white/60 hover:text-white text-xs"
                      >
                        <EyeIcon /> {showPass ? "Hide" : "Show"}
                      </button>
                    </label>
                    <input
                      type={showPass ? "text" : "password"}
                      name="password"
                      autoComplete="new-password"
                      required
                      className="border border-white/50 bg-white/10 backdrop-blur-sm rounded-md px-3 py-3 w-full text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/20"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-white/80 text-sm flex items-center justify-between">
                      Confirm Password{" "}
                      <button
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        type="button"
                        className="flex items-center gap-1 bg-transparent hover:bg-transparent text-white/60 hover:text-white text-xs"
                      >
                        <EyeIcon /> {showConfirmPass ? "Hide" : "Show"}
                      </button>
                    </label>
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      name="password_confirmation"
                      autoComplete="new-password"
                      required
                      className="border border-white/50 bg-white/10 backdrop-blur-sm rounded-md px-3 py-3 w-full text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/20"
                    />
                  </div>
                  <div className="flex items-center justify-start text-white/80">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="remember_me"
                        className="w-4 h-4 text-primary001 bg-white/10 border-white/50 rounded focus:ring-primary001"
                      />
                      <label htmlFor="remember_me" className="text-sm">
                        Remember Me
                      </label>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full rounded-full font-medium text-xl bg-primary001 hover:bg-primary001/90 h-14 transition-all duration-300"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <div className="flex items-center justify-center">
                          <BeatLoader color="#ffffff" size={8} />
                        </div>
                      ) : (
                        "Register"
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

export default Register;
