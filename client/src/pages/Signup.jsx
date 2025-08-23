import React, { useMemo, useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Shield, Zap, Star, Sparkles, CheckCircle2, GraduationCap, UserCog, CalendarDays, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EventifySignUp() {
  const navigate = useNavigate();

  // ----- Form State -----
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [role, setRole] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirm: false, role: false });

  // ----- Helpers & Validation -----
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const passwordRules = useMemo(() => ({
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }), [password]);

  const fulfilledCount = Object.values(passwordRules).filter(Boolean).length;
  const strengthLabel = ['Weak', 'Okay', 'Good', 'Strong', 'Very strong'];
  const strength = strengthLabel[Math.max(0, fulfilledCount - 1)];

  const nameError = touched.name && fullName.trim().length < 2 ? 'Enter your full name' : '';
  const emailError = touched.email && !isValidEmail(email) ? 'Enter a valid email address' : '';
  const passwordError = touched.password && fulfilledCount < 3 ? 'Use at least 8 chars incl. numbers & letters' : '';
  const confirmError = touched.confirm && confirmPassword !== password ? "Passwords don't match" : '';
  const roleError = touched.role && !role ? 'Select a role' : '';

  // Removed canSubmit variable that was disabling the button

  // ----- Navigation -----
  const handleBackToHome = () => navigate('/');
  const goToLogin = () => navigate('/login');

  // ----- Auth placeholders -----
  const handleGoogleSignup = () => {
    setIsLoading(true);
    console.log('Google sign up clicked - integrate with your OAuth provider');
    setTimeout(() => setIsLoading(false), 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirm: true, role: true });
    
    // Validate all fields before submission
    if (!fullName || !isValidEmail(email) || fulfilledCount < 3 || confirmPassword !== password || !agree || !role) {
      return; // Don't proceed if validation fails
    }

    setIsLoading(true);
    console.log('Signup attempt:', { fullName, email, role });
    setTimeout(() => {
      setIsLoading(false);
      navigate('/onboarding');
    }, 1500);
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
              Organize events, connect with peers, and grow your community. Eventify makes student life easier, more engaging, and unforgettable.
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-600">Jump in — it only takes a minute</p>
          </div>

          {/* Google Signup Button */}
          <button
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 py-4 px-6 border-2 border-gray-200 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Sign up with Google"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-semibold text-gray-700 group-hover:text-gray-900">Sign up with Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            <span className="text-sm text-gray-500 bg-white px-4">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Select your role</label>
              <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Select your role">
                <button
                  type="button"
                  role="radio"
                  aria-checked={role === 'Student'}
                  onClick={() => setRole('Student')}
                  onBlur={() => setTouched((t) => ({ ...t, role: true }))}
                  className={`flex items-center gap-3 p-4 border rounded-xl transition-all duration-300 hover:bg-gray-50 ${role === 'Student' ? 'border-indigo-600 ring-2 ring-indigo-200 bg-indigo-50' : 'border-gray-200'}`}
                >
                  <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                    <GraduationCap size={18} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Student</div>
                    <div className="text-xs text-gray-600">Discover & RSVP to events</div>
                  </div>
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked={role === 'Admin'}
                  onClick={() => setRole('Admin')}
                  onBlur={() => setTouched((t) => ({ ...t, role: true }))}
                  className={`flex items-center gap-3 p-4 border rounded-xl transition-all duration-300 hover:bg-gray-50 ${role === 'Admin' ? 'border-indigo-600 ring-2 ring-indigo-200 bg-indigo-50' : 'border-gray-200'}`}
                >
                  <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                    <UserCog size={18} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Admin</div>
                    <div className="text-xs text-gray-600">Create events & manage clubs</div>
                  </div>
                </button>
              </div>
              {roleError && <p className="text-sm text-red-500">{roleError}</p>}
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ${nameError ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="Enter your full name"
                required
              />
              {nameError && <p className="text-sm text-red-500">{nameError}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ${emailError ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="you@university.edu"
                required
              />
              {emailError && <p className="text-sm text-red-500">{emailError}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 pr-12 ${passwordError ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {password && (
                <div className="space-y-2">
                  {/* Strength bar */}
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${fulfilledCount <= 2 ? 'bg-red-400' : fulfilledCount === 3 ? 'bg-yellow-400' : fulfilledCount === 4 ? 'bg-green-400' : 'bg-emerald-500'}`}
                      style={{ width: `${(fulfilledCount / 5) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Strength: <span className="font-semibold">{strength}</span></span>
                    <div className="flex items-center gap-2">
                      {Object.entries(passwordRules).map(([key, ok]) => (
                        <div key={key} className={`flex items-center gap-1 ${ok ? 'text-green-600' : 'text-gray-400'}`}>
                          <CheckCircle2 size={14} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 pr-12 ${confirmError ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="Re-enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {confirmError && <p className="text-sm text-red-500">{confirmError}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                id="agree"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="agree" className="text-sm text-gray-600">
                I agree to the <button type="button" className="text-indigo-600 hover:text-indigo-500 font-semibold">Terms</button> and <button type="button" className="text-indigo-600 hover:text-indigo-500 font-semibold">Privacy Policy</button>.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button onClick={goToLogin} className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors">
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}