'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Mail,
    Sun,
    ArrowRight,
    Shield,
    CheckCircle,
    ChevronDown,
    AlertCircle,
    ArrowLeft,
    Clock,
    RefreshCw,
} from 'lucide-react';

import { solarTheme } from '@/theme/theme';
import { glassStyles, cn } from '@/lib/theme-utils';
import { useAuth } from '@/hooks/useAuth';
import type { ResendOTPRequest, VerifyEmailOTPRequest } from '@/types/authTypes';

interface FormErrors {
    otp: string;
}

export default function VerifyOTPPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const {
        user,
        resendOTP,
        verifyEmailOTP,
        isLoading,
        error: authError,
        clearError,
        isAuthenticated,
        isInitialized
    } = useAuth();

    const [email, setEmail] = useState<string>('');
    // Changed to 6 digits
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [resendCooldown, setResendCooldown] = useState<number>(0);

    const [errors, setErrors] = useState<FormErrors>({
        otp: ''
    });

    const [touched, setTouched] = useState(false);
    const [showBenefits, setShowBenefits] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');

    // Refs for OTP inputs - updated for 6 digits
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Get email from URL params or user
    useEffect(() => {
        const emailParam = searchParams?.get('email');
        if (emailParam) {
            setEmail(decodeURIComponent(emailParam));
        } else if (user?.email) {
            setEmail(user.email);
        } else {
            // Redirect back to forgot password if no email
            router.push('/forgot-password');
        }
    }, [searchParams, user, router]);

    // Redirect if already authenticated and verified
    useEffect(() => {
        if (isInitialized && isAuthenticated && user?.emailVerified) {
            const redirect = searchParams?.get('redirect') || '/';
            router.push(redirect);
        }
    }, [isAuthenticated, isInitialized, router, searchParams, user]);

    // Auto-send OTP when page loads (if user is authenticated)
    useEffect(() => {
        if (isInitialized && isAuthenticated && user && email && !user.emailVerified) {
            handleAutoSendOTP();
        }
    }, [isInitialized, isAuthenticated, user, email]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => {
                setResendCooldown(resendCooldown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    // Clear auth error when component unmounts or user starts typing
    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    // Focus first input on mount
    useEffect(() => {
        if (otpRefs.current[0]) {
            otpRefs.current[0].focus();
        }
    }, []);

    const handleAutoSendOTP = async (): Promise<void> => {
        if (!user || !email) return;

        try {
            const resendData: ResendOTPRequest = {
                userId: user.userId,
                email: email
            };

            await resendOTP(resendData);
            setResendCooldown(60); // 60 second cooldown
        } catch (error) {
            console.error('Failed to auto-send OTP:', error);
        }
    };

    const validateOTP = (otpArray: string[]): string => {
        const otpString = otpArray.join('');

        if (otpString.length === 0) {
            return 'Please enter the verification code';
        }

        if (otpString.length !== 6) { // Changed from 4 to 6
            return 'Please enter all 6 digits';
        }

        if (!/^\d{6}$/.test(otpString)) { // Changed from 4 to 6
            return 'Verification code must contain only numbers';
        }

        return '';
    };

    const handleOTPChange = (index: number, value: string): void => {
        // Only allow single digit
        if (value.length > 1) {
            value = value.slice(-1);
        }

        // Only allow numbers
        if (value !== '' && !/^\d$/.test(value)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto move to next input - updated for 6 digits
        if (value !== '' && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }

        // Validate if field has been touched
        if (touched) {
            const error = validateOTP(newOtp);
            setErrors(prev => ({
                ...prev,
                otp: error
            }));
        }

        // Clear auth error when user starts typing
        if (authError) {
            clearError();
        }
    };

    const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
        // Handle backspace
        if (e.key === 'Backspace') {
            if (otp[index] === '' && index > 0) {
                // Move to previous input if current is empty
                otpRefs.current[index - 1]?.focus();
            } else {
                // Clear current input
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            }
        }
        // Handle paste
        else if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            navigator.clipboard.readText().then(text => {
                const digits = text.replace(/\D/g, '').slice(0, 6); // Changed from 4 to 6
                if (digits.length <= 6) { // Changed from 4 to 6
                    const newOtp = [...otp];
                    for (let i = 0; i < 6; i++) { // Changed from 4 to 6
                        newOtp[i] = digits[i] || '';
                    }
                    setOtp(newOtp);

                    // Focus last filled input or next empty one
                    const lastIndex = Math.min(digits.length - 1, 5); // Changed from 3 to 5
                    otpRefs.current[lastIndex]?.focus();
                }
            });
        }
    };

    const handleOTPBlur = (): void => {
        setTouched(true);
        const error = validateOTP(otp);
        setErrors(prev => ({
            ...prev,
            otp: error
        }));
    };

    const isFormValid = (): boolean => {
        const otpError = validateOTP(otp);
        return !otpError;
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        // Mark as touched
        setTouched(true);

        // Validate OTP
        const otpError = validateOTP(otp);

        setErrors({
            otp: otpError
        });

        // If there are validation errors, don't submit
        if (otpError) {
            return;
        }

        try {
            const otpString = otp.join('');

            if (user) {
                // For authenticated users, use the verifyEmailOTP function
                const verifyData: VerifyEmailOTPRequest = {
                    userId: user.userId,
                    email: user.email,
                    otp: otpString
                };

                await verifyEmailOTP(verifyData);

                setSuccessMessage('Email verified successfully!');

                // Redirect after successful verification
                setTimeout(() => {
                    const redirect = searchParams?.get('redirect') || '/';
                    router.push(redirect);
                }, 2000);
            } else {
                // For password reset flow (simulate verification for now)
                // In real implementation, you would call a different API endpoint
                await new Promise(resolve => setTimeout(resolve, 1500));

                if (otpString.length === 6) {
                    // Redirect to new password page with token
                    const token = btoa(otpString + '_' + Date.now()); // Create a simple token
                    router.push(`/new-password?token=${encodeURIComponent(token)}`);
                } else {
                    setErrors(prev => ({
                        ...prev,
                        otp: 'Invalid verification code. Please try again.'
                    }));
                }
            }

        } catch (error) {
            console.error('OTP verification failed:', error);
        }
    };

    const handleResendOTP = async (): Promise<void> => {
        if (resendCooldown > 0 || !email) return;

        try {
            if (user) {
                // For authenticated users
                const resendData: ResendOTPRequest = {
                    userId: user.userId,
                    email: user.email
                };

                await resendOTP(resendData);
            } else {
                // For password reset flow, you might need a different endpoint
                // For now, simulate the call
                await new Promise(resolve => setTimeout(resolve, 1500));
            }

            setSuccessMessage('Verification code sent successfully!');
            setResendCooldown(60); // 60 second cooldown

            // Clear OTP inputs
            setOtp(['', '', '', '', '', '']); // Reset to 6 digits
            setTouched(false);

            // Focus first input
            if (otpRefs.current[0]) {
                otpRefs.current[0].focus();
            }

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);

        } catch (error) {
            console.error('Resend OTP failed:', error);
        }
    };

    const benefits = [
        { icon: <Shield className="h-4 w-4" />, text: "Secure Verification" },
        { icon: <Clock className="h-4 w-4" />, text: "Quick Process" },
        { icon: <Mail className="h-4 w-4" />, text: "Email Protected" },
        { icon: <RefreshCw className="h-4 w-4" />, text: "Resend Option" }
    ];

    // Component for rendering field errors
    const FieldError = ({ error }: { error: string }) => {
        if (!error) return null;

        return (
            <div className="mt-4 flex items-center animate-fade-in justify-center">
                <span className="text-sm leading-5" style={{ color: solarTheme.error[600] }}>
                    {error}
                </span>
            </div>
        );
    };

    // Get input class names based on error state
    const getInputClasses = (baseClasses: string): string => {
        const hasError = errors.otp && touched;
        const errorClasses = hasError
            ? `border-red-500 focus:ring-red-500 focus:border-red-500`
            : `border-gray-300 focus:ring-green-500 focus:border-transparent`;

        return cn(baseClasses, errorClasses);
    };

    // Mask email for display
    const maskEmail = (email: string): string => {
        if (!email) return '';
        const [username, domain] = email.split('@');
        if (!username || !domain) return email;

        const maskedUsername = username.length > 2
            ? username[0] + '*'.repeat(username.length - 2) + username[username.length - 1]
            : username;

        return `${maskedUsername}@${domain}`;
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
                            Verify Code
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Enter the 6-digit code sent to your email
                        </p>
                    </div>

                    {/* Collapsible Benefits */}
                    <button
                        onClick={() => setShowBenefits(!showBenefits)}
                        className="w-full mt-4 flex items-center justify-center text-sm transition-colors"
                        style={{ color: solarTheme.primary[600] }}
                    >
                        <span>Secure verification process</span>
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

                        {/* Email Display */}
                        <div className="text-center mb-6">
                            <p className="text-sm text-gray-600 mb-2">Verification code sent to:</p>
                            <p className="font-medium" style={{ color: solarTheme.primary[700] }}>
                                {maskEmail(email)}
                            </p>
                        </div>

                        {/* Verification Form */}
                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            {/* OTP Input - Updated for 6 digits */}
                            <div className="animate-slide-up">
                                <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                                    Enter 6-Digit Verification Code
                                </label>
                                <div className="flex justify-center space-x-2 mb-2">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el: HTMLInputElement | null) => { otpRefs.current[index] = el; }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOTPChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOTPKeyDown(index, e)}
                                            onBlur={handleOTPBlur}
                                            className={getInputClasses("w-12 h-12 text-center text-xl font-semibold border rounded-xl focus:ring-2 outline-none transition-colors bg-white")}
                                            disabled={isLoading}
                                        />
                                    ))}
                                </div>
                                <FieldError error={touched ? errors.otp : ''} />
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
                                        Verify Code
                                        <ArrowRight className="h-5 w-5 ml-2" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Resend Section */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600 mb-3">
                                Didn&apos;t receive the code?
                            </p>
                            {resendCooldown > 0 ? (
                                <p className="text-sm" style={{ color: solarTheme.primary[600] }}>
                                    Resend available in {resendCooldown}s
                                </p>
                            ) : (
                                <button
                                    onClick={handleResendOTP}
                                    disabled={isLoading}
                                    className="text-sm font-medium transition-colors hover:opacity-80 disabled:opacity-50"
                                    style={{ color: solarTheme.primary[600] }}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                                            Sending...
                                        </span>
                                    ) : (
                                        'Resend Code'
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Back Link */}
                        <div className="mt-6 text-center">
                            <Link
                                href={user ? "/verify-email" : "/forgot-password"}
                                className="flex items-center justify-center text-sm transition-colors hover:opacity-80"
                                style={{ color: solarTheme.primary[600] }}
                            >
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                {user ? "Back to Verification Info" : "Back to Email Entry"}
                            </Link>
                        </div>

                        {/* Security Badge */}
                        <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
                            <CheckCircle className="h-4 w-4 mr-2" style={{ color: solarTheme.primary[500] }} />
                            Secure verification process
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

            {/* Desktop Layout - Similar structure with 6-digit support */}
            <div className="hidden lg:flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow"
                        style={{ backgroundColor: solarTheme.primary[200] }}></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow"
                        style={{ backgroundColor: solarTheme.secondary[200] }}></div>
                </div>

                <div className="relative w-full max-w-2xl mx-auto">
                    <div className="card-solar animate-slide-up">
                        {/* Form Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Code</h2>
                            <p className="text-gray-600 mb-4">Enter the 6-digit code sent to your email</p>
                            <p className="text-sm font-medium" style={{ color: solarTheme.primary[700] }}>
                                {maskEmail(email)}
                            </p>
                        </div>

                        {/* Success and Error Messages */}
                        {successMessage && (
                            <div className="mb-6 p-3 rounded-lg animate-fade-in"
                                style={{ backgroundColor: solarTheme.success[50], borderColor: solarTheme.success[200], border: '1px solid' }}>
                                <div className="flex items-start">
                                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: solarTheme.success[600] }} />
                                    <p className="text-sm" style={{ color: solarTheme.success[600] }}>{successMessage}</p>
                                </div>
                            </div>
                        )}

                        {authError && (
                            <div className="mb-6 p-3 rounded-lg animate-fade-in"
                                style={{ backgroundColor: solarTheme.error[50], borderColor: solarTheme.error[200], border: '1px solid' }}>
                                <div className="flex items-start">
                                    <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: solarTheme.error[600] }} />
                                    <span className="text-sm" style={{ color: solarTheme.error[600] }}>{authError}</span>
                                </div>
                            </div>
                        )}

                        {/* Verification Form */}
                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            {/* OTP Input - 6 digits for desktop */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                                    Verification Code
                                </label>
                                <div className="flex justify-center space-x-3 mb-2">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => { otpRefs.current[index] = el; }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOTPChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOTPKeyDown(index, e)}
                                            onBlur={handleOTPBlur}
                                            className={getInputClasses("w-14 h-14 text-center text-2xl font-semibold border rounded-xl focus:ring-2 outline-none transition-colors bg-white")}
                                            disabled={isLoading}
                                        />
                                    ))}
                                </div>
                                <FieldError error={touched ? errors.otp : ''} />
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
                                        Verify Code
                                        <ArrowRight className="h-5 w-5 ml-2" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Resend Section */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600 mb-3">
                                Didn&apos;t receive the code?
                            </p>
                            {resendCooldown > 0 ? (
                                <p className="text-sm" style={{ color: solarTheme.primary[600] }}>
                                    Resend available in {resendCooldown}s
                                </p>
                            ) : (
                                <button
                                    onClick={handleResendOTP}
                                    disabled={isLoading}
                                    className="text-sm font-medium transition-colors hover:opacity-80 disabled:opacity-50"
                                    style={{ color: solarTheme.primary[600] }}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                                            Sending...
                                        </span>
                                    ) : (
                                        'Resend Code'
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Back Link */}
                        <div className="mt-6 text-center">
                            <Link
                                href={user ? "/verify-email" : "/forgot-password"}
                                className="flex items-center justify-center text-sm transition-colors hover:opacity-80"
                                style={{ color: solarTheme.primary[600] }}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {user ? "Back to Verification Info" : "Back to Email Entry"}
                            </Link>
                        </div>

                        {/* Security Badge */}
                        <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
                            <CheckCircle className="h-4 w-4 mr-2" style={{ color: solarTheme.primary[500] }} />
                            Two-factor authentication for enhanced security
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}