/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Lock,
    Eye,
    EyeOff,
    Sun,
    ArrowRight,
    Shield,
    CheckCircle,
    ChevronDown,
    AlertCircle,
    Zap,
    ArrowLeft,
    Check,
    X,
} from 'lucide-react';

import { solarTheme } from '@/theme/theme';
import { glassStyles, cn } from '@/lib/theme-utils';
import { useAuth } from '@/hooks/useAuth';
import type { ResetPasswordRequest } from '@/types/authTypes';

interface NewPasswordFormData {
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    password: string;
    confirmPassword: string;
    general: string;
}

interface FormTouched {
    password: boolean;
    confirmPassword: boolean;
}

interface PasswordStrength {
    score: number;
    label: string;
    color: string;
    bgColor: string;
}

export default function NewPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const {
        resetPassword,
        isLoading,
        error: authError,
        clearError
    } = useAuth();

    const [token, setToken] = useState<string>('');
    const [tokenValid, setTokenValid] = useState<boolean>(true);

    const [formData, setFormData] = useState<NewPasswordFormData>({
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState<FormErrors>({
        password: '',
        confirmPassword: '',
        general: ''
    });

    const [touched, setTouched] = useState<FormTouched>({
        password: false,
        confirmPassword: false
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [showBenefits, setShowBenefits] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');

    // Get token from URL params
    useEffect(() => {
        const tokenParam = searchParams?.get('token');

        if (tokenParam) {
            setToken(decodeURIComponent(tokenParam));
            // Basic token validation (check if it looks like a JWT)
            const tokenParts = tokenParam.split('.');
            if (tokenParts.length !== 3) {
                setTokenValid(false);
                setErrors(prev => ({
                    ...prev,
                    general: 'Invalid reset link. Please request a new password reset.'
                }));
            }
        } else {
            // No token - redirect to forgot password
            router.push('/forgot-password?message=Invalid reset link. Please request a new password reset.');
        }
    }, [searchParams, router]);

    // Clear auth errors when component mounts or form changes
    useEffect(() => {
        if (authError) {
            clearError();
        }
    }, [authError, clearError]);

    // Handle Redux auth errors
    useEffect(() => {
        if (authError) {
            setErrors(prev => ({
                ...prev,
                general: authError
            }));
        }
    }, [authError]);

    // Password strength calculation
    const calculatePasswordStrength = (password: string): PasswordStrength => {
        let score = 0;

        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

        const strengthLevels = [
            { score: 0, label: 'Very Weak', color: solarTheme.error[600], bgColor: solarTheme.error[100] },
            { score: 1, label: 'Weak', color: solarTheme.error[500], bgColor: solarTheme.error[100] },
            { score: 2, label: 'Fair', color: solarTheme.warning[500], bgColor: solarTheme.warning[100] },
            { score: 3, label: 'Good', color: solarTheme.primary[500], bgColor: solarTheme.primary[100] },
            { score: 4, label: 'Strong', color: solarTheme.success[600], bgColor: solarTheme.success[100] },
            { score: 5, label: 'Very Strong', color: solarTheme.success[700], bgColor: solarTheme.success[100] },
        ];

        return strengthLevels[Math.min(score, 5)];
    };

    // Password requirements check
    const getPasswordRequirements = (password: string) => {
        return [
            {
                text: 'At least 8 characters',
                met: password.length >= 8
            },
            {
                text: 'Upper & lowercase letters',
                met: /[a-z]/.test(password) && /[A-Z]/.test(password)
            },
            {
                text: 'At least one number',
                met: /\d/.test(password)
            },
            {
                text: 'At least one special character',
                met: /[!@#$%^&*(),.?":{}|<>]/.test(password)
            }
        ];
    };

    // Validation functions
    const validatePassword = (password: string): string => {
        if (!password) {
            return 'Password is required';
        }

        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }

        if (password.length > 128) {
            return 'Password is too long (maximum 128 characters)';
        }

        const requirements = getPasswordRequirements(password);
        const unmetRequirements = requirements.filter(req => !req.met);

        if (unmetRequirements.length > 2) {
            return 'Password is too weak. Please meet more requirements.';
        }

        return '';
    };

    const validateConfirmPassword = (confirmPassword: string, password: string): string => {
        if (!confirmPassword) {
            return 'Please confirm your password';
        }

        if (confirmPassword !== password) {
            return 'Passwords do not match';
        }

        return '';
    };

    // Validate individual field
    const validateField = (field: keyof NewPasswordFormData, value: string): void => {
        let error = '';

        switch (field) {
            case 'password':
                error = validatePassword(value);
                break;
            case 'confirmPassword':
                error = validateConfirmPassword(value, formData.password);
                break;
        }

        setErrors(prev => ({
            ...prev,
            [field]: error,
            general: ''
        }));
    };

    const handleInputChange = (field: keyof NewPasswordFormData, value: string): void => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Validate field in real-time if it's been touched
        if (touched[field]) {
            validateField(field, value);
        }

        // Also revalidate confirm password if password changes
        if (field === 'password' && touched.confirmPassword) {
            const confirmError = validateConfirmPassword(formData.confirmPassword, value);
            setErrors(prev => ({
                ...prev,
                confirmPassword: confirmError
            }));
        }

        // Clear general error when user starts typing
        if (errors.general) {
            setErrors(prev => ({
                ...prev,
                general: ''
            }));
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
        if (field === 'password') {
            validateField('password', formData.password);
        } else if (field === 'confirmPassword') {
            validateField('confirmPassword', formData.confirmPassword);
        }
    };

    const isFormValid = (): boolean => {
        const passwordError = validatePassword(formData.password);
        const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);
        return !passwordError && !confirmPasswordError && tokenValid;
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        // Ensure we have a valid token
        if (!token || !tokenValid) {
            setErrors(prev => ({
                ...prev,
                general: 'Invalid reset link. Please request a new password reset.'
            }));
            return;
        }

        // Mark all fields as touched
        setTouched({
            password: true,
            confirmPassword: true
        });

        // Validate all fields
        const passwordError = validatePassword(formData.password);
        const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);

        setErrors({
            password: passwordError,
            confirmPassword: confirmPasswordError,
            general: ''
        });

        // If there are validation errors, don't submit
        if (passwordError || confirmPasswordError) {
            return;
        }

        try {
            // Clear any previous errors
            clearError();
            setErrors({ password: '', confirmPassword: '', general: '' });

            // Prepare request data with token
            const resetData: ResetPasswordRequest = {
                token: token,
                newPassword: formData.password
            };

            // Call Redux resetPassword action
            await resetPassword(resetData);

            // Success - show success message and redirect
            setSuccessMessage('Password updated successfully!');

            // Redirect to login with success message after 2 seconds
            setTimeout(() => {
                router.push('/login?message=Password reset successfully! Please sign in with your new password.');
            }, 2000);

        } catch (error: any) {
            // Error is already handled by Redux and will appear in authError
            console.error('Password reset failed:', error);

            // Check if it's a token-related error
            if (error?.message?.includes('token') || error?.message?.includes('expired') || error?.message?.includes('invalid')) {
                setTokenValid(false);
                setErrors(prev => ({
                    ...prev,
                    general: 'Reset link has expired or is invalid. Please request a new password reset.'
                }));
            }
        }
    };

    const benefits = [
        { icon: <Shield className="h-4 w-4" />, text: "Secure Password" },
        { icon: <Lock className="h-4 w-4" />, text: "Encrypted Storage" },
        { icon: <CheckCircle className="h-4 w-4" />, text: "Strength Meter" },
        { icon: <Sun className="h-4 w-4" />, text: "Account Protected" }
    ];

    const passwordStrength = calculatePasswordStrength(formData.password);
    const passwordRequirements = getPasswordRequirements(formData.password);

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

    // Show invalid token message
    if (!tokenValid) {
        return (
            <div className="min-h-screen bg-solar flex items-center justify-center p-4">
                <div className="w-full max-w-md mx-auto">
                    <div className="card-solar text-center">
                        <div className="mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                                style={{ backgroundColor: solarTheme.error[100] }}>
                                <AlertCircle className="h-8 w-8" style={{ color: solarTheme.error[600] }} />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h1>
                            <p className="text-gray-600">This password reset link is invalid or has expired.</p>
                        </div>

                        <div className="space-y-3">
                            <Link
                                href="/forgot-password"
                                className="w-full btn-solar py-4 px-6 rounded-xl text-base flex items-center justify-center transition-all duration-200"
                            >
                                Request New Reset Link
                                <ArrowRight className="h-5 w-5 ml-2" />
                            </Link>
                            <Link
                                href="/login"
                                className="w-full py-3 px-6 rounded-xl text-base font-medium transition-all duration-300"
                                style={{
                                    backgroundColor: solarTheme.neutral[100],
                                    color: solarTheme.neutral[700]
                                }}
                            >
                                Back to Sign In
                            </Link>
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
                            New Password
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Create a strong password for your account
                        </p>
                    </div>

                    {/* Collapsible Benefits */}
                    <button
                        onClick={() => setShowBenefits(!showBenefits)}
                        className="w-full mt-4 flex items-center justify-center text-sm transition-colors"
                        style={{ color: solarTheme.primary[600] }}
                    >
                        <span>Password security features</span>
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

                        {/* General Error Message */}
                        {errors.general && (
                            <div className="mb-4 p-3 rounded-lg animate-fade-in"
                                style={{ backgroundColor: solarTheme.error[50], borderColor: solarTheme.error[200], border: '1px solid' }}>
                                <div className="flex items-start">
                                    <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: solarTheme.error[600] }} />
                                    <span className="text-sm" style={{ color: solarTheme.error[600] }}>{errors.general}</span>
                                </div>
                            </div>
                        )}

                        {/* Password Form */}
                        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                            {/* Password Field */}
                            <div className="animate-slide-up">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        onBlur={() => handleInputBlur('password')}
                                        className={getInputClasses('password', "w-full pl-10 pr-14 py-3.5 border rounded-xl focus:ring-2 outline-none transition-colors bg-white placeholder:text-gray-400 text-base")}
                                        placeholder="Enter your new password"
                                        disabled={isLoading}
                                        autoComplete="new-password"
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

                                {/* Password Strength Indicator */}
                                {formData.password && (
                                    <div className="mt-2">
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-gray-600">Password Strength:</span>
                                            <span style={{ color: passwordStrength.color }} className="font-medium">
                                                {passwordStrength.label}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className="h-1.5 rounded-full transition-all duration-300"
                                                style={{
                                                    backgroundColor: passwordStrength.color,
                                                    width: `${(passwordStrength.score / 5) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                <FieldError error={touched.password ? errors.password : ''} />
                            </div>

                            {/* Password Requirements */}
                            {formData.password && (
                                <div className="animate-slide-up">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                                    <div className="space-y-1">
                                        {passwordRequirements.map((req, index) => (
                                            <div key={index} className="flex items-center text-xs">
                                                {req.met ? (
                                                    <Check className="h-3 w-3 mr-2 flex-shrink-0" style={{ color: solarTheme.success[600] }} />
                                                ) : (
                                                    <X className="h-3 w-3 mr-2 flex-shrink-0" style={{ color: solarTheme.error[500] }} />
                                                )}
                                                <span style={{ color: req.met ? solarTheme.success[600] : solarTheme.error[600] }}>
                                                    {req.text}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Confirm Password Field */}
                            <div className="animate-slide-up">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        onBlur={() => handleInputBlur('confirmPassword')}
                                        className={getInputClasses('confirmPassword', "w-full pl-10 pr-14 py-3.5 border rounded-xl focus:ring-2 outline-none transition-colors bg-white placeholder:text-gray-400 text-base")}
                                        placeholder="Confirm your new password"
                                        disabled={isLoading}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 p-1 hover-scale"
                                        disabled={isLoading}
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                                    </button>
                                </div>
                                <FieldError error={touched.confirmPassword ? errors.confirmPassword : ''} />
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
                                        Update Password
                                        <ArrowRight className="h-5 w-5 ml-2" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Back Link */}
                        <Link
                            href="/forgot-password"
                            className="flex items-center justify-center text-sm m-4 transition-colors hover:opacity-80"
                            style={{ color: solarTheme.primary[600] }}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Forgot Password
                        </Link>

                        {/* Security Badge */}
                        <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
                            <CheckCircle className="h-4 w-4 mr-2" style={{ color: solarTheme.primary[500] }} />
                            Your password is encrypted and secure
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
                                    Create New Password
                                    <span className="block text-gradient-solar">
                                        Strong & Secure
                                    </span>
                                </h1>
                                <p className="text-lg text-gray-600 max-w-lg">
                                    Choose a strong password to protect your account. We&apos;ll help you create
                                    one that meets our security requirements.
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
                                            Secure Encryption
                                        </span>
                                    </div>
                                </div>

                                <div className={cn("rounded-xl p-4 hover-lift animate-fade-in", glassStyles.light)}>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: solarTheme.secondary[100] }}>
                                            <CheckCircle className="h-5 w-5" style={{ color: solarTheme.secondary[600] }} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            Strength Meter
                                        </span>
                                    </div>
                                </div>

                                <div className={cn("rounded-xl p-4 hover-lift animate-fade-in", glassStyles.light)}>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: solarTheme.primary[100] }}>
                                            <Lock className="h-5 w-5" style={{ color: solarTheme.primary[600] }} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            Account Protection
                                        </span>
                                    </div>
                                </div>

                                <div className={cn("rounded-xl p-4 hover-lift animate-fade-in", glassStyles.light)}>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: solarTheme.accent[100] }}>
                                            <Zap className="h-5 w-5" style={{ color: solarTheme.accent[600] }} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            Instant Validation
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Security Info */}
                            <div className={cn("rounded-2xl p-6 animate-fade-in", glassStyles.medium)}>
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Password Security Tips</h3>
                                    <p className="text-sm text-gray-600">
                                        Use a combination of uppercase and lowercase letters, numbers, and special characters.
                                        Avoid using personal information or common words.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Password Form */}
                        <div className="w-full max-w-md mx-auto">
                            <div className="card-solar animate-slide-up">
                                {/* Form Header */}
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">New Password</h2>
                                    <p className="text-gray-600">Create a strong password for your account</p>
                                </div>

                                {/* Success Message */}
                                {successMessage && (
                                    <div className="mb-6 p-3 rounded-lg animate-fade-in"
                                        style={{ backgroundColor: solarTheme.success[50], borderColor: solarTheme.success[200], border: '1px solid' }}>
                                        <div className="flex items-start">
                                            <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: solarTheme.success[600] }} />
                                            <p className="text-sm" style={{ color: solarTheme.success[600] }}>{successMessage}</p>
                                        </div>
                                    </div>
                                )}

                                {/* General Error Message */}
                                {errors.general && (
                                    <div className="mb-6 p-3 rounded-lg animate-fade-in"
                                        style={{ backgroundColor: solarTheme.error[50], borderColor: solarTheme.error[200], border: '1px solid' }}>
                                        <div className="flex items-start">
                                            <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: solarTheme.error[600] }} />
                                            <span className="text-sm" style={{ color: solarTheme.error[600] }}>{errors.general}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Password Form */}
                                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                                    {/* Password Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={formData.password}
                                                onChange={(e) => handleInputChange('password', e.target.value)}
                                                onBlur={() => handleInputBlur('password')}
                                                className={getInputClasses('password', "w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors bg-white placeholder:text-gray-400")}
                                                placeholder="Enter your new password"
                                                disabled={isLoading}
                                                autoComplete="new-password"
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

                                        {/* Password Strength Indicator */}
                                        {formData.password && (
                                            <div className="mt-3">
                                                <div className="flex items-center justify-between text-sm mb-2">
                                                    <span className="text-gray-600">Password Strength:</span>
                                                    <span style={{ color: passwordStrength.color }} className="font-medium">
                                                        {passwordStrength.label}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="h-2 rounded-full transition-all duration-300"
                                                        style={{
                                                            backgroundColor: passwordStrength.color,
                                                            width: `${(passwordStrength.score / 5) * 100}%`
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}

                                        <FieldError error={touched.password ? errors.password : ''} />
                                    </div>

                                    {/* Password Requirements */}
                                    {formData.password && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-3">Password Requirements:</p>
                                            <div className="space-y-2">
                                                {passwordRequirements.map((req, index) => (
                                                    <div key={index} className="flex items-center text-sm">
                                                        {req.met ? (
                                                            <Check className="h-4 w-4 mr-3 flex-shrink-0" style={{ color: solarTheme.success[600] }} />
                                                        ) : (
                                                            <X className="h-4 w-4 mr-3 flex-shrink-0" style={{ color: solarTheme.error[500] }} />
                                                        )}
                                                        <span style={{ color: req.met ? solarTheme.success[600] : solarTheme.error[600] }}>
                                                            {req.text}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Confirm Password Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={formData.confirmPassword}
                                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                                onBlur={() => handleInputBlur('confirmPassword')}
                                                className={getInputClasses('confirmPassword', "w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors bg-white placeholder:text-gray-400")}
                                                placeholder="Confirm your new password"
                                                disabled={isLoading}
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 hover-scale"
                                                disabled={isLoading}
                                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                            >
                                                {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        <FieldError error={touched.confirmPassword ? errors.confirmPassword : ''} />
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
                                                Update Password
                                                <ArrowRight className="h-5 w-5 ml-2" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* Back Link */}
                                <Link
                                    href="/forgot-password"
                                    className="flex items-center justify-center text-sm mt-6 transition-colors hover:opacity-80"
                                    style={{ color: solarTheme.primary[600] }}
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Forgot Password
                                </Link>

                                {/* Security Badge */}
                                <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
                                    <CheckCircle className="h-4 w-4 mr-2" style={{ color: solarTheme.primary[500] }} />
                                    Password encrypted with industry-standard security
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