'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    X,
    Mail,
    AlertCircle,
    CheckCircle,
    RefreshCw,
    Clock,
    Shield,
    ArrowRight,
    Check,
} from 'lucide-react';

import { solarTheme } from '@/theme/theme';
import { useAuth } from '@/hooks/useAuth';
import type { ResendOTPRequest, VerifyEmailOTPRequest } from '@/types/authTypes';

interface EmailVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerified?: () => void;
    title?: string;
    message?: string;
    showOTPInput?: boolean; // Controls whether to show OTP input immediately
}

export default function EmailVerificationModal({
    isOpen,
    onClose,
    onVerified,
    title = "Verify Your Email",
    message = "Please verify your email address to continue",
    showOTPInput = false // Default to false for backward compatibility
}: EmailVerificationModalProps) {
    const {
        user,
        resendOTP,
        verifyEmailOTP,
        isLoading,
        error: authError,
        clearError
    } = useAuth();

    // OTP state - 6 digits
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [resendCooldown, setResendCooldown] = useState<number>(0);
    const [showResendSuccess, setShowResendSuccess] = useState<boolean>(false);
    const [touched, setTouched] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [currentlyShowOTP, setCurrentlyShowOTP] = useState<boolean>(showOTPInput);

    // Refs for OTP inputs - 6 digits
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
    const modalRef = useRef<HTMLDivElement>(null);

    // Handle escape key and click outside
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => {
                setResendCooldown(resendCooldown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    // Auto-send OTP when modal opens (only if showOTPInput is true)
    useEffect(() => {
        if (isOpen && user && !isInitialized && showOTPInput) {
            setIsInitialized(true);
            handleAutoSendOTP();
        }
    }, [isOpen, user, isInitialized, showOTPInput]);

    // Clear states when modal opens
    useEffect(() => {
        if (isOpen) {
            setOtp(['', '', '', '', '', '']); // Reset to 6 digits
            setTouched(false);
            setShowResendSuccess(false);
            setCurrentlyShowOTP(showOTPInput);
            clearError();
        }
    }, [isOpen, clearError, showOTPInput]);

    // Focus first input when modal opens and OTP section is visible
    useEffect(() => {
        if (isOpen && otpRefs.current[0] && currentlyShowOTP) {
            // Delay focus to ensure modal is fully rendered
            const timer = setTimeout(() => {
                otpRefs.current[0]?.focus();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen, currentlyShowOTP]);

    // Auto-send OTP when modal opens
    const handleAutoSendOTP = async (): Promise<void> => {
        if (!user) return;

        try {
            const resendData: ResendOTPRequest = {
                userId: user.userId,
                email: user.email
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
            }).catch(() => {
                // Handle clipboard access error silently
            });
        }
        // Handle arrow keys for navigation
        else if (e.key === 'ArrowLeft' && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
        else if (e.key === 'ArrowRight' && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleVerifyOTP = async (): Promise<void> => {
        if (!user) return;

        setTouched(true);
        const otpError = validateOTP(otp);

        if (otpError) {
            return;
        }

        try {
            const verifyData: VerifyEmailOTPRequest = {
                userId: user.userId,
                email: user.email,
                otp: otp.join('')
            };

            await verifyEmailOTP(verifyData);

            // Success - call onVerified callback
            if (onVerified) {
                onVerified();
            } else {
                onClose();
            }

        } catch (error) {
            console.error('OTP verification failed:', error);
            // Error is handled by the auth hook and will show in authError
        }
    };

    const handleResendVerification = async (): Promise<void> => {
        if (resendCooldown > 0 || !user) return;

        try {
            const resendData: ResendOTPRequest = {
                userId: user.userId,
                email: user.email
            };

            await resendOTP(resendData);

            setShowResendSuccess(true);
            setResendCooldown(60); // 60 second cooldown
            setOtp(['', '', '', '', '', '']); // Reset to 6 digits
            setTouched(false);
            setCurrentlyShowOTP(true); // Show OTP section after resend

            // Focus first input
            if (otpRefs.current[0]) {
                setTimeout(() => {
                    otpRefs.current[0]?.focus();
                }, 100);
            }

            // Hide success message after 5 seconds
            setTimeout(() => setShowResendSuccess(false), 5000);

        } catch (error) {
            console.error('Failed to resend verification:', error);
        }
    };

    const handleSendVerificationCode = async (): Promise<void> => {
        if (!user) return;

        try {
            setCurrentlyShowOTP(true);
            setIsInitialized(true);

            const resendData: ResendOTPRequest = {
                userId: user.userId,
                email: user.email
            };

            await resendOTP(resendData);
            setResendCooldown(60);
            setShowResendSuccess(true);

            // Focus first input after sending
            setTimeout(() => {
                if (otpRefs.current[0]) {
                    otpRefs.current[0].focus();
                }
            }, 300);

            // Hide success message after 5 seconds
            setTimeout(() => setShowResendSuccess(false), 5000);

        } catch (error) {
            console.error('Failed to send verification code:', error);
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

    // Get OTP requirements for validation display
    const getOtpRequirements = () => {
        const otpString = otp.join('');
        return [
            {
                text: 'Enter all 6 digits',
                met: otpString.length === 6
            },
            {
                text: 'Only numbers allowed',
                met: /^\d*$/.test(otpString) && otpString.length > 0
            }
        ];
    };

    if (!isOpen || !user) {
        return null;
    }

    const otpError = touched ? validateOTP(otp) : '';
    const isFormValid = !validateOTP(otp);
    const otpRequirements = getOtpRequirements();

    return (
        <div className="fixed inset-0 bg-trasparent backdrop-blur-md bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 z-50">
            <div
                ref={modalRef}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-[340px] sm:max-w-md md:max-w-lg mx-auto transform transition-all duration-300 scale-100 opacity-100 max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="relative p-4 sm:p-6 pb-3 sm:pb-4">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-xl transition-all duration-200 hover:bg-gray-100 touch-manipulation"
                        style={{ color: solarTheme.neutral[500] }}
                    >
                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>

                    <div className="text-center">
                        <div
                            className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg"
                            style={{ background: `linear-gradient(to right, ${solarTheme.primary[500]}, ${solarTheme.primary[600]})` }}
                        >
                            <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                        </div>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 px-2">
                            {title}
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 px-2">
                            {message}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    {/* Success Message */}
                    {showResendSuccess && (
                        <div
                            className="mb-4 sm:mb-6 p-3 rounded-lg animate-fade-in"
                            style={{
                                backgroundColor: solarTheme.success[50],
                               
                            }}
                        >
                            <div className="flex items-start">
                                <CheckCircle
                                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 mt-0.5 flex-shrink-0"
                                    style={{ color: solarTheme.success[600] }}
                                />
                                <p className="text-xs sm:text-sm" style={{ color: solarTheme.success[600] }}>
                                    Verification code sent successfully! Check your inbox and spam folder.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Auth Error Message */}
                    {authError && (
                        <div
                            className="mb-4 sm:mb-6 p-3 rounded-lg animate-fade-in"
                            style={{
                                backgroundColor: solarTheme.error[50],
                               
                            }}
                        >
                            <div className="flex items-start">
                                <AlertCircle
                                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 mt-0.5 flex-shrink-0"
                                    style={{ color: solarTheme.error[600] }}
                                />
                                <span className="text-xs sm:text-sm" style={{ color: solarTheme.error[600] }}>
                                    {authError}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Email Display */}
                    <div className="text-center mb-4 sm:mb-6">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 px-2">
                            {currentlyShowOTP ? 'Enter the 6-digit code sent to:' : 'We\'ll send a verification code to:'}
                        </p>
                        <p className="text-sm sm:text-base font-medium break-all px-2" style={{ color: solarTheme.primary[700] }}>
                            {maskEmail(user.email)}
                        </p>
                    </div>

                    {/* Conditional OTP Input or Send Button */}
                    {currentlyShowOTP ? (
                        <>
                            {/* OTP Input - 6 digits */}
                            <div className="mb-4 sm:mb-6">
                                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-2 sm:mb-3 text-center">
                                    Enter 6-Digit Verification Code
                                </label>

                                {/* Responsive OTP Input Grid */}
                                <div className="flex justify-center items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
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
                                                w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12
                                                text-center text-sm sm:text-lg md:text-xl font-semibold 
                                                border rounded-lg focus:ring-2 outline-none transition-colors bg-white 
                                                touch-manipulation
                                                ${otpError && touched
                                                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                                    : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
                                                }
                                            `}
                                            disabled={isLoading}
                                        />
                                    ))}
                                </div>

                                {/* OTP Error Display */}
                                {otpError && touched && (
                                    <div className="mt-2 flex items-center justify-center animate-fade-in">
                                        <span className="text-xs sm:text-sm leading-5 text-center" style={{ color: solarTheme.error[600] }}>
                                            {otpError}
                                        </span>
                                    </div>
                                )}

                                {/* OTP Requirements Display */}
                                {otp.join('') && (
                                    <div className="mt-2 sm:mt-3">
                                        <div className="space-y-1">
                                            {otpRequirements.map((req, index) => (
                                                <div key={index} className="flex items-center justify-center text-xs">
                                                    {req.met ? (
                                                        <Check className="h-3 w-3 mr-1.5 flex-shrink-0" style={{ color: solarTheme.success[600] }} />
                                                    ) : (
                                                        <div className="h-3 w-3 mr-1.5 flex-shrink-0 rounded-full border" style={{ borderColor: solarTheme.error[500] }}></div>
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
                                <div className="mt-2 text-center">
                                    <p className="text-xs text-gray-500">
                                        Tip: You can paste with Ctrl+V
                                    </p>
                                </div>
                            </div>

                            {/* Auto-send notification */}
                            {resendCooldown > 50 && (
                                <div className="mb-4 sm:mb-6 p-2.5 sm:p-3 rounded-lg" style={{ backgroundColor: solarTheme.primary[50] }}>
                                    <div className="flex items-center justify-center">
                                        <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" style={{ color: solarTheme.primary[600] }} />
                                        <p className="text-xs sm:text-sm" style={{ color: solarTheme.primary[700] }}>
                                            Verification code sent to your email
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Resend Section */}
                            <div className="text-center mb-4 sm:mb-6">
                                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                                    Didn&apos;t receive the code?
                                </p>
                                {resendCooldown > 0 ? (
                                    <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm" style={{ color: solarTheme.primary[600] }}>
                                        <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        <span>Resend in {resendCooldown}s</span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleResendVerification}
                                        disabled={isLoading}
                                        className="inline-flex items-center px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                                        style={{
                                            backgroundColor: solarTheme.primary[50],
                                            color: solarTheme.primary[700],
                                            border: `1px solid ${solarTheme.primary[200]}`
                                        }}
                                    >
                                        {isLoading ? (
                                            <>
                                                <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                                                Resend Code
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleVerifyOTP}
                                    disabled={isLoading || !isFormValid}
                                    className="w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl text-sm sm:text-base font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg touch-manipulation min-h-[44px]"
                                    style={{
                                        background: `linear-gradient(135deg, ${solarTheme.primary[600]} 0%, ${solarTheme.primary[500]} 100%)`,
                                        boxShadow: `0 4px 8px ${solarTheme.primary[600]}40`
                                    }}
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            Verify Email
                                            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={onClose}
                                    className="w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 touch-manipulation min-h-[44px]"
                                    style={{
                                        backgroundColor: solarTheme.neutral[100],
                                        color: solarTheme.neutral[700]
                                    }}
                                >
                                    Maybe Later
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Send Code Section */}
                            <div className="text-center mb-4 sm:mb-6">
                                <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 px-2">
                                    Click the button below to send a 6-digit verification code to your email address.
                                </p>
                                <button
                                    onClick={handleSendVerificationCode}
                                    disabled={isLoading || resendCooldown > 0}
                                    className="w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl text-sm sm:text-base font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg touch-manipulation min-h-[44px]"
                                    style={{
                                        background: `linear-gradient(135deg, ${solarTheme.primary[600]} 0%, ${solarTheme.primary[500]} 100%)`,
                                        boxShadow: `0 4px 8px ${solarTheme.primary[600]}40`
                                    }}
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                                    ) : resendCooldown > 0 ? (
                                        <>
                                            <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                            Resend in {resendCooldown}s
                                        </>
                                    ) : (
                                        <>
                                            Send Verification Code
                                            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                                        </>
                                    )}
                                </button>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 touch-manipulation min-h-[44px]"
                                style={{
                                    backgroundColor: solarTheme.neutral[100],
                                    color: solarTheme.neutral[700]
                                }}
                            >
                                Maybe Later
                            </button>
                        </>
                    )}

                    {/* Help Section */}
                    {/* <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg" style={{ backgroundColor: solarTheme.primary[50] }}>
                        <div className="flex items-start space-x-2 sm:space-x-3">
                            <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0" style={{ color: solarTheme.primary[600] }} />
                            <div>
                                <p className="text-xs sm:text-sm font-medium" style={{ color: solarTheme.primary[800] }}>
                                    Why verify your email?
                                </p>
                                <p className="text-xs sm:text-sm mt-1" style={{ color: solarTheme.primary[700] }}>
                                    Email verification helps secure your account and enables access to all features including orders and premium support.
                                </p>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
}