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
    User,
    Check,
    X,
} from 'lucide-react';

import { solarTheme } from '@/theme/theme';
import { glassStyles, cn } from '@/lib/theme-utils';
import { useAuth } from '@/hooks/useAuth';
import EmailVerificationModal from '@/components/ui/EmailVerificationModal';
import type { RegisterRequest } from '@/types/authTypes';

interface SignUpFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
}

interface FormErrors {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: string;
}

interface FormTouched {
    firstName: boolean;
    lastName: boolean;
    email: boolean;
    password: boolean;
    confirmPassword: boolean;
    agreeToTerms: boolean;
}

interface PasswordStrength {
    score: number;
    label: string;
    color: string;
}

export default function SignUpPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Use the auth hook
    const {
        register,
        isLoading,
        error: authError,
        clearError,
        isAuthenticated,
        isInitialized
    } = useAuth();

    const [formData, setFormData] = useState<SignUpFormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });

    const [errors, setErrors] = useState<FormErrors>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: '',
    });

    const [touched, setTouched] = useState<FormTouched>({
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        confirmPassword: false,
        agreeToTerms: false,
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [showBenefits, setShowBenefits] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');

    // Email verification modal state
    const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);

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
    const validateFirstName = (firstName: string): string => {
        if (!firstName.trim()) return 'First name is required';
        if (firstName.trim().length < 2) return 'First name must be at least 2 characters';
        if (firstName.trim().length > 50) return 'First name must be less than 50 characters';
        if (!/^[a-zA-Z\s'-]+$/.test(firstName.trim()))
            return 'First name can only contain letters, spaces, hyphens, and apostrophes';
        return '';
    };

    const validateLastName = (lastName: string): string => {
        if (!lastName.trim()) return 'Last name is required';
        if (lastName.trim().length < 2) return 'Last name must be at least 2 characters';
        if (lastName.trim().length > 50) return 'Last name must be less than 50 characters';
        if (!/^[a-zA-Z\s'-]+$/.test(lastName.trim()))
            return 'Last name can only contain letters, spaces, hyphens, and apostrophes';
        return '';
    };

    const validateEmail = (email: string): string => {
        if (!email.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) return 'Please enter a valid email address';
        if (email.trim().length > 254) return 'Email address is too long';
        return '';
    };

    const validatePassword = (password: string): string => {
        if (!password) return 'Password is required';
        if (password.length < 8) return 'Password must be at least 8 characters';
        if (password.length > 128) return 'Password must be less than 128 characters';
        if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
        if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
        if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
        if (!/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(password))
            return 'Password must contain at least one special character';
        return '';
    };

    const validateConfirmPassword = (confirmPassword: string, password: string): string => {
        if (!confirmPassword) return 'Please confirm your password';
        if (confirmPassword !== password) return 'Passwords do not match';
        return '';
    };

    const validateTerms = (agreeToTerms: boolean): string => {
        if (!agreeToTerms) return 'You must agree to the terms and conditions';
        return '';
    };

    // Password strength calculation
    const getPasswordStrength = (password: string): PasswordStrength => {
        let score = 0;
        if (password.length >= 8) score += 1;
        if (/(?=.*[a-z])/.test(password)) score += 1;
        if (/(?=.*[A-Z])/.test(password)) score += 1;
        if (/(?=.*\d)/.test(password)) score += 1;
        if (/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(password)) score += 1;

        const strengthMap: Record<number, { label: string; color: string }> = {
            0: { label: 'Very Weak', color: solarTheme.error[500] },
            1: { label: 'Weak', color: solarTheme.error[500] },
            2: { label: 'Fair', color: solarTheme.warning[500] },
            3: { label: 'Good', color: solarTheme.warning[500] },
            4: { label: 'Strong', color: solarTheme.success[500] },
            5: { label: 'Very Strong', color: solarTheme.success[600] },
        };

        return { score, ...strengthMap[score] };
    };

    // Get password requirements
    const getPasswordRequirements = (password: string) => {
        return [
            {
                text: 'At least 8 characters',
                met: password.length >= 8
            },
            {
                text: 'Upper & lowercase letters',
                met: /(?=.*[a-z])/.test(password) && /(?=.*[A-Z])/.test(password)
            },
            {
                text: 'At least one number',
                met: /(?=.*\d)/.test(password)
            },
            {
                text: 'At least one special character',
                met: /(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(password)
            }
        ];
    };

    // Handle input changes
    const handleInputChange = (field: keyof SignUpFormData, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        // Clear field error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }

        // Clear auth error when user starts typing
        if (authError) {
            clearError();
        }
    };

    // Handle input blur for validation
    const handleInputBlur = (field: keyof FormTouched) => {
        setTouched((prev) => ({ ...prev, [field]: true }));

        // Validate field on blur
        let error = '';
        switch (field) {
            case 'firstName':
                error = validateFirstName(formData.firstName);
                break;
            case 'lastName':
                error = validateLastName(formData.lastName);
                break;
            case 'email':
                error = validateEmail(formData.email);
                break;
            case 'password':
                error = validatePassword(formData.password);
                break;
            case 'confirmPassword':
                error = validateConfirmPassword(formData.confirmPassword, formData.password);
                break;
            case 'agreeToTerms':
                error = validateTerms(formData.agreeToTerms);
                break;
        }

        setErrors((prev) => ({ ...prev, [field]: error }));
    };

    // Validate entire form
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {
            firstName: validateFirstName(formData.firstName),
            lastName: validateLastName(formData.lastName),
            email: validateEmail(formData.email),
            password: validatePassword(formData.password),
            confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password),
            agreeToTerms: validateTerms(formData.agreeToTerms),
        };

        setErrors(newErrors);
        setTouched({
            firstName: true,
            lastName: true,
            email: true,
            password: true,
            confirmPassword: true,
            agreeToTerms: true,
        });

        return !Object.values(newErrors).some((error) => error !== '');
    };

    // Check if form is valid
    const isFormValid = (): boolean => {
        const firstNameError = validateFirstName(formData.firstName);
        const lastNameError = validateLastName(formData.lastName);
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);
        const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);
        const termsError = validateTerms(formData.agreeToTerms);

        return !firstNameError && !lastNameError && !emailError && !passwordError && !confirmPasswordError && !termsError;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const registerData: RegisterRequest = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                password: formData.password
            };

            const result = await register(registerData);

            // If registration succeeds, redirect to verify-email page
            if (result) {
                setSuccessMessage('Account created successfully! Please verify your email to continue.');
                // Navigate to verify-email page with email parameter
                router.push(`/verify-email?email=${encodeURIComponent(formData.email.trim())}`);
            }

        } catch (error) {
            // Error is handled by the Redux store and will appear in authError
            console.error('Registration failed:', error);
        }
    };

    // Handle email verification completion
    const handleEmailVerified = () => {
        setShowVerificationModal(false);
        setSuccessMessage('Email verified successfully! Welcome to General Energy Solutions!');

        // Redirect to dashboard or redirect URL after a short delay
        setTimeout(() => {
            const redirect = searchParams?.get('redirect') || '/';
            router.push(redirect);
        }, 2000);
    };

    // Handle modal close (skip verification)
    const handleModalClose = () => {
        setShowVerificationModal(false);
        // Redirect to verify-email page instead of a non-existent route
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    };

    // Get password strength for display
    const passwordStrength = getPasswordStrength(formData.password);
    const passwordRequirements = getPasswordRequirements(formData.password);

    // Benefits data
    const benefits = [
        { icon: <Shield className="h-4 w-4" />, text: "Secure Platform" },
        { icon: <Users className="h-4 w-4" />, text: "Expert Support" },
        { icon: <Star className="h-4 w-4" />, text: "4.9★ Rating" },
        { icon: <Sun className="h-4 w-4" />, text: "Clean Energy" },
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
        <>
            <div className="min-h-screen bg-solar">
                {/* Mobile-First Layout */}
                <div className="lg:hidden">
                    {/* Mobile Header */}
                    <div className={cn("px-4 py-6", glassStyles.medium)}>
                        <div className="text-center">
                            <div
                                className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3"
                                style={{
                                    background: `linear-gradient(to right, ${solarTheme.primary[500]}, ${solarTheme.primary[600]})`,
                                }}
                            >
                                <Sun className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Join General Energy Solutions</h1>
                            <p className="text-sm text-gray-600 mt-1">Create your account and start your clean energy journey</p>
                        </div>

                        {/* Collapsible Benefits */}
                        <button
                            onClick={() => setShowBenefits(!showBenefits)}
                            className="w-full mt-4 flex items-center justify-center text-sm transition-colors"
                            style={{ color: solarTheme.primary[600] }}
                        >
                            <span>Why choose General Energy Solutions?</span>
                            <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showBenefits ? "rotate-180" : ""}`} />
                        </button>

                        {showBenefits && (
                            <div className="mt-3 grid grid-cols-2 gap-2 animate-slide-up">
                                {benefits.map((benefit, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-2 rounded-lg p-2"
                                        style={{ backgroundColor: solarTheme.primary[50] }}
                                    >
                                        <div style={{ color: solarTheme.primary[600] }}>{benefit.icon}</div>
                                        <span className="text-xs font-medium text-gray-700">{benefit.text}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Mobile Sign Up Form */}
                    <div className="p-4">
                        <div className="card-solar">
                            {/* Success Message */}
                            {successMessage && !showVerificationModal && (
                                <div
                                    className="mb-4 p-3 rounded-lg animate-fade-in"
                                    style={{
                                        backgroundColor: solarTheme.success[50],
                                        borderColor: solarTheme.success[200],
                                        border: "1px solid",
                                    }}
                                >
                                    <div className="flex items-start">
                                        <CheckCircle
                                            className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0"
                                            style={{ color: solarTheme.success[600] }}
                                        />
                                        <p className="text-sm" style={{ color: solarTheme.success[600] }}>
                                            {successMessage}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Auth Error Message */}
                            {authError && (
                                <div
                                    className="mb-4 p-3 rounded-lg animate-fade-in"
                                    style={{
                                        backgroundColor: solarTheme.error[50],
                                        borderColor: solarTheme.error[200],
                                        border: "1px solid",
                                    }}
                                >
                                    <div className="flex items-start">
                                        <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: solarTheme.error[600] }} />
                                        <span className="text-sm" style={{ color: solarTheme.error[600] }}>
                                            {authError}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Sign Up Form */}
                            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                                {/* Name Fields Row */}
                                <div className="grid grid-cols-2 gap-3 animate-slide-up">
                                    {/* First Name Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                                onBlur={() => handleInputBlur("firstName")}
                                                className={getInputClasses(
                                                    "firstName",
                                                    "w-full pl-10 pr-4 py-3.5 border rounded-xl focus:ring-2 outline-none transition-colors bg-white placeholder:text-gray-400 text-base",
                                                )}
                                                placeholder="First name"
                                                disabled={isLoading}
                                                autoComplete="given-name"
                                            />
                                        </div>
                                        <FieldError error={touched.firstName ? errors.firstName : ""} />
                                    </div>

                                    {/* Last Name Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                                onBlur={() => handleInputBlur("lastName")}
                                                className={getInputClasses(
                                                    "lastName",
                                                    "w-full pl-10 pr-4 py-3.5 border rounded-xl focus:ring-2 outline-none transition-colors bg-white placeholder:text-gray-400 text-base",
                                                )}
                                                placeholder="Last name"
                                                disabled={isLoading}
                                                autoComplete="family-name"
                                            />
                                        </div>
                                        <FieldError error={touched.lastName ? errors.lastName : ""} />
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="animate-slide-up">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            onBlur={() => handleInputBlur("email")}
                                            className={getInputClasses(
                                                "email",
                                                "w-full pl-10 pr-14 py-3.5 border rounded-xl focus:ring-2 outline-none transition-colors bg-white placeholder:text-gray-400 text-base",
                                            )}
                                            placeholder="Enter your email"
                                            disabled={isLoading}
                                            autoComplete="email"
                                        />
                                    </div>
                                    <FieldError error={touched.email ? errors.email : ""} />
                                </div>

                                {/* Password Field */}
                                <div className="animate-slide-up">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={(e) => handleInputChange("password", e.target.value)}
                                            onBlur={() => handleInputBlur("password")}
                                            className={getInputClasses(
                                                "password",
                                                "w-full pl-10 pr-14 py-3.5 border rounded-xl focus:ring-2 outline-none transition-colors bg-white placeholder:text-gray-400 text-base",
                                            )}
                                            placeholder="Create a password"
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

                                    <FieldError error={touched.password ? errors.password : ""} />
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                            onBlur={() => handleInputBlur("confirmPassword")}
                                            className={getInputClasses(
                                                "confirmPassword",
                                                "w-full pl-10 pr-14 py-3.5 border rounded-xl focus:ring-2 outline-none transition-colors bg-white placeholder:text-gray-400 text-base",
                                            )}
                                            placeholder="Confirm your password"
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
                                    <FieldError error={touched.confirmPassword ? errors.confirmPassword : ""} />
                                </div>

                                {/* Terms Agreement */}
                                <div className="animate-slide-up">
                                    <div className="flex items-start">
                                        <input
                                            type="checkbox"
                                            id="agree-terms-mobile"
                                            checked={formData.agreeToTerms}
                                            onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                                            onBlur={() => handleInputBlur("agreeToTerms")}
                                            className="h-4 w-4 border-gray-300 rounded mt-1"
                                            style={{ accentColor: solarTheme.primary[500] }}
                                            disabled={isLoading}
                                        />
                                        <label htmlFor="agree-terms-mobile" className="ml-3 text-sm text-gray-700">
                                            I agree to the{" "}
                                            <Link
                                                href="/terms"
                                                className="font-medium transition-colors hover:opacity-80"
                                                style={{ color: solarTheme.primary[600] }}
                                            >
                                                Terms of Service
                                            </Link>{" "}
                                            and{" "}
                                            <Link
                                                href="/privacy"
                                                className="font-medium transition-colors hover:opacity-80"
                                                style={{ color: solarTheme.primary[600] }}
                                            >
                                                Privacy Policy
                                            </Link>
                                        </label>
                                    </div>
                                    <FieldError error={touched.agreeToTerms ? errors.agreeToTerms : ""} />
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
                                            Create Account
                                            <ArrowRight className="h-5 w-5 ml-2" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Sign In Link */}
                            <div className="mt-6 text-center">
                                <p className="text-gray-600">
                                    Already have an account?{" "}
                                    <Link
                                        href="/login"
                                        className="font-medium transition-colors hover:opacity-80"
                                        style={{ color: solarTheme.primary[600] }}
                                    >
                                        Sign In
                                    </Link>
                                </p>
                            </div>

                            {/* Security Badge */}
                            <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
                                <CheckCircle className="h-4 w-4 mr-2" style={{ color: solarTheme.primary[500] }} />
                                Eco-certified secure platform
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute inset-0">
                        <div
                            className="absolute top-20 left-10 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow"
                            style={{ backgroundColor: solarTheme.primary[200] }}
                        ></div>
                        <div
                            className="absolute bottom-20 right-10 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow"
                            style={{ backgroundColor: solarTheme.secondary[200] }}
                        ></div>
                        <div
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-xl opacity-20"
                            style={{ backgroundColor: solarTheme.primary[300] }}
                        ></div>
                    </div>

                    <div className="relative w-full max-w-6xl mx-auto">
                        <div className="grid grid-cols-2 gap-8 items-center">
                            {/* Left Side - Branding & Benefits */}
                            <div className="text-left space-y-8">
                                {/* Logo & Brand */}
                                <div className="animate-fade-in">
                                    <div
                                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 shadow-lg"
                                        style={{
                                            background: `linear-gradient(to right, ${solarTheme.primary[500]}, ${solarTheme.primary[600]})`,
                                        }}
                                    >
                                        <Sun className="h-8 w-8 text-white" />
                                    </div>
                                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                                        Join the Future to
                                        <span className="block text-gradient-solar">General Energy Solutions</span>
                                    </h1>
                                    <p className="text-lg text-gray-600 max-w-lg">
                                        Create your account and start your journey towards sustainable energy solutions. Join thousands of
                                        satisfied customers already saving with solar.
                                    </p>
                                </div>

                                {/* Features Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={cn("rounded-xl p-4 hover-lift animate-fade-in", glassStyles.light)}>
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                                                style={{ backgroundColor: solarTheme.primary[100] }}
                                            >
                                                <Zap className="h-5 w-5" style={{ color: solarTheme.primary[600] }} />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">High Efficiency</span>
                                        </div>
                                    </div>

                                    <div className={cn("rounded-xl p-4 hover-lift animate-fade-in", glassStyles.light)}>
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                                                style={{ backgroundColor: solarTheme.secondary[100] }}
                                            >
                                                <Sun className="h-5 w-5" style={{ color: solarTheme.secondary[600] }} />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">25+ Years Warranty</span>
                                        </div>
                                    </div>

                                    <div className={cn("rounded-xl p-4 hover-lift animate-fade-in", glassStyles.light)}>
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                                                style={{ backgroundColor: solarTheme.primary[100] }}
                                            >
                                                <Leaf className="h-5 w-5" style={{ color: solarTheme.primary[600] }} />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">Eco-Friendly</span>
                                        </div>
                                    </div>

                                    <div className={cn("rounded-xl p-4 hover-lift animate-fade-in", glassStyles.light)}>
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                                                style={{ backgroundColor: solarTheme.accent[100] }}
                                            >
                                                <Battery className="h-5 w-5" style={{ color: solarTheme.accent[600] }} />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">Energy Storage</span>
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

                            {/* Right Side - Sign Up Form */}
                            <div className="w-full max-w-md mx-auto">
                                <div className="card-solar animate-slide-up">
                                    {/* Form Header */}
                                    <div className="text-center mb-8">
                                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                                        <p className="text-gray-600">Join General Energy Solutions today</p>
                                    </div>

                                    {/* Success Message */}
                                    {successMessage && !showVerificationModal && (
                                        <div
                                            className="mb-6 p-3 rounded-lg animate-fade-in"
                                            style={{
                                                backgroundColor: solarTheme.success[50],
                                                borderColor: solarTheme.success[200],
                                                border: "1px solid",
                                            }}
                                        >
                                            <div className="flex items-start">
                                                <CheckCircle
                                                    className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0"
                                                    style={{ color: solarTheme.success[600] }}
                                                />
                                                <p className="text-sm" style={{ color: solarTheme.success[600] }}>
                                                    {successMessage}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Auth Error Message */}
                                    {authError && (
                                        <div
                                            className="mb-6 p-3 rounded-lg animate-fade-in"
                                            style={{
                                                backgroundColor: solarTheme.error[50],
                                                borderColor: solarTheme.error[200],
                                                border: "1px solid",
                                            }}
                                        >
                                            <div className="flex items-start">
                                                <AlertCircle
                                                    className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0"
                                                    style={{ color: solarTheme.error[600] }}
                                                />
                                                <span className="text-sm" style={{ color: solarTheme.error[600] }}>
                                                    {authError}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Desktop Sign Up Form - Similar structure but simplified for brevity */}
                                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                                        {/* Name Fields Row */}
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* First Name Field */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        value={formData.firstName}
                                                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                                                        onBlur={() => handleInputBlur("firstName")}
                                                        className={getInputClasses(
                                                            "firstName",
                                                            "w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors bg-white placeholder:text-gray-400",
                                                        )}
                                                        placeholder="First name"
                                                        disabled={isLoading}
                                                        autoComplete="given-name"
                                                    />
                                                </div>
                                                <FieldError error={touched.firstName ? errors.firstName : ""} />
                                            </div>

                                            {/* Last Name Field */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        value={formData.lastName}
                                                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                                                        onBlur={() => handleInputBlur("lastName")}
                                                        className={getInputClasses(
                                                            "lastName",
                                                            "w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors bg-white placeholder:text-gray-400",
                                                        )}
                                                        placeholder="Last name"
                                                        disabled={isLoading}
                                                        autoComplete="family-name"
                                                    />
                                                </div>
                                                <FieldError error={touched.lastName ? errors.lastName : ""} />
                                            </div>
                                        </div>

                                        {/* Email Field */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                                    onBlur={() => handleInputBlur("email")}
                                                    className={getInputClasses(
                                                        "email",
                                                        "w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors bg-white placeholder:text-gray-400",
                                                    )}
                                                    placeholder="Enter your email"
                                                    disabled={isLoading}
                                                    autoComplete="email"
                                                />
                                            </div>
                                            <FieldError error={touched.email ? errors.email : ""} />
                                        </div>

                                        {/* Password Field */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={formData.password}
                                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                                    onBlur={() => handleInputBlur("password")}
                                                    className={getInputClasses(
                                                        "password",
                                                        "w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors bg-white placeholder:text-gray-400",
                                                    )}
                                                    placeholder="Create a password"
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

                                            <FieldError error={touched.password ? errors.password : ""} />
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
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                                    onBlur={() => handleInputBlur("confirmPassword")}
                                                    className={getInputClasses(
                                                        "confirmPassword",
                                                        "w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors bg-white placeholder:text-gray-400",
                                                    )}
                                                    placeholder="Confirm your password"
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
                                            <FieldError error={touched.confirmPassword ? errors.confirmPassword : ""} />
                                        </div>

                                        {/* Terms Agreement */}
                                        <div>
                                            <div className="flex items-start">
                                                <input
                                                    type="checkbox"
                                                    id="agree-terms-desktop"
                                                    checked={formData.agreeToTerms}
                                                    onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                                                    onBlur={() => handleInputBlur("agreeToTerms")}
                                                    className="h-4 w-4 border-gray-300 rounded focus:ring-2 mt-1"
                                                    style={{ accentColor: solarTheme.primary[500] }}
                                                    disabled={isLoading}
                                                />
                                                <label htmlFor="agree-terms-desktop" className="ml-3 text-sm text-gray-700">
                                                    I agree to the{" "}
                                                    <Link
                                                        href="/terms"
                                                        className="font-medium transition-colors hover:opacity-80"
                                                        style={{ color: solarTheme.primary[600] }}
                                                    >
                                                        Terms of Service
                                                    </Link>{" "}
                                                    and{" "}
                                                    <Link
                                                        href="/privacy"
                                                        className="font-medium transition-colors hover:opacity-80"
                                                        style={{ color: solarTheme.primary[600] }}
                                                    >
                                                        Privacy Policy
                                                    </Link>
                                                </label>
                                            </div>
                                            <FieldError error={touched.agreeToTerms ? errors.agreeToTerms : ""} />
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
                                                    Create Account
                                                    <ArrowRight className="h-5 w-5 ml-2" />
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    {/* Sign In Link */}
                                    <div className="mt-6 text-center">
                                        <p className="text-gray-600">
                                            Already have an account?{" "}
                                            <Link
                                                href="/login"
                                                className="font-medium transition-colors hover:opacity-80"
                                                style={{ color: solarTheme.primary[600] }}
                                            >
                                                Sign In
                                            </Link>
                                        </p>
                                    </div>

                                    {/* Security Badge */}
                                    <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
                                        <CheckCircle className="h-4 w-4 mr-2" style={{ color: solarTheme.primary[500] }} />
                                        Your information is protected with bank-level security
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Email Verification Modal */}
            <EmailVerificationModal
                isOpen={showVerificationModal}
                onClose={handleModalClose}
                onVerified={handleEmailVerified}
                title="Welcome! Verify Your Email"
                message="We've sent a verification code to complete your account setup"
            />
        </>
    );
}