// src/hooks/useAuth.ts
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { AppDispatch, RootState } from '../store/store';
import {
    initializeAuth,
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    verifyEmailOTP as verifyEmailOTPThunk,
    resendOTP as resendOTPThunk,
    forgotPassword as forgotPasswordThunk,
    resetPassword as resetPasswordThunk,
    checkAuthStatus as checkAuthStatusThunk,
    clearError as clearAuthError,
    updateUserInfo,
    setError,
    selectAuth,
    selectUser,
    selectIsAuthenticated,
    selectIsLoading,
    selectError,
    selectIsInitialized,
    selectAccessToken,
} from '../store/slices/authSlice';
import { AuthService } from '../services/authService';
import {
    UseAuthReturn,
    RegisterRequest,
    RegisterResponse,
    LoginRequest,
    LoginResponse,
    VerifyEmailOTPRequest,
    VerifyEmailOTPResponse,
    ResendOTPRequest,
    ResendOTPResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
    RefreshTokenResponse,
    User,
    UserRole,
    PROTECTED_ROUTES,
} from '../types/authTypes';

/**
 * Custom hook for authentication
 * Provides all auth-related functionality with Redux integration
 */
export const useAuth = (): UseAuthReturn => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const pathname = usePathname();

    // Selectors
    const user = useSelector((state: RootState) => selectUser(state));
    const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));
    const isLoading = useSelector((state: RootState) => selectIsLoading(state));
    const error = useSelector((state: RootState) => selectError(state));
    const isInitialized = useSelector((state: RootState) => selectIsInitialized(state));
    const accessToken = useSelector((state: RootState) => selectAccessToken(state));

    /**
     * Initialize authentication on app start
     */
    const initialize = useCallback(async (): Promise<void> => {
        try {
            await dispatch(initializeAuth()).unwrap();
        } catch (error) {
            console.error('Auth initialization failed:', error);
        }
    }, [dispatch]);

    /**
     * Register new user
     */
    const register = useCallback(async (data: RegisterRequest): Promise<RegisterResponse> => {
        const result = await dispatch(registerUser(data)).unwrap();

        // Start token refresh timer after successful registration
        AuthService.startTokenRefreshTimer();

        // Check for return URL after registration
        const returnUrl = sessionStorage.getItem('returnUrl');
        if (returnUrl) {
            sessionStorage.removeItem('returnUrl');
            router.push(returnUrl);
        }

        return result;
    }, [dispatch, router]);

    /**
     * Login user
     */
    const login = useCallback(async (data: LoginRequest): Promise<LoginResponse> => {
        const result = await dispatch(loginUser(data)).unwrap();

        // Start token refresh timer after successful login
        AuthService.startTokenRefreshTimer();

        // Check for return URL after login
        const returnUrl = sessionStorage.getItem('returnUrl');
        if (returnUrl) {
            sessionStorage.removeItem('returnUrl');
            router.push(returnUrl);
        }

        return result;
    }, [dispatch, router]);

    /**
     * Logout user
     */
    const logout = useCallback(async (): Promise<void> => {
        try {
            await dispatch(logoutUser()).unwrap();
        } finally {
            // Clear any stored return URLs
            sessionStorage.removeItem('returnUrl');
            // Always redirect to home page after logout
            router.push('/');
        }
    }, [dispatch, router]);

    /**
     * Refresh access token
     */
    const refreshToken = useCallback(async (): Promise<RefreshTokenResponse> => {
        try {
            const result = await dispatch(refreshAccessToken()).unwrap();
            return result;
        } catch (error) {
            // If refresh fails, redirect to login
            router.push('/login?message=Session expired. Please sign in again.');
            throw error;
        }
    }, [dispatch, router]);

    /**
     * Verify email OTP
     */
    const verifyEmailOTP = useCallback(async (data: VerifyEmailOTPRequest): Promise<VerifyEmailOTPResponse> => {
        const result = await dispatch(verifyEmailOTPThunk(data)).unwrap();
        return result;
    }, [dispatch]);

    /**
     * Resend OTP
     */
    const resendOTP = useCallback(async (data: ResendOTPRequest): Promise<ResendOTPResponse> => {
        const result = await dispatch(resendOTPThunk(data)).unwrap();
        return result;
    }, [dispatch]);

    /**
     * Forgot password
     */
    const forgotPassword = useCallback(async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
        const result = await dispatch(forgotPasswordThunk(data)).unwrap();
        return result;
    }, [dispatch]);

    /**
     * Reset password
     */
    const resetPassword = useCallback(async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
        const result = await dispatch(resetPasswordThunk(data)).unwrap();
        return result;
    }, [dispatch]);

    /**
     * Check authentication status
     */
    const checkAuthStatus = useCallback(async (): Promise<void> => {
        await dispatch(checkAuthStatusThunk()).unwrap();
    }, [dispatch]);

    /**
     * Clear error state
     */
    const clearError = useCallback((): void => {
        dispatch(clearAuthError());
    }, [dispatch]);

    /**
     * Update user information
     */
    const updateUser = useCallback((updates: Partial<User>): void => {
        dispatch(updateUserInfo(updates));
    }, [dispatch]);

    /**
     * Set error manually
     */
    const setAuthError = useCallback((errorMessage: string): void => {
        dispatch(setError(errorMessage));
    }, [dispatch]);

    /**
     * Check if user has specific role
     */
    const hasRole = useCallback((role: string): boolean => {
        return user?.roles?.includes(role as UserRole) ?? false;
    }, [user]);

    /**
     * Check if user's email is verified
     */
    const isEmailVerified = useCallback((): boolean => {
        return user?.emailVerified ?? false;
    }, [user]);

    /**
     * Check if current route is protected
     */
    const isProtectedRoute = useCallback((pathname: string): boolean => {
        return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    }, []);

    /**
     * Store current URL and redirect to login
     * @param message - Optional message to display on login page
     * @param returnUrl - Optional custom return URL (defaults to current page)
     */
    const redirectToLogin = useCallback((message?: string, returnUrl?: string): void => {
        const searchParams = new URLSearchParams();

        if (message) {
            searchParams.set('message', message);
        }

        // Store return URL in sessionStorage
        const urlToStore = returnUrl || pathname || '/';
        sessionStorage.setItem('returnUrl', urlToStore);

        const queryString = searchParams.toString();
        const loginUrl = `/login${queryString ? `?${queryString}` : ''}`;

        router.push(loginUrl);
    }, [router, pathname]);

    /**
     * Get stored return URL
     */
    const getReturnUrl = useCallback((): string | null => {
        return sessionStorage.getItem('returnUrl');
    }, []);

    /**
     * Clear stored return URL
     */
    const clearReturnUrl = useCallback((): void => {
        sessionStorage.removeItem('returnUrl');
    }, []);

    /**
     * Redirect to stored return URL or fallback
     * @param fallback - Fallback URL if no return URL is stored (default: '/')
     */
    const redirectToReturnUrl = useCallback((fallback: string = '/'): void => {
        const returnUrl = sessionStorage.getItem('returnUrl');
        sessionStorage.removeItem('returnUrl');
        router.push(returnUrl || fallback);
    }, [router]);

    /**
     * Check if user can access protected content
     * Used for purchases and orders - requires email verification
     */
    const canAccessProtectedContent = useCallback((): boolean => {
        return isAuthenticated && (user?.emailVerified ?? false);
    }, [isAuthenticated, user?.emailVerified]);

    /**
     * Navigate to email verification if needed
     */
    const requireEmailVerification = useCallback((): boolean => {
        if (!isAuthenticated) {
            redirectToLogin('Please sign in to continue');
            return false;
        }

        if (!isEmailVerified()) {
            // User needs to verify email - this should trigger email verification modal
            setAuthError('Please verify your email address to continue');
            return false;
        }

        return true;
    }, [isAuthenticated, isEmailVerified, redirectToLogin, setAuthError]);

    /**
     * Check if user needs to login for action
     * @param action - Description of the action requiring login
     * @returns true if authenticated, false if redirected to login
     */
    const requireAuth = useCallback((action?: string): boolean => {
        if (!isAuthenticated) {
            const message = action ? `Please sign in to ${action}` : 'Please sign in to continue';
            redirectToLogin(message);
            return false;
        }
        return true;
    }, [isAuthenticated, redirectToLogin]);

    /**
     * Check if user needs to login and verify email for action
     * @param action - Description of the action requiring verification
     * @returns true if authenticated and verified, false otherwise
     */
    const requireAuthAndVerification = useCallback((action?: string): boolean => {
        if (!isAuthenticated) {
            const message = action ? `Please sign in to ${action}` : 'Please sign in to continue';
            redirectToLogin(message);
            return false;
        }

        if (!isEmailVerified()) {
            setAuthError('Please verify your email address to continue');
            return false;
        }

        return true;
    }, [isAuthenticated, isEmailVerified, redirectToLogin, setAuthError]);

    // Initialize auth on mount
    useEffect(() => {
        if (!isInitialized) {
            initialize();
        }
    }, [isInitialized, initialize]);

    // Handle route protection
    useEffect(() => {
        if (isInitialized && typeof window !== 'undefined') {
            const currentPath = window.location.pathname;

            if (isProtectedRoute(currentPath)) {
                if (!isAuthenticated) {
                    redirectToLogin('Please sign in to access this page');
                } else if (!isEmailVerified()) {
                    // User is authenticated but email not verified
                    // This should trigger email verification modal
                    setAuthError('Please verify your email address to continue');
                }
            }
        }
    }, [isInitialized, isAuthenticated, isProtectedRoute, redirectToLogin, isEmailVerified, setAuthError]);

    // Auto-refresh token timer (only set once, cleanup on unmount or logout)
    useEffect(() => {
        if (isAuthenticated && accessToken) {
            AuthService.startTokenRefreshTimer();
        } else {
            // Stop timer when user is not authenticated
            AuthService.stopTokenRefreshTimer();
        }

        // Cleanup on unmount
        return () => {
            AuthService.stopTokenRefreshTimer();
        };
    }, [isAuthenticated, accessToken]);

    return {
        // State
        user,
        isAuthenticated,
        isLoading,
        error,
        isInitialized,

        // Actions
        register,
        login,
        logout,
        refreshToken,
        verifyEmailOTP,
        resendOTP,
        forgotPassword,
        resetPassword,
        clearError,
        checkAuthStatus,

        // Additional utilities
        updateUser,
        hasRole,
        isEmailVerified,
        canAccessProtectedContent,
        requireEmailVerification,
        redirectToLogin,
        setAuthError,

        // New utilities
        getReturnUrl,
        clearReturnUrl,
        redirectToReturnUrl,
        requireAuth,
        requireAuthAndVerification,
    };
};

