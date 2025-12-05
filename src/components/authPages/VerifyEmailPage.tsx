'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Mail,
    CheckCircle,
    Sun,
    ArrowRight,
    RefreshCw,
    Clock,
    Shield,
    AlertCircle,
    ArrowLeft,
    X,
    Check,
} from 'lucide-react';

import { solarTheme } from '@/theme/theme';
import { glassStyles, cn } from '@/lib/theme-utils';
import { useAuth } from '@/hooks/useAuth';
import type { ResendOTPRequest, VerifyEmailOTPRequest } from '@/types/authTypes';

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const {
        user,
        isAuthenticated,
        isInitialized,
        resendOTP,
        verifyEmailOTP,
        isLoading,
        error: authError,
        clearError
    } = useAuth();

    const [email, setEmail] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [resendCooldown, setResendCooldown] = useState<number>(0);
    const [showResendSuccess, setShowResendSuccess] = useState<boolean>(false);

    // OTP state
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [otpTouched, setOtpTouched] = useState<boolean>(false);
    const [showOtpSection, setShowOtpSection] = useState<boolean>(false);
    const [otpInitialized, setOtpInitialized] = useState<boolean>(false);

    // Refs for OTP inputs
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Get email from URL params or user
    useEffect(() => {
        const emailParam = searchParams?.get('email');
        if (emailParam) {
            setEmail(decodeURIComponent(emailParam));
            setShowOtpSection(true);
            handleAutoSendOTP(decodeURIComponent(emailParam));
        } else if (user?.email) {
            setEmail(user.email);
        }
    }, [searchParams, user]);

    // Handle successful email verification from URL params
    useEffect(() => {
        const verified = searchParams?.get('verified');
        const message = searchParams?.get('message');

        if (verified === 'true') {
            setSuccessMessage('Your email has been successfully verified!');
        } else if (message) {
            setSuccessMessage(decodeURIComponent(message));
        }
    }, [searchParams]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => {
                setResendCooldown(resendCooldown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    // Clear auth error on mount
    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    // Auto-focus first OTP input when section becomes visible
    useEffect(() => {
        if (showOtpSection && otpRefs.current[0]) {
            const timer = setTimeout(() => {
                otpRefs.current[0]?.focus();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [showOtpSection]);

    // Auto-send OTP when email is available
    const handleAutoSendOTP = async (targetEmail?: string): Promise<void> => {
        const emailToUse = targetEmail || email;
        if (!emailToUse || otpInitialized) return;

        try {
            setOtpInitialized(true);
            const resendData: ResendOTPRequest = {
                userId: user?.userId || '',
                email: emailToUse
            };

            await resendOTP(resendData);
            setResendCooldown(60); // 60 second cooldown
            setShowResendSuccess(true);

            // Hide success message after 5 seconds
            setTimeout(() => setShowResendSuccess(false), 5000);

        } catch (error) {
            console.error('Failed to auto-send OTP:', error);
        }
    };

    // Validate OTP
    const validateOTP = (otpArray: string[]): string => {
        const otpString = otpArray.join('');

        if (otpString.length === 0) {
            return 'Please enter the verification code';
        }

        if (otpString.length !== 6) {
            return 'Please enter all 6 digits';
        }

        if (!/^\d{6}$/.test(otpString)) {
            return 'Verification code must contain only numbers';
        }

        return '';
    };

    // Handle OTP input change
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

        // Auto move to next input
        if (value !== '' && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }

        // Clear auth error when user starts typing
        if (authError) {
            clearError();
        }
    };

    // Handle OTP key events
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
                const digits = text.replace(/\D/g, '').slice(0, 6);
                if (digits.length <= 6) {
                    const newOtp = [...otp];
                    for (let i = 0; i < 6; i++) {
                        newOtp[i] = digits[i] || '';
                    }
                    setOtp(newOtp);

                    // Focus last filled input or next empty one
                    const lastIndex = Math.min(digits.length - 1, 5);
                    otpRefs.current[lastIndex]?.focus();
                }
            });
        }
    };

    // Verify OTP
    const handleVerifyOTP = async (): Promise<void> => {
        if (!user?.userId) {
            setSuccessMessage('Please sign in first to verify your email.');
            return;
        }

        setOtpTouched(true);
        const otpError = validateOTP(otp);

        if (otpError) {
            return;
        }

        try {
            const verifyData: VerifyEmailOTPRequest = {
                userId: user.userId,
                email: email,
                otp: otp.join('')
            };

            await verifyEmailOTP(verifyData);

            // Success
            setSuccessMessage('Email verified successfully! You now have access to all features.');

            // Redirect to dashboard or redirect URL after a short delay
            setTimeout(() => {
                const redirect = searchParams?.get('redirect') || '/';
                router.push(redirect);
            }, 2000);

        } catch (error) {
            console.error('OTP verification failed:', error);
        }
    };

    const handleResendVerification = async (): Promise<void> => {
        if (resendCooldown > 0 || !email) return;

        try {
            const resendData: ResendOTPRequest = {
                userId: user?.userId || '',
                email: email
            };

            await resendOTP(resendData);

            setShowResendSuccess(true);
            setResendCooldown(60); // 60 second cooldown
            setOtp(['', '', '', '', '', '']);
            setOtpTouched(false);

            // Show OTP section if not already visible
            setShowOtpSection(true);

            // Focus first input
            if (otpRefs.current[0]) {
                setTimeout(() => {
                    otpRefs.current[0]?.focus();
                }, 100);
            }

            // Hide success message after 5 seconds
            setTimeout(() => setShowResendSuccess(false), 5000);

        } catch (error) {
            console.error('Failed to resend verification email:', error);
        }
    };

    const handleContinue = () => {
        if (isAuthenticated && user?.emailVerified) {
            // User is verified, go to dashboard
            const redirect = searchParams?.get('redirect') || '/';
            router.push(redirect);
        } else {
            // Go to login
            router.push('/login?message=Please sign in to continue');
        }
    };

    const handleShowOtpInput = () => {
        setShowOtpSection(true);
        if (!otpInitialized) {
            handleAutoSendOTP();
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

    // Show loading while initializing
    if (!isInitialized) {
        return (
            <div className="min-h-screen bg-solar flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    const otpError = otpTouched ? validateOTP(otp) : '';
    const isOtpValid = !validateOTP(otp);

    // Get password requirements for OTP display
    const getOtpRequirements = () => {
        const otpString = otp.join('');
        return [
            {
                text: 'Enter all 6 digits',
                met: otpString.length === 6
            },
            {
                text: 'Only numbers allowed',
                met: /^\d*$/.test(otpString)
            }
        ];
    };

    const otpRequirements = getOtpRequirements();

    return (
        <div className="min-h-screen bg-solar">
            {/* Container with proper responsive padding */}
            <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12 lg:py-16">

                {/* Mobile and Desktop unified layout */}
                <div className="max-w-4xl mx-auto">

                    {/* Header Section - Responsive */}
                    <div className="text-center mb-8 md:mb-12">
                        <div
                            className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl mb-4 md:mb-6 shadow-lg"
                            style={{ background: `linear-gradient(to right, ${solarTheme.primary[500]}, ${solarTheme.primary[600]})` }}
                        >
                            <Mail className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white" />
                        </div>

                        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-4 px-4">
                            {showOtpSection ? 'Enter Verification Code' : 'Verify Your Email'}
                        </h1>

                        <p className="text-sm sm:text-base md:text-lg text-gray-600 px-4 max-w-2xl mx-auto">
                            {showOtpSection
                                ? 'Enter the 6-digit code sent to your email address'
                                : "We'll send a verification code to your email address"
                            }
                        </p>
                    </div>

                    {/* Main Content Card */}
                    <div className="card-solar mx-4 sm:mx-6 md:mx-8 lg:mx-auto lg:max-w-3xl">

                        {/* Success Message */}
                        {successMessage && (
                            <div
                                className="mb-4 md:mb-6 p-3 md:p-4 rounded-lg animate-fade-in"
                                style={{ backgroundColor: solarTheme.success[50]}}
                            >
                                <div className="flex items-start">
                                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 mt-0.5 flex-shrink-0" style={{ color: solarTheme.success[600] }} />
                                    <div>
                                        <p className="text-xs sm:text-sm md:text-base font-medium" style={{ color: solarTheme.success[800] }}>
                                            {successMessage}
                                        </p>
                                        <p className="text-xs md:text-sm mt-1" style={{ color: solarTheme.success[700] }}>
                                            You can now access all features of your account.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Resend Success Message */}
                        {showResendSuccess && (
                            <div
                                className="mb-4 md:mb-6 p-3 md:p-4 rounded-lg animate-fade-in"
                                style={{ backgroundColor: solarTheme.success[50], borderColor: solarTheme.success[200], border: '1px solid' }}
                            >
                                <div className="flex items-start">
                                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 mt-0.5 flex-shrink-0" style={{ color: solarTheme.success[600] }} />
                                    <p className="text-xs sm:text-sm md:text-base" style={{ color: solarTheme.success[600] }}>
                                        Verification code sent successfully! Please check your inbox.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Auth Error Message */}
                        {authError && (
                            <div
                                className="mb-4 md:mb-6 p-3 md:p-4 rounded-lg animate-fade-in"
                                style={{ backgroundColor: solarTheme.error[50]}}
                            >
                                <div className="flex items-start">
                                    <AlertCircle className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 mt-0.5 flex-shrink-0" style={{ color: solarTheme.error[600] }} />
                                    <span className="text-xs sm:text-sm md:text-base" style={{ color: solarTheme.error[600] }}>
                                        {authError}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Email Display */}
                        {email && (
                            <div className="text-center mb-6 md:mb-8">
                                <div
                                    className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl mb-3 md:mb-4"
                                    style={{ backgroundColor: solarTheme.primary[100] }}
                                >
                                    <Mail className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12" style={{ color: solarTheme.primary[600] }} />
                                </div>

                                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 md:mb-3">
                                    {showOtpSection ? 'Enter Verification Code' : 'Check Your Email'}
                                </h2>

                                <p className="text-sm md:text-base text-gray-600 mb-2">
                                    {showOtpSection
                                        ? 'Enter the 6-digit code sent to:'
                                        : "We'll send a verification code to:"
                                    }
                                </p>

                                <p className="text-sm sm:text-base md:text-lg font-medium px-4" style={{ color: solarTheme.primary[700] }}>
                                    {maskEmail(email)}
                                </p>
                            </div>
                        )}

                        {/* OTP Input Section or Send Code Section */}
                        {showOtpSection ? (
                            <div className="space-y-6 md:space-y-8">

                                {/* OTP Input */}
                                <div className="mb-6 md:mb-8">
                                    <label className="block text-sm md:text-base font-medium text-gray-700 mb-3 md:mb-4 text-center">
                                        Enter 6-Digit Verification Code
                                    </label>

                                    {/* Responsive OTP Input Grid */}
                                    <div className="flex justify-center items-center gap-2 sm:gap-3 md:gap-4 mb-3 md:mb-4 px-4">
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
                                                className={`
                                                    w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14
                                                    text-center text-base sm:text-lg md:text-xl lg:text-2xl font-semibold 
                                                    border rounded-lg md:rounded-xl 
                                                    focus:ring-2 outline-none transition-colors bg-white 
                                                    ${otpError && otpTouched
                                                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                                        : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
                                                    }
                                                `}
                                                disabled={isLoading}
                                                
                                            />
                                        ))}
                                    </div>

                                    {/* OTP Error Display */}
                                    {otpError && otpTouched && (
                                        <div className="mt-2 flex items-center justify-center animate-fade-in">
                                            <span className="text-xs sm:text-sm leading-5 text-center px-4" style={{ color: solarTheme.error[600] }}>
                                                {otpError}
                                            </span>
                                        </div>
                                    )}

                                    {/* OTP Requirements Display */}
                                    {otp.join('') && (
                                        <div className="mt-3 md:mt-4">
                                            <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-6 space-y-1 sm:space-y-0">
                                                {otpRequirements.map((req, index) => (
                                                    <div key={index} className="flex items-center justify-center text-xs sm:text-sm">
                                                        {req.met ? (
                                                            <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" style={{ color: solarTheme.success[600] }} />
                                                        ) : (
                                                            <X className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" style={{ color: solarTheme.error[500] }} />
                                                        )}
                                                        <span style={{ color: req.met ? solarTheme.success[600] : solarTheme.error[600] }}>
                                                            {req.text}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Paste Helper Text */}
                                    <div className="mt-2 md:mt-3 text-center">
                                        <p className="text-xs text-gray-500 px-4">
                                            Tip: You can paste the code with Ctrl+V (or Cmd+V on Mac)
                                        </p>
                                    </div>
                                </div>

                                {/* Auto-send notification */}
                                {resendCooldown > 50 && (
                                    <div className="mb-4 md:mb-6 p-3 rounded-lg" style={{ backgroundColor: solarTheme.primary[50] }}>
                                        <div className="flex items-center justify-center">
                                            <CheckCircle className="h-4 w-4 mr-2" style={{ color: solarTheme.primary[600] }} />
                                            <p className="text-sm" style={{ color: solarTheme.primary[700] }}>
                                                Verification code sent to your email
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Resend Section */}
                                <div className="text-center mb-6 md:mb-8">
                                    <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 px-4">
                                        Didn&apos;t receive the code?
                                    </p>

                                    {resendCooldown > 0 ? (
                                        <div className="flex items-center justify-center space-x-2 text-sm md:text-base" style={{ color: solarTheme.primary[600] }}>
                                            <Clock className="h-4 w-4" />
                                            <span>Resend available in {resendCooldown}s</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleResendVerification}
                                            disabled={isLoading || !email}
                                            className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-base font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{
                                                backgroundColor: solarTheme.primary[50],
                                                color: solarTheme.primary[700],
                                                border: `1px solid ${solarTheme.primary[200]}`
                                            }}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <RefreshCw className="h-4 w-4 mr-2" />
                                                    Resend Code
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3 md:space-y-4">
                                    <button
                                        onClick={handleVerifyOTP}
                                        disabled={isLoading || !isOtpValid}
                                        className="w-full py-3 md:py-4 px-6 rounded-xl text-base md:text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 btn-solar"
                                    >
                                        {isLoading ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        ) : (
                                            <>
                                                Verify Email
                                                <ArrowRight className="h-5 w-5 ml-2" />
                                            </>
                                        )}
                                    </button>

                                    <Link
                                        href="/"
                                        className="w-full flex items-center justify-center px-6 py-3 md:py-4 rounded-xl text-base md:text-lg font-medium transition-all duration-300"
                                        style={{
                                            backgroundColor: solarTheme.neutral[100],
                                            color: solarTheme.neutral[700]
                                        }}
                                    >
                                        <ArrowLeft className="h-5 w-5 mr-2" />
                                        Back to Home
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 md:space-y-8">

                                {/* Instructions */}
                                <div className="space-y-4">
                                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 text-center mb-4 md:mb-6">
                                        Verification Process
                                    </h3>

                                    <div className="space-y-3 md:space-y-4">
                                        {[
                                            { step: '1', title: 'Send verification code', desc: "We'll send a 6-digit code to your email" },
                                            { step: '2', title: 'Enter the code', desc: 'Type the code to verify your email' },
                                            { step: '3', title: 'Access all features', desc: 'Start exploring our solar solutions' }
                                        ].map((item, index) => (
                                            <div key={index} className="flex items-start space-x-3 md:space-x-4">
                                                <div
                                                    className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-white"
                                                    style={{ backgroundColor: solarTheme.primary[600] }}
                                                >
                                                    {item.step}
                                                </div>
                                                <div>
                                                    <p className="text-sm md:text-base text-gray-800 font-medium">{item.title}</p>
                                                    <p className="text-xs md:text-sm text-gray-600 mt-1">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3 md:space-y-4">
                                    <button
                                        onClick={handleShowOtpInput}
                                        disabled={!email}
                                        className="w-full py-3 md:py-4 px-6 rounded-xl text-base md:text-lg font-semibold flex items-center justify-center transition-all duration-200 disabled:opacity-50 btn-solar"
                                    >
                                        Send Verification Code
                                        <ArrowRight className="h-5 w-5 ml-2" />
                                    </button>

                                    <Link
                                        href="/"
                                        className="w-full flex items-center justify-center px-6 py-3 md:py-4 rounded-xl text-base md:text-lg font-medium transition-all duration-300"
                                        style={{
                                            backgroundColor: solarTheme.neutral[100],
                                            color: solarTheme.neutral[700]
                                        }}
                                    >
                                        <ArrowLeft className="h-5 w-5 mr-2" />
                                        Back to Home
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Help Section */}
                        <div className="mt-6 md:mt-8 p-3 md:p-4 rounded-lg" style={{ backgroundColor: solarTheme.primary[50] }}>
                            <div className="flex items-start space-x-3">
                                <Shield className="h-4 w-4 md:h-5 md:w-5 mt-0.5 flex-shrink-0" style={{ color: solarTheme.primary[600] }} />
                                <div>
                                    <p className="text-sm md:text-base font-medium" style={{ color: solarTheme.primary[800] }}>
                                        Need Help?
                                    </p>
                                    <p className="text-xs md:text-sm mt-1" style={{ color: solarTheme.primary[700] }}>
                                        If you&apos;re having trouble, contact our support team at{' '}
                                        <a href="mailto:support@generalenergysolutions.com" className="underline">
                                            support@generalenergysolutions.com
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}