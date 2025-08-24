import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { setPageTitle } from "../redux/themeConfigSlice.js";

// 👇 bring in the lucide-react icons you actually use
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Shield,
  Zap,
  Star,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  UserCog,
  CalendarDays,
  Users,
} from "lucide-react";

import {
  signUpStart,
  signUpSuccess,
  signUpFailure,
} from "../redux/user/userSlice.js";

export default function EventifySignUp() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const API_BASE = import.meta.env.VITE_API_BASE;
  useEffect(() => {
    dispatch(setPageTitle("Sign Up"));
  });

  useEffect(() => {
    dispatch(signUpFailure(null));
  }, [dispatch]);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  
  // Helper function to check if passwords match
  const passwordsMatch = () => {
    return formData.password && 
           formData.confirmPassword && 
           formData.password === formData.confirmPassword;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      dispatch(signUpFailure("Passwords do not match. Please try again."));
      toast.error("Passwords do not match. Please try again.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Make sure terms are agreed to
    if (!formData.agreeTerms) {
      dispatch(signUpFailure("Please agree to the Terms and Privacy Policy."));
      toast.error("Please agree to the Terms and Privacy Policy.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    
    // Create a copy without confirmPassword before sending to API
    const formDataToSend = { ...formData };
    delete formDataToSend.confirmPassword;
    delete formDataToSend.agreeTerms;

    try {
      dispatch(signUpStart());
      const res = await axios.post(`${API_BASE}/auth/register`, formDataToSend, {
        withCredentials: true,
      });
      Cookies.set("accessToken", res.data.tokens.access.token, {
        expires: new Date(res.data.tokens.access.expires),
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      Cookies.set("refreshToken", res.data.tokens.refresh.token, {
        expires: new Date(res.data.tokens.refresh.expires),
        secure: true,
        sameSite: "none",
        httpOnly: true,
      });
      dispatch(signUpSuccess(res.data));
      toast.success("Account created successfully!", {
        position: "top-right",
        autoClose: 4000,
      });
      navigate("/");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration failed. Please try again.";
      dispatch(signUpFailure(errorMsg));
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      axios.post(
        `${API_BASE}/auth/send-verification-email`,
        {},
        { withCredentials: true }
      );
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      dispatch(signUpStart());
      const res = await axios.post(
        `${API_BASE}/auth/google`,
        {
          credential: credentialResponse.credential,
        },
        { withCredentials: true }
      );

      Cookies.set("accessToken", res.data.tokens.access.token, {
        expires: new Date(res.data.tokens.access.expires),
        secure: true,
        sameSite: "none",
        httpOnly: true,
      });
      Cookies.set("refreshToken", res.data.tokens.refresh.token, {
        expires: new Date(res.data.tokens.refresh.expires),
        secure: true,
        sameSite: "none",
        httpOnly: true,
      });

      dispatch(signUpSuccess(res.data));
      navigate("/");
    } catch (error) {
      console.error("Google sign-in error:", error);
      dispatch(signUpFailure(error.response.data.message));
    }
  };
  const handleGoogleError = (error) => {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Google sign-up failed";
    dispatch(signUpFailure(message));
    toast.error(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };
  
  // Function to navigate back to home
  const handleBackToHome = () => {
    navigate('/');
  };
  
  // Function to navigate to login page
  const goToLogin = () => {
    navigate('/login');
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 flex">
      {/* Left Side - Fixed & Redesigned Layout */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700" />
        <div className="absolute inset-0 bg-black/20" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 py-20 text-white space-y-12">
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

          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-indigo-600 font-extrabold text-2xl">E</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">EVENTIFY</h1>
          </div>

          {/* Main Text */}
          <div className="space-y-6 max-w-lg">
            <h2 className="text-5xl font-extrabold leading-tight">
              Elevate your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-emerald-300">
                campus experience
              </span>
            </h2>
            <p className="text-lg text-white/85 leading-relaxed">
              Organize events, connect with peers, and grow your community.
              Eventify makes student life easier, more engaging, and
              unforgettable.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-4 backdrop-blur-md">
              <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Shield size={22} />
              </div>
              <span className="text-lg font-medium">Secure accounts</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-4 backdrop-blur-md">
              <div className="w-12 h-12 bg-sky-500 rounded-lg flex items-center justify-center">
                <CalendarDays size={22} />
              </div>
              <span className="text-lg font-medium">Effortless scheduling</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-4 backdrop-blur-md">
              <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
                <Zap size={22} />
              </div>
              <span className="text-lg font-medium">Fast RSVPs</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-4 backdrop-blur-md">
              <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center">
                <Users size={22} />
              </div>
              <span className="text-lg font-medium">Club management</span>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-28 right-24 text-white/10 animate-spin">
            <Sparkles size={70} />
          </div>
          <div className="absolute bottom-24 left-24 text-white/10 animate-pulse">
            <Star size={50} />
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create your account
            </h2>
            <p className="text-gray-600">Jump in — it only takes a minute</p>
          </div>

          {/* Google Signup Button */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={true}
              scope="profile email"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            <span className="text-sm text-gray-500 bg-white px-4">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
            
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Select your role
              </label>
              <div
                className="grid grid-cols-2 gap-3"
                role="radiogroup"
                aria-label="Select your role"
              >
                <button
                  type="button"
                  role="radio"
                  id="user"
                  onClick={handleChange}
                  className={`flex items-center gap-3 p-4 border rounded-xl transition-all duration-300 hover:bg-gray-50 ${
                    formData.role === "user"
                      ? "border-indigo-600 ring-2 ring-indigo-200 bg-indigo-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                    <GraduationCap size={18} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">User</div>
                    <div className="text-xs text-gray-600">
                      Discover & RSVP to events
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  role="radio"
                  id="admin"
                  onClick={handleChange}
                  className={`flex items-center gap-3 p-4 border rounded-xl transition-all duration-300 hover:bg-gray-50 ${
                    formData.role === "Admin"
                      ? "border-indigo-600 ring-2 ring-indigo-200 bg-indigo-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                    <UserCog size={18} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Admin</div>
                    <div className="text-xs text-gray-600">
                      Create events & manage clubs
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your full name"
                required
              />
            </div>

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
                placeholder="you@university.edu"
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
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                >
                  {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  id="confirmPassword"
                  value={formData.confirmPassword || ""}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 pr-12 ${
                    formData.password && 
                    formData.confirmPassword && 
                    formData.password !== formData.confirmPassword
                      ? "border-red-500"
                      : formData.password &&
                        formData.confirmPassword &&
                        formData.password === formData.confirmPassword
                      ? "border-green-500"
                      : "border-gray-200"
                  }`}
                  placeholder="Re-enter your password"
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                  {formData.password &&
                   formData.confirmPassword &&
                   formData.password === formData.confirmPassword && (
                    <div className="text-green-500 mr-2">
                      <CheckCircle2 size={20} />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={isPasswordVisible ? "Hide confirm password" : "Show confirm password"}
                  >
                    {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              {formData.password && 
               formData.confirmPassword && 
               formData.password !== formData.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  Passwords don't match
                </p>
              )}
              {formData.password &&
               formData.confirmPassword &&
               formData.password === formData.confirmPassword && (
                <p className="text-sm text-green-600 mt-1">
                  Passwords match
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                id="agreeTerms"
                type="checkbox"
                onChange={handleChange}
                checked={formData.agreeTerms || false}
                className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="agreeTerms" className="text-sm text-gray-600">
                I agree to the{" "}
                <button
                  type="button"
                  className="text-indigo-600 hover:text-indigo-500 font-semibold"
                >
                  Terms
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="text-indigo-600 hover:text-indigo-500 font-semibold"
                >
                  Privacy Policy
                </button>
                .
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={goToLogin}
                className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
