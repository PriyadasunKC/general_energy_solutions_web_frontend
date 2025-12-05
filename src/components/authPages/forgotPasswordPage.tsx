'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Mail,
    Sun,
    ArrowRight,
    Shield,
    Users,
    CheckCircle,
    ChevronDown,
    AlertCircle,
    ArrowLeft,
    Clock,
} from 'lucide-react';

import { solarTheme } from '@/theme/theme';
import { glassStyles, cn } from '@/lib/theme-utils';
import { useAuth } from '@/hooks/useAuth';
import type { ForgotPasswordRequest } from '@/types/authTypes';

interface ForgotPasswordFormData {
    email: string;
}

interface FormErrors {
    email: string;
}

export default function ForgotPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const {
        forgotPassword,
        isLoading,
        error: authError,
        clearError,
        isAuthenticated,
        isInitialized
    } = useAuth();

    const [formData, setFormData] = useState<ForgotPasswordFormData>({
        email: ''
    });

    const [errors, setErrors] = useState<FormErrors>({
        email: ''
    });

    const [touched, setTouched] = useState({
        email: false
    });

    const [showBenefits, setShowBenefits] = useState<boolean>(false);
    const [emailSent, setEmailSent] = useState<boolean>(false);
    const [sentEmail, setSentEmail] = useState<string>('');

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

    // Validation function
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

    const validateField = (value: string): void => {
        const error = validateEmail(value);

        setErrors(prev => ({
            ...prev,
            email: error
        }));
    };

    const handleInputChange = (value: string): void => {
        setFormData(prev => ({
            ...prev,
            email: value
        }));

        // Validate field in real-time if it's been touched
        if (touched.email) {
            validateField(value);
        }

        // Clear auth error when user starts typing
        if (authError) {
            clearError();
        }
    };

    const handleInputBlur = (): void => {
        setTouched(prev => ({
            ...prev,
            email: true
        }));

        validateField(formData.email);
    };

    const isFormValid = (): boolean => {
        const emailError = validateEmail(formData.email);
        return !emailError;
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        // Mark field as touched
        setTouched({ email: true });

        // Validate field
        const emailError = validateEmail(formData.email);

        setErrors({
            email: emailError
        });

        // If there are validation errors, don't submit
        if (emailError) {
            return;
        }

        try {
            const forgotPasswordData: ForgotPasswordRequest = {
                email: formData.email.trim()
            };

            await forgotPassword(forgotPasswordData);

            // Success - show email sent message
            setEmailSent(true);
            setSentEmail(formData.email.trim());

        } catch (error) {
            // Error is handled by the Redux store and will appear in authError
            console.error('Forgot password failed:', error);
        }
    };

    const maskEmail = (email: string): string => {
        if (!email) return '';
        const [username, domain] = email.split('@');
        if (!username || !domain) return email;

        const maskedUsername = username.length > 2
            ? username[0] + '*'.repeat(Math.min(username.length - 2, 6)) + username[username.length - 1]
            : username;

        return `${maskedUsername}@${domain}`;
    };

    const benefits = [
        { icon: <Shield className="h-4 w-4" />, text: "Secure Reset" },
        { icon: <Clock className="h-4 w-4" />, text: "Quick Process" },
        { icon: <Mail className="h-4 w-4" />, text: "Email Link" },
        { icon: <Sun className="h-4 w-4" />, text: "24/7 Support" }
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
    const getInputClasses = (baseClasses: string): string => {
        const hasError = errors.email && touched.email;
        const errorClasses = hasError
            ? `border-red-500 focus:ring-red-500 focus:border-red-500`
            : `border-green-300 focus:ring-green-500 focus:border-transparent`;

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

    // Show success screen if email was sent
    if (emailSent) {
        return (
            <div className="min-h-screen bg-solar">
                {/* Mobile Success Layout */}
                <div className="lg:hidden">
                    <div className={cn("px-4 py-6", glassStyles.medium)}>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3"
                                style={{ background: `linear-gradient(to right, ${solarTheme.success[500]}, ${solarTheme.success[600]})` }}>
                                <CheckCircle className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Check Your Email</h1>
                            <p className="text-sm text-gray-600 mt-1">Password reset link sent successfully</p>
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="card-solar">
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                                    style={{ backgroundColor: solarTheme.success[100] }}>
                                    <Mail className="h-8 w-8" style={{ color: solarTheme.success[600] }} />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">Password Reset Link Sent</h2>
                                <p className="text-sm text-gray-600 mb-4">
                                    We&apos;ve sent a password reset link to:
                                </p>
                                <p className="text-base font-medium" style={{ color: solarTheme.primary[700] }}>
                                    {maskEmail(sentEmail)}
                                </p>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                                        style={{ backgroundColor: solarTheme.primary[600] }}>
                                        1
                                    </div>
                                    <p className="text-sm text-gray-700">Check your email inbox (and spam folder)</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                                        style={{ backgroundColor: solarTheme.primary[600] }}>
                                        2
                                    </div>
                                    <p className="text-sm text-gray-700">Click the password reset link</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                                        style={{ backgroundColor: solarTheme.primary[600] }}>
                                        3
                                    </div>
                                    <p className="text-sm text-gray-700">Create your new password</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Link
                                    href="/login"
                                    className="w-full btn-solar py-4 px-6 rounded-xl text-base flex items-center justify-center transition-all duration-200"
                                >
                                    Back to Sign In
                                    <ArrowRight className="h-5 w-5 ml-2" />
                                </Link>
                                <button
                                    onClick={() => {
                                        setEmailSent(false);
                                        setSentEmail('');
                                        setFormData({ email: '' });
                                        setTouched({ email: false });
                                        setErrors({ email: '' });
                                    }}
                                    className="w-full py-3 px-6 rounded-xl text-base font-medium transition-all duration-300"
                                    style={{
                                        backgroundColor: solarTheme.neutral[100],
                                        color: solarTheme.neutral[700]
                                    }}
                                >
                                    Try Different Email
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Success Layout */}
                <div className="hidden lg:flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
                    <div className="relative w-full max-w-2xl mx-auto">
                        <div className="card-solar animate-slide-up">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-lg"
                                    style={{ background: `linear-gradient(to right, ${solarTheme.success[500]}, ${solarTheme.success[600]})` }}>
                                    <CheckCircle className="h-10 w-10 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">Check Your Email</h1>
                                <p className="text-lg text-gray-600 mb-6">
                                    We&apos;ve sent a password reset link to:
                                </p>
                                <p className="text-xl font-medium mb-8" style={{ color: solarTheme.primary[700] }}>
                                    {maskEmail(sentEmail)}
                                </p>

                                <div className="grid grid-cols-3 gap-6 mb-8">
                                    <div className="text-center">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                                            style={{ backgroundColor: solarTheme.primary[100] }}>
                                            <Mail className="h-6 w-6" style={{ color: solarTheme.primary[600] }} />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 mb-1">Check Email</p>
                                        <p className="text-xs text-gray-600">Look in inbox & spam</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                                            style={{ backgroundColor: solarTheme.primary[100] }}>
                                            <ArrowRight className="h-6 w-6" style={{ color: solarTheme.primary[600] }} />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 mb-1">Click Link</p>
                                        <p className="text-xs text-gray-600">Follow the reset link</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                                            style={{ backgroundColor: solarTheme.primary[100] }}>
                                            <Shield className="h-6 w-6" style={{ color: solarTheme.primary[600] }} />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 mb-1">New Password</p>
                                        <p className="text-xs text-gray-600">Create secure password</p>
                                    </div>
                                </div>

                                <div className="flex space-x-4 justify-center">
                                    <Link
                                        href="/login"
                                        className="btn-solar py-3 px-6 rounded-xl text-base flex items-center transition-all duration-200"
                                    >
                                        Back to Sign In
                                        <ArrowRight className="h-5 w-5 ml-2" />
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setEmailSent(false);
                                            setSentEmail('');
                                            setFormData({ email: '' });
                                            setTouched({ email: false });
                                            setErrors({ email: '' });
                                        }}
                                        className="py-3 px-6 rounded-xl text-base font-medium transition-all duration-300"
                                        style={{
                                            backgroundColor: solarTheme.neutral[100],
                                            color: solarTheme.neutral[700]
                                        }}
                                    >
                                        Try Different Email
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
                            Reset Password
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Enter your email to receive a reset link
                        </p>
                    </div>

                    {/* Collapsible Benefits */}
                    <button
                        onClick={() => setShowBenefits(!showBenefits)}
                        className="w-full mt-4 flex items-center justify-center text-sm transition-colors"
                        style={{ color: solarTheme.primary[600] }}
                    >
                        <span>Secure password reset process</span>
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

                {/* Mobile Form */}
                <div className="p-4">
                    <div className="card-solar">
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

                        {/* Reset Form */}
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
                                        onChange={(e) => handleInputChange(e.target.value)}
                                        onBlur={handleInputBlur}
                                        className={getInputClasses("w-full pl-10 pr-4 py-3.5 border rounded-xl focus:ring-2 outline-none transition-colors bg-white placeholder:text-gray-400 text-base")}
                                        placeholder="Enter your email address"
                                        disabled={isLoading}
                                        autoComplete="email"
                                    />
                                </div>
                                <FieldError error={touched.email ? errors.email : ''} />
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
                                        Send Reset Link
                                        <ArrowRight className="h-5 w-5 ml-2" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Info Message */}
                        <div className="mt-6 p-3 rounded-lg" style={{ backgroundColor: solarTheme.primary[50] }}>
                            <p className="text-sm text-center" style={{ color: solarTheme.primary[700] }}>
                                We&apos;ll send a secure reset link to your email address
                            </p>
                        </div>

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

                        {/* Back to Login Link */}
                        <Link
                            href="/login"
                            className="flex items-center justify-center text-sm m-4 transition-colors hover:opacity-80"
                            style={{ color: solarTheme.primary[600] }}
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Back to Sign In
                        </Link>

                        {/* Security Badge */}
                        <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
                            <CheckCircle className="h-4 w-4 mr-2" style={{ color: solarTheme.primary[500] }} />
                            Secure password recovery process
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
                            href="/contact-us"
                            className={cn("flex-1 px-4 py-3 rounded-xl text-center font-medium hover-lift transition-colors", glassStyles.light)}
                            style={{ color: solarTheme.primary[600] }}
                        >
                            Support
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
                                    Reset Your Password
                                    <span className="block text-gradient-solar">
                                        Securely & Quickly
                                    </span>
                                </h1>
                                <p className="text-lg text-gray-600 max-w-lg">
                                    Enter your email address and we&apos;ll send you a secure reset link to create a new password.
                                </p>
                            </div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className={cn("rounded-xl p-4 hover-lift animate-fade-in", glassStyles.light)}>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: solarTheme.primary[100] }}>
                                            <Shield className="h-5 w-5" style={{ color: solarTheme.primary[600] }} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            Secure Process
                                        </span>
                                    </div>
                                </div>

                                <div className={cn("rounded-xl p-4 hover-lift animate-fade-in", glassStyles.light)}>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: solarTheme.secondary[100] }}>
                                            <Clock className="h-5 w-5" style={{ color: solarTheme.secondary[600] }} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            Quick Recovery
                                        </span>
                                    </div>
                                </div>

                                <div className={cn("rounded-xl p-4 hover-lift animate-fade-in", glassStyles.light)}>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: solarTheme.primary[100] }}>
                                            <Mail className="h-5 w-5" style={{ color: solarTheme.primary[600] }} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            Email Link
                                        </span>
                                    </div>
                                </div>

                                <div className={cn("rounded-xl p-4 hover-lift animate-fade-in", glassStyles.light)}>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: solarTheme.accent[100] }}>
                                            <Users className="h-5 w-5" style={{ color: solarTheme.accent[600] }} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            24/7 Support
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Security Info */}
                            <div className={cn("rounded-2xl p-6 animate-fade-in", glassStyles.medium)}>
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Reset Process</h3>
                                    <p className="text-sm text-gray-600">
                                        Your security is our priority. We use industry-standard encryption and secure email links to ensure your account remains protected during the password reset process.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Reset Form */}
                        <div className="w-full max-w-md mx-auto">
                            <div className="card-solar animate-slide-up">
                                {/* Form Header */}
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
                                    <p className="text-gray-600">Enter your email to receive a reset link</p>
                                </div>

                                {/* Auth Error Message */}
                                {authError && (
                                    <div className="mb-6 p-3 rounded-lg animate-fade-in"
                                        style={{ backgroundColor: solarTheme.error[50], borderColor: solarTheme.error[200], border: '1px solid' }}>
                                        <div className="flex items-start">
                                            <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: solarTheme.error[600] }} />
                                            <span className="text-sm" style={{ color: solarTheme.error[600] }}>{authError}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Reset Form */}
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
                                                onChange={(e) => handleInputChange(e.target.value)}
                                                onBlur={handleInputBlur}
                                                className={getInputClasses("w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors bg-white placeholder:text-gray-400")}
                                                placeholder="Enter your email address"
                                                disabled={isLoading}
                                                autoComplete="email"
                                            />
                                        </div>
                                        <FieldError error={touched.email ? errors.email : ''} />
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
                                                Send Reset Link
                                                <ArrowRight className="h-5 w-5 ml-2" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* Info Message */}
                                <div className="mt-6 p-3 rounded-lg" style={{ backgroundColor: solarTheme.primary[50] }}>
                                    <p className="text-sm text-center" style={{ color: solarTheme.primary[700] }}>
                                        We&apos;ll send a secure reset link to your email address
                                    </p>
                                </div>

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

                                {/* Back to Login Link */}
                                <Link
                                    href="/login"
                                    className="flex items-center justify-center text-sm mt-6 transition-colors hover:opacity-80"
                                    style={{ color: solarTheme.primary[600] }}
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Sign In
                                </Link>

                                {/* Security Badge */}
                                <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
                                    <CheckCircle className="h-4 w-4 mr-2" style={{ color: solarTheme.primary[500] }} />
                                    Bank-level security for password recovery
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600 mb-3">Need help?</p>
                                <div className="flex space-x-4 justify-center">
                                    <Link
                                        href="/"
                                        className={cn("px-4 py-2 rounded-lg transition-colors hover-lift", glassStyles.light)}
                                        style={{ color: solarTheme.primary[600] }}
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        href="/contact-us"
                                        className={cn("px-4 py-2 rounded-lg transition-colors hover-lift", glassStyles.light)}
                                        style={{ color: solarTheme.primary[600] }}
                                    >
                                        Support
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