/**
 * Hook for checking authentication status without triggering re-renders
 */
export const useAuthStatus = (): {
    isAuthenticated: boolean;
    isInitialized: boolean;
    user: User | null;
    isEmailVerified: boolean;
} => {
    const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));
    const isInitialized = useSelector((state: RootState) => selectIsInitialized(state));
    const user = useSelector((state: RootState) => selectUser(state));

    return {
        isAuthenticated,
        isInitialized,
        user,
        isEmailVerified: user?.emailVerified ?? false,
    };
};

/**
 * Hook for getting user info only
 */
export const useUser = (): {
    user: User | null;
    isAuthenticated: boolean;
} => {
    const user = useSelector((state: RootState) => selectUser(state));
    const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));

    return {
        user,
        isAuthenticated,
    };
};

/**
 * Hook for protected routes
 */
export const useProtectedRoute = (): {
    isAuthenticated: boolean;
    isInitialized: boolean;
    requireEmailVerification: () => boolean;
} => {
    const { isAuthenticated, isInitialized, requireEmailVerification } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            router.push('/login?message=Please sign in to access this page');
        }
    }, [isInitialized, isAuthenticated, router]);

    return {
        isAuthenticated,
        isInitialized,
        requireEmailVerification,
    };
};

/**
 * Hook for handling return URL after login/register
 * Use this in your login/register pages
 */
export const useLoginRedirect = () => {
    const router = useRouter();
    const { isAuthenticated, isInitialized } = useAuth();

    useEffect(() => {
        if (isInitialized && isAuthenticated) {
            const returnUrl = sessionStorage.getItem('returnUrl');

            if (returnUrl) {
                sessionStorage.removeItem('returnUrl');
                router.push(returnUrl);
            } else {
                // Default redirect to home if no return URL
                router.push('/');
            }
        }
    }, [isAuthenticated, isInitialized, router]);
};

// Export default
export default useAuth;