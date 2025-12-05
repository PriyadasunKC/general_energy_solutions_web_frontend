"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sun,
  ArrowRight,
  Shield,
  Users,
  Star,
  CheckCircle,
  ChevronDown,
  AlertCircle,
  Zap,
  Leaf,
  Battery,
} from 'lucide-react';

// Import theme files
import { solarTheme } from '@/theme/theme';
import { glassStyles, cn } from '@/lib/theme-utils';
import { useAuth } from '@/hooks/useAuth';
import type { LoginRequest } from '@/types/authTypes';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email: string;
  password: string;
}

interface FormTouched {
  email: boolean;
  password: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Use the auth hook
  const {
    login,
    isLoading,
    error: authError,
    clearError,
    isAuthenticated,
    isInitialized
  } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: '',
    password: ''
  });

  const [touched, setTouched] = useState<FormTouched>({
    email: false,
    password: false
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showBenefits, setShowBenefits] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Check for success message from URL params
  useEffect(() => {
    const message = searchParams?.get('message');
    if (message) {
      setSuccessMessage(message);
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      const redirect = searchParams?.get('redirect') || '/';
      router.push(redirect);
    }
  }, [isAuthenticated, isInitialized, router, searchParams]);

  // Clear auth error when component unmounts or user starts typing
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  // Validation functions
  const validateEmail = (email: string): string => {
    if (!email.trim()) {
      return 'Email address is required';
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }

    if (email.length > 254) {
      return 'Email address is too long';
    }

    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) {
      return 'Password is required';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }

    if (password.length > 128) {
      return 'Password is too long (maximum 128 characters)';
    }

    return '';
  };

  // Validate individual field
  const validateField = (field: keyof LoginFormData, value: string | boolean): void => {
    if (typeof value !== 'string') return;

    let error = '';

    switch (field) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
    }

    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  // Check if form is valid
  const isFormValid = (): boolean => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    return !emailError && !passwordError;
  };

  const handleInputChange = (field: keyof LoginFormData, value: string | boolean): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Validate field in real-time if it's been touched
    if (touched[field as keyof FormTouched] && typeof value === 'string') {
      validateField(field, value);
    }

    // Clear auth error when user starts typing
    if (authError) {
      clearError();
    }
  };

  const handleInputBlur = (field: keyof FormTouched): void => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));

    // Validate field when user leaves it
    if (field === 'email') {
      validateField('email', formData.email);
    } else if (field === 'password') {
      validateField('password', formData.password);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      email: true,
      password: true
    });

    // Validate all fields
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({
      email: emailError,
      password: passwordError
    });

    // If there are validation errors, don't submit
    if (emailError || passwordError) {
      return;
    }

    try {
      const loginData: LoginRequest = {
        email: formData.email.trim(),
        password: formData.password
      };

      await login(loginData);

      // Success will be handled by the useAuth hook and redirect will happen in useEffect
    } catch (error) {
      // Error is handled by the Redux store and will appear in authError
      console.error('Login failed:', error);
    }
  };

  const benefits = [
    { icon: <Shield className="h-4 w-4" />, text: "100% Secure" },
    { icon: <Users className="h-4 w-4" />, text: "10K+ Customers" },
    { icon: <Star className="h-4 w-4" />, text: "4.9★ Rating" },
    { icon: <Sun className="h-4 w-4" />, text: "Clean Energy" }
  ];

  // Component for rendering field errors
  const FieldError = ({ error }: { error: string }) => {
    if (!error) return null;

    return (
      <div className="mt-1 flex items-start animate-fade-in">
        <span className="text-sm leading-5" style={{ color: solarTheme.error[600] }}>
          {error}
        </span>
      </div>
    );
  };

  // Get input class names based on error state
  const getInputClasses = (fieldName: keyof FormTouched, baseClasses: string): string => {
    const hasError = errors[fieldName] && touched[fieldName];
    const errorClasses = hasError
      ? `border-red-500 focus:ring-red-500 focus:border-red-500`
      : `border-gray-300 focus:ring-green-500 focus:border-transparent`;

    return cn(baseClasses, errorClasses);
  };

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-solar flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-solar">
      {/* Mobile-First Layout */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className={cn("px-4 py-6", glassStyles.medium)}>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3"
              style={{ background: `linear-gradient(to right, ${solarTheme.primary[500]}, ${solarTheme.primary[600]})` }}>
              <Sun className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Sign in to General Energy Solutions
            </p>
          </div>

          {/* Collapsible Benefits */}
          <button
            onClick={() => setShowBenefits(!showBenefits)}
            className="w-full mt-4 flex items-center justify-center text-sm transition-colors"
            style={{ color: solarTheme.primary[600] }}
          >
            <span>Why choose General Energy Solutions?</span>
            <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showBenefits ? 'rotate-180' : ''}`} />
          </button>

          {showBenefits && (
            <div className="mt-3 grid grid-cols-2 gap-2 animate-slide-up">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2 rounded-lg p-2"
                  style={{ backgroundColor: solarTheme.primary[50] }}>
                  <div style={{ color: solarTheme.primary[600] }}>
                    {benefit.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Login Form */}
        <div className="p-4">
          <div className="card-solar">
            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 p-3 rounded-lg animate-fade-in"
                style={{ backgroundColor: solarTheme.success[50], borderColor: solarTheme.success[200], border: '1px solid' }}>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: solarTheme.success[600] }} />
                  <p className="text-sm" style={{ color: solarTheme.success[600] }}>{successMessage}</p>
                </div>
              </div>
            )}

            {/* Auth Error Message */}
            {authError && (
              <div className="mb-4 p-3 rounded-lg animate-fade-in"
                style={{ backgroundColor: solarTheme.error[50], borderColor: solarTheme.error[200], border: '1px solid' }}>
                <div className="flex items-start">
                  <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: solarTheme.error[600] }} />
                  <span className="text-sm" style={{ color: solarTheme.error[600] }}>{authError}</span>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email Field */}
              <div className="animate-slide-up">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={() => handleInputBlur('email')}
                    className={getInputClasses('email', "w-full pl-10 pr-14 py-3.5 border rounded-xl focus:ring-2 outline-none transition-colors bg-white placeholder:text-gray-400 text-base")}
                    placeholder="Enter your email"
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                <FieldError error={touched.email ? errors.email : ''} />
              </div>

              {/* Password Field */}
              <div className="animate-slide-up">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onBlur={() => handleInputBlur('password')}
                    className={getInputClasses('password', "w-full pl-10 pr-14 py-3.5 border rounded-xl focus:ring-2 outline-none transition-colors bg-white placeholder:text-gray-400 text-base")}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 p-1 hover-scale"
                    disabled={isLoading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </button>
                </div>
                <FieldError error={touched.password ? errors.password : ''} />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between animate-slide-up">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember-me-mobile"
                    checked={formData.rememberMe}
                    onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                    className="h-4 w-4 border-gray-300 rounded"
                    style={{ accentColor: solarTheme.primary[500] }}
                    disabled={isLoading}
                  />
                  <label htmlFor="remember-me-mobile" className="ml-2 text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <Link href="/forgot-password"
                  className="text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: solarTheme.primary[600] }}>
                  Forgot?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !isFormValid()}
                className="btn-solar w-full py-4 px-6 rounded-xl text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/signup"
                  className="font-medium transition-colors hover:opacity-80"
                  style={{ color: solarTheme.primary[600] }}>
                  Join General Energy Solutions
                </Link>
              </p>
            </div>

            {/* Security Badge */}
            <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
              <CheckCircle className="h-4 w-4 mr-2" style={{ color: solarTheme.primary[500] }} />
              Eco-certified secure platform
            </div>
          </div>

          {/* Mobile Quick Actions */}
          <div className="mt-4 flex space-x-3">
            <Link
              href="/"
              className={cn("flex-1 px-4 py-3 rounded-xl text-center font-medium hover-lift transition-colors", glassStyles.light)}
              style={{ color: solarTheme.primary[600] }}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={cn("flex-1 px-4 py-3 rounded-xl text-center font-medium hover-lift transition-colors", glassStyles.light)}
              style={{ color: solarTheme.primary[600] }}
            >
              Solar Panels
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow"
            style={{ backgroundColor: solarTheme.primary[200] }}></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow"
            style={{ backgroundColor: solarTheme.secondary[200] }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-xl opacity-20"
            style={{ backgroundColor: solarTheme.primary[300] }}></div>
        </div>

        <div className="relative w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-2 gap-8 items-center">
            {/* Left Side - Branding & Benefits */}
            <div className="text-left space-y-8">
              {/* Logo & Brand */}
              <div className="animate-fade-in">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 shadow-lg"
                  style={{ background: `linear-gradient(to right, ${solarTheme.primary[500]}, ${solarTheme.primary[600]})` }}>
                  <Sun className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                  Welcome Back to
                  <span className="block text-gradient-solar">
                    General Energy Solutions
                  </span>
                </h1>
                <p className="text-lg text-gray-600 max-w-lg">
                  Access premium solar panels and energy storage solutions.
                  Power your future with clean, sustainable energy.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className={cn("rounded-xl p-4 hover-lift animate-fade-in", glassStyles.light)}>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: solarTheme.primary[100] }}>
                      <Zap className="h-5 w-5" style={{ color: solarTheme.primary[600] }} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      High Efficiency
                    </span>
                  </div>
                </div>

                <div className={cn("rounded-xl p-4 hover-lift animate-fade-in", glassStyles.light)}>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: solarTheme.secondary[100] }}>
                      <Sun className="h-5 w-5" style={{ color: solarTheme.secondary[600] }} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      25+ Years Warranty
                    </span>
                  </div>
                </div>

                <div className={cn("rounded-xl p-4 hover-lift animate-fade-in", glassStyles.light)}>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: solarTheme.primary[100] }}>
                      <Leaf className="h-5 w-5" style={{ color: solarTheme.primary[600] }} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Eco-Friendly
                    </span>
                  </div>
                </div>

                <div className={cn("rounded-xl p-4 hover-lift animate-fade-in", glassStyles.light)}>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: solarTheme.accent[100] }}>
                      <Battery className="h-5 w-5" style={{ color: solarTheme.accent[600] }} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Energy Storage
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className={cn("rounded-2xl p-6 animate-fade-in", glassStyles.medium)}>
                <div className="flex items-center justify-center space-x-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">10K+</div>
                    <div className="text-sm text-gray-600">Happy Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">50MW</div>
                    <div className="text-sm text-gray-600">Energy Generated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">4.9★</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full max-w-md mx-auto">
              <div className="card-solar animate-slide-up">
                {/* Form Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
                  <p className="text-gray-600">Access your General Energy Solutions account</p>
                </div>

                {/* Success Message */}
                {successMessage && (
                  <div className="mb-6 p-3 rounded-lg animate-fade-in"
                    style={{ backgroundColor: solarTheme.success[50] }}>
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: solarTheme.success[600] }} />
                      <p className="text-sm" style={{ color: solarTheme.success[600] }}>{successMessage}</p>
                    </div>
                  </div>
                )}

                {/* Auth Error Message */}
                {authError && (
                  <div className="mb-6 p-3 rounded-lg animate-fade-in"
                    style={{ backgroundColor: solarTheme.error[50] }}>
                    <div className="flex items-start">
                      <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: solarTheme.error[600] }} />
                      <span className="text-sm" style={{ color: solarTheme.error[600] }}>{authError}</span>
                    </div>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        onBlur={() => handleInputBlur('email')}
                        className={getInputClasses('email', "w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors bg-white placeholder:text-gray-400")}
                        placeholder="Enter your email"
                        disabled={isLoading}
                        autoComplete="email"
                      />
                    </div>
                    <FieldError error={touched.email ? errors.email : ''} />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        onBlur={() => handleInputBlur('password')}
                        className={getInputClasses('password', "w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors bg-white placeholder:text-gray-400")}
                        placeholder="Enter your password"
                        disabled={isLoading}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 hover-scale"
                        disabled={isLoading}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                      </button>
                    </div>
                    <FieldError error={touched.password ? errors.password : ''} />
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="remember-me-desktop"
                        checked={formData.rememberMe}
                        onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                        className="h-4 w-4 border-gray-300 rounded focus:ring-2"
                        style={{ accentColor: solarTheme.primary[500] }}
                        disabled={isLoading}
                      />
                      <label htmlFor="remember-me-desktop" className="ml-2 text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    <Link href="/forgot-password"
                      className="text-sm transition-colors hover:opacity-80"
                      style={{ color: solarTheme.primary[600] }}>
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !isFormValid()}
                    className="btn-solar w-full py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </button>
                </form>

                {/* Sign Up Link */}
                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup"
                      className="font-medium transition-colors hover:opacity-80"
                      style={{ color: solarTheme.primary[600] }}>
                      Join General Energy Solutions
                    </Link>
                  </p>
                </div>

                {/* Security Badge */}
                <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
                  <CheckCircle className="h-4 w-4 mr-2" style={{ color: solarTheme.primary[500] }} />
                  Your information is protected with bank-level security
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-3">Quick actions</p>
                <div className="flex space-x-4 justify-center">
                  <Link
                    href="/"
                    className={cn("px-4 py-2 rounded-lg transition-colors hover-lift", glassStyles.light)}
                    style={{ color: solarTheme.primary[600] }}
                  >
                    Home
                  </Link>
                  <Link
                    href="/products"
                    className={cn("px-4 py-2 rounded-lg transition-colors hover-lift", glassStyles.light)}
                    style={{ color: solarTheme.primary[600] }}
                  >
                    Solar Panels
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}