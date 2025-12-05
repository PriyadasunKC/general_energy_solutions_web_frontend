/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AlertCircle, Shield, Mail, ArrowRight, Sun } from 'lucide-react';

import { solarTheme } from '@/theme/theme';
import { glassStyles } from '@/lib/theme-utils';
import { useAuth } from '@/hooks/useAuth';
import EmailVerificationModal from '@/components/ui/EmailVerificationModal';
import { PROTECTED_ROUTES } from '@/types/authTypes';

interface AuthGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    requireEmailVerification?: boolean;
    fallback?: React.ReactNode;
    redirectTo?: string;
}

interface LoadingScreenProps {
    message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = "Loading..." }) => {
    return (
        <div className="min-h-screen flex items-center justify-center" style={{
            background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white, ${solarTheme.secondary[50]})`
        }}>
            <div className="text-center">
                <div className="mb-8 flex justify-center">
                    <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                        style={{
                            background: `linear-gradient(135deg, ${solarTheme.primary[500]}, ${solarTheme.secondary[500]})`
                        }}
                    >
                        <Sun className="h-10 w-10 text-white animate-spin" style={{ animationDuration: '2s' }} />
                    </div>
                </div>
                <h1 className="text-3xl font-bold mb-2" style={{ color: solarTheme.primary[700] }}>
                    General Energy Solutions
                </h1>
                <p className="text-gray-600 mb-8">{message}</p>
                <div className="flex justify-center space-x-2">
                    <div
                        className="w-3 h-3 rounded-full animate-bounce"
                        style={{
                            backgroundColor: solarTheme.primary[500],
                            animationDelay: '0ms'
                        }}
                    ></div>
                    <div
                        className="w-3 h-3 rounded-full animate-bounce"
                        style={{
                            backgroundColor: solarTheme.secondary[500],
                            animationDelay: '150ms'
                        }}
                    ></div>
                    <div
                        className="w-3 h-3 rounded-full animate-bounce"
                        style={{
                            backgroundColor: solarTheme.primary[500],
                            animationDelay: '300ms'
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

interface AccessDeniedScreenProps {
    title: string;
    message: string;
    actionText: string;
    onAction: () => void;
    icon: React.ReactNode;
}

const AccessDeniedScreen: React.FC<AccessDeniedScreenProps> = ({
    title,
    message,
    actionText,
    onAction,
    icon
}) => {
    return (
        <div className="min-h-screen bg-solar flex items-center justify-center p-4">
            <div className="w-full max-w-md mx-auto">
                <div className="card-solar text-center">
                    <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                            style={{ backgroundColor: solarTheme.error[100] }}>
                            {icon}
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
                        <p className="text-gray-600">{message}</p>
                    </div>

                    <button
                        onClick={onAction}
                        className="w-full btn-solar py-4 px-6 rounded-xl text-base flex items-center justify-center transition-all duration-200"
                    >
                        {actionText}
                        <ArrowRight className="h-5 w-5 ml-2" />
                    </button>

                    <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: solarTheme.primary[50] }}>
                        <div className="flex items-start space-x-3">
                            <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: solarTheme.primary[600] }} />
                            <div>
                                <p className="text-sm font-medium" style={{ color: solarTheme.primary[800] }}>
                                    Secure Access Required
                                </p>
                                <p className="text-sm mt-1" style={{ color: solarTheme.primary[700] }}>
                                    This page is protected to ensure the security of your account and data.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface EmailVerificationRequiredScreenProps {
    onVerify: () => void;
    onSkip: () => void;
    email: string;
}

const EmailVerificationRequiredScreen: React.FC<EmailVerificationRequiredScreenProps> = ({
    onVerify,
    onSkip,
    email
}) => {
    const maskEmail = (email: string): string => {
        if (!email) return '';
        const [username, domain] = email.split('@');
        if (!username || !domain) return email;

        const maskedUsername = username.length > 2
            ? username[0] + '*'.repeat(Math.min(username.length - 2, 6)) + username[username.length - 1]
            : username;

        return `${maskedUsername}@${domain}`;
    };

    return (
        <div className="min-h-screen bg-solar flex items-center justify-center p-4">
            <div className="w-full max-w-lg mx-auto">
                <div className="card-solar text-center">
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
                            style={{ backgroundColor: solarTheme.warning[100] }}>
                            <Mail className="h-10 w-10" style={{ color: solarTheme.warning[600] }} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Email Verification Required</h1>
                        <p className="text-gray-600 mb-4">
                            To access this feature, please verify your email address first.
                        </p>
                        <p className="text-sm" style={{ color: solarTheme.primary[700] }}>
                            We'll send a verification code to: <strong>{maskEmail(email)}</strong>
                        </p>
                    </div>

                    {/* Benefits of verification */}
                    <div className="mb-8 p-4 rounded-lg" style={{ backgroundColor: solarTheme.primary[50] }}>
                        <h3 className="text-base font-semibold mb-3" style={{ color: solarTheme.primary[800] }}>
                            Why verify your email?
                        </h3>
                        <div className="text-left space-y-2">
                            <div className="flex items-center space-x-3">
                                <Shield className="h-4 w-4 flex-shrink-0" style={{ color: solarTheme.primary[600] }} />
                                <span className="text-sm" style={{ color: solarTheme.primary[700] }}>
                                    Secure your account from unauthorized access
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Shield className="h-4 w-4 flex-shrink-0" style={{ color: solarTheme.primary[600] }} />
                                <span className="text-sm" style={{ color: solarTheme.primary[700] }}>
                                    Enable order confirmations and updates
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Shield className="h-4 w-4 flex-shrink-0" style={{ color: solarTheme.primary[600] }} />
                                <span className="text-sm" style={{ color: solarTheme.primary[700] }}>
                                    Access premium features and support
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={onVerify}
                            className="w-full btn-solar py-4 px-6 rounded-xl text-base flex items-center justify-center transition-all duration-200"
                        >
                            Verify Email Address
                            <Mail className="h-5 w-5 ml-2" />
                        </button>

                        <button
                            onClick={onSkip}
                            className="w-full py-3 px-6 rounded-xl text-base font-medium transition-all duration-300"
                            style={{
                                backgroundColor: solarTheme.neutral[100],
                                color: solarTheme.neutral[700]
                            }}
                        >
                            Maybe Later
                        </button>
                    </div>

                    <p className="mt-6 text-xs text-gray-500">
                        You can verify your email anytime from your profile settings
                    </p>
                </div>
            </div>
        </div>
    );
};

export const AuthGuard: React.FC<AuthGuardProps> = ({
    children,
    requireAuth = true,
    requireEmailVerification = false,
    fallback = null,
    redirectTo
}) => {
    const {
        isAuthenticated,
        isInitialized,
        user,
        isEmailVerified,
        redirectToLogin
    } = useAuth();

    const router = useRouter();
    const pathname = usePathname();
    const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);

    // Handle null pathname case
    const currentPath = pathname || '/';

    // Determine if current route is protected
    const isProtectedRoute = PROTECTED_ROUTES.some(route => currentPath.startsWith(route));

    useEffect(() => {
        if (!isInitialized) return;

        // For protected routes, require authentication
        if (isProtectedRoute && !isAuthenticated) {
            const message = 'Please sign in to access this page';
            redirectToLogin(message);
            return;
        }

        // For pages that explicitly require auth
        if (requireAuth && !isAuthenticated) {
            const message = 'Authentication required to access this page';
            redirectToLogin(message);
            return;
        }

    }, [isInitialized, isAuthenticated, requireAuth, isProtectedRoute, redirectToLogin]);

    const handleVerifyEmail = () => {
        setShowEmailVerificationModal(true);
    };

    const handleEmailVerified = () => {
        setShowEmailVerificationModal(false);
    };

    const handleSkipVerification = () => {
        router.push('/');
    };

    const handleSignIn = () => {
        redirectToLogin('Please sign in to continue');
    };

    // Show loading while initializing
    if (!isInitialized) {
        return <LoadingScreen message="Initializing application..." />;
    }

    // Show fallback if provided and requirements not met
    if (fallback && ((requireAuth && !isAuthenticated) || (requireEmailVerification && !isEmailVerified()))) {
        return <>{fallback}</>;
    }

    // Handle unauthenticated users
    if (requireAuth && !isAuthenticated) {
        return (
            <AccessDeniedScreen
                title="Sign In Required"
                message="You need to be signed in to access this page."
                actionText="Sign In"
                onAction={handleSignIn}
                icon={<AlertCircle className="h-8 w-8" style={{ color: solarTheme.error[500] }} />}
            />
        );
    }

    // Handle email verification requirement
    if (requireEmailVerification && isAuthenticated && !isEmailVerified()) {
        return (
            <>
                <EmailVerificationRequiredScreen
                    onVerify={handleVerifyEmail}
                    onSkip={handleSkipVerification}
                    email={user?.email || ''}
                />
                <EmailVerificationModal
                    isOpen={showEmailVerificationModal}
                    onClose={() => setShowEmailVerificationModal(false)}
                    onVerified={handleEmailVerified}
                    title="Verify Your Email"
                    message="Enter the verification code sent to your email"
                />
            </>
        );
    }

    // For protected routes, check email verification automatically
    if (isProtectedRoute && isAuthenticated && !isEmailVerified()) {
        return (
            <>
                <EmailVerificationRequiredScreen
                    onVerify={handleVerifyEmail}
                    onSkip={handleSkipVerification}
                    email={user?.email || ''}
                />
                <EmailVerificationModal
                    isOpen={showEmailVerificationModal}
                    onClose={() => setShowEmailVerificationModal(false)}
                    onVerified={handleEmailVerified}
                    title="Complete Account Setup"
                    message="Verify your email to access checkout and orders"
                />
            </>
        );
    }

    // All requirements met, render children
    return <>{children}</>;
};

// Higher-order component for easy page protection
export function withAuthGuard<P extends object>(
    Component: React.ComponentType<P>,
    options: Omit<AuthGuardProps, 'children'> = {}
) {
    return function AuthGuardedComponent(props: P) {
        return (
            <AuthGuard {...options}>
                <Component {...props} />
            </AuthGuard>
        );
    };
}

// Hook for checking auth requirements programmatically
export function useAuthGuard() {
    const {
        isAuthenticated,
        isInitialized,
        isEmailVerified,
        user,
        redirectToLogin
    } = useAuth();

    const pathname = usePathname();
    const currentPath = pathname || '/'; // Handle null pathname
    const isProtectedRoute = PROTECTED_ROUTES.some(route => currentPath.startsWith(route));

    const checkAccess = (requireAuth = true, requireEmailVerification = false) => {
        if (!isInitialized) return { canAccess: false, reason: 'loading' };

        if (requireAuth && !isAuthenticated) {
            return { canAccess: false, reason: 'unauthenticated' };
        }

        if (requireEmailVerification && !isEmailVerified()) {
            return { canAccess: false, reason: 'email-not-verified' };
        }

        return { canAccess: true, reason: null };
    };

    const requireAuthAndRedirect = (message?: string) => {
        if (!isAuthenticated) {
            redirectToLogin(message || 'Please sign in to continue');
            return false;
        }
        return true;
    };

    const requireEmailVerificationAndModal = () => {
        if (!isEmailVerified()) {
            // Return false to indicate verification is needed
            // The calling component should handle showing the modal
            return false;
        }
        return true;
    };

    return {
        isAuthenticated,
        isInitialized,
        isEmailVerified: isEmailVerified(),
        isProtectedRoute,
        user,
        checkAccess,
        requireAuthAndRedirect,
        requireEmailVerificationAndModal,
        redirectToLogin
    };
}

export default AuthGuard;