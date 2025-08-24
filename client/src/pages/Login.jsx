import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie"; // optional; prefer server-set HttpOnly cookies
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Shield,
  Zap,
  Star,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice.js";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { setPageTitle } from "../redux/themeConfigSlice.js";

export default function EventifyLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const API_BASE = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    dispatch(setPageTitle("Login"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(signInFailure(null));
  }, [dispatch]);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Function to navigate back to home
  const handleBackToHome = () => {
    navigate("/");
  };

  // Function to navigate to signup page
  const handleGoToSignUp = () => {
    navigate("/signup");
  };

  // Function to handle forgot password
  const handleForgotPassword = () => {
    navigate("/forgot-password");
    // Alternatively, you can show a modal instead
    // toast.info("Password reset functionality will be implemented soon!");
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      dispatch(signInStart());
      const res = await axios.post(
        `${API_BASE}/auth/google`,
        {
          credential: credentialResponse.credential,
        },
        { withCredentials: true }
      );

      Cookies.set("accessToken", res.data.tokens.access.token, {
        expires: new Date(res.data.tokens.access.expires),
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      Cookies.set("refreshToken", res.data.tokens.refresh.token, {
        expires: new Date(res.data.tokens.refresh.expires),
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      dispatch(signInSuccess(res.data));
      navigate("/dashboard");
    } catch (error) {
      console.error("Google sign-in error:", error);
      dispatch(signInFailure(error.response.data.message));
    }
  };
  const handleGoogleError = (error) => {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Google sign-in failed";
    dispatch(signInFailure(message));
    toast.error(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const res = await axios.post(
        `${API_BASE}/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );

      Cookies.set("accessToken", res.data.tokens.access.token, {
        expires: new Date(res.data.tokens.access.expires),
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      Cookies.set("refreshToken", res.data.tokens.refresh.token, {
        expires: new Date(res.data.tokens.refresh.expires),
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      dispatch(signInSuccess(res.data));
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred during login. Please try again.";

      dispatch(signInFailure(errorMessage));

      // Also display as toast for better visibility
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 flex">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          {/* Back Button */}
          <button
            onClick={handleBackToHome}
            className="absolute top-8 left-8 flex items-center space-x-2 text-white/90 hover:text-white transition-colors duration-300 group"
          >
            <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300">
              <ArrowLeft size={18} />
            </div>
            <span className="text-sm font-medium">Back to Home</span>
          </button>

          <div className="space-y-8">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <span className="text-indigo-600 font-bold text-xl">E</span>
              </div>
              <h1 className="text-3xl font-bold">EVENTIFY</h1>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h2 className="text-5xl font-bold leading-tight">
                Welcome to Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  Campus Community
                </span>
              </h2>
              <p className="text-xl text-white/80 leading-relaxed">
                Connect with clubs, discover events, and make your university
                experience unforgettable.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Shield size={20} />
                </div>
                <span className="text-lg">Secure & Private</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Zap size={20} />
                </div>
                <span className="text-lg">Lightning Fast</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Star size={20} />
                </div>
                <span className="text-lg">Award Winning</span>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 right-20 text-white/10 animate-spin">
            <Sparkles size={60} />
          </div>
          <div className="absolute bottom-20 right-32 text-white/10 animate-pulse">
            <Star size={40} />
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
        {/* Mobile Back Button */}
        <button
          onClick={handleBackToHome}
          className="lg:hidden absolute top-6 left-6 flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-300 group"
        >
          <div className="p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-all duration-300">
            <ArrowLeft size={18} />
          </div>
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">EVENTIFY</h1>
            </div>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={true}
              scope="profile email"
            />
          </div>

          {/* Divider */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center w-full space-x-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              <span className="text-sm text-gray-500 bg-white px-4">or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>

            <div className="flex items-center justify-center w-full">
              <p className="text-gray-600 text-center">
                Enter your credentials to access your account
              </p>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  id="password"
                  value={formData.password || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={
                    isPasswordVisible ? "Hide password" : "Show password"
                  }
                >
                  {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  onChange={(e) =>
                    setFormData({ ...formData, rememberMe: e.target.checked })
                  }
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-indigo-600 hover:text-indigo-500 font-semibold transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <button
                onClick={handleGoToSignUp}
                className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors"
              >
                Create account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
