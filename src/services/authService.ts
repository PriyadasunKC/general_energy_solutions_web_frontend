/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/authService.ts
import { apiClient } from './apiClient';
import { TokenManager } from './tokenManager';
import {
    AUTH_ENDPOINTS,
    RegisterRequest,
    RegisterResponse,
    LoginRequest,
    LoginResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    VerifyEmailOTPRequest,
    VerifyEmailOTPResponse,
    ResendOTPRequest,
    ResendOTPResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
    User,
} from '../types/authTypes';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export class AuthService {
    /**
     * Register new user
     */
    static async register(data: RegisterRequest): Promise<RegisterResponse> {
        try {
            const response = await apiClient.post<RegisterResponse>(
                AUTH_ENDPOINTS.REGISTER,
                data
            );

            // Store tokens and user data after successful registration
            if (response.accessToken && response.refreshToken && response.user) {
                TokenManager.setAuthSession(
                    response.accessToken,
                    response.refreshToken,
                    response.user
                );
            }

            return response;
        } catch (error: any) {
            console.error('Registration failed:', error);
            throw error;
        }
    }

    /**
     * Login user
     */
    static async login(data: LoginRequest): Promise<LoginResponse> {
        try {
            const response = await apiClient.post<LoginResponse>(
                AUTH_ENDPOINTS.LOGIN,
                data
            );

            // Store tokens and user data after successful login
            if (response.accessToken && response.refreshToken && response.user) {
                TokenManager.setAuthSession(
                    response.accessToken,
                    response.refreshToken,
                    response.user
                );
            }

            return response;
        } catch (error: any) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    /**
     * Logout user
     */
    static async logout(): Promise<void> {
        try {
            // Stop token refresh timer
            this.stopTokenRefreshTimer();

            // Clear local storage and cookies
            TokenManager.clearAllAuthData();

            // Note: You might want to call a logout endpoint here
            // to invalidate tokens on the server side
            // await apiClient.post(AUTH_ENDPOINTS.LOGOUT);

            console.log('User logged out successfully');
        } catch (error: any) {
            console.error('Logout failed:', error);
            // Still stop timer and clear local data even if server call fails
            this.stopTokenRefreshTimer();
            TokenManager.clearAllAuthData();
            throw error;
        }
    }

    /**
     * Refresh access token
     */
    static async refreshToken(): Promise<RefreshTokenResponse> {
        try {
            const refreshToken = TokenManager.getRefreshTokenFromCookie();

            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const requestData: RefreshTokenRequest = { refreshToken };

            const response = await apiClient.post<RefreshTokenResponse>(
                AUTH_ENDPOINTS.REFRESH,
                requestData
            );

            // Update access token in storage
            if (response.accessToken) {
                TokenManager.setAccessToken(response.accessToken);
                // Note: Redux update is now handled by apiClient automatically
            }

            return response;
        } catch (error: any) {
            console.error('Token refresh failed:', error);
            // If refresh fails, clear all auth data and stop timer
            this.stopTokenRefreshTimer();
            TokenManager.clearAllAuthData();
            throw error;
        }
    }

    /**
     * Verify email with OTP
     */
    static async verifyEmailOTP(data: VerifyEmailOTPRequest): Promise<VerifyEmailOTPResponse> {
        try {
            const response = await apiClient.post<VerifyEmailOTPResponse>(
                AUTH_ENDPOINTS.VERIFY_EMAIL_OTP,
                data
            );

            // Update user info if verification affects user data
            const currentUser = TokenManager.getUserInfo();
            if (currentUser) {
                const updatedUser: User = {
                    ...currentUser,
                    emailVerified: true,
                };
                TokenManager.setUserInfo(updatedUser);
            }

            return response;
        } catch (error: any) {
            console.error('Email verification failed:', error);
            throw error;
        }
    }

    /**
     * Resend OTP
     */
    static async resendOTP(data: ResendOTPRequest): Promise<ResendOTPResponse> {
        try {
            const response = await apiClient.post<ResendOTPResponse>(
                AUTH_ENDPOINTS.RESEND_OTP,
                data
            );

            return response;
        } catch (error: any) {
            console.error('Resend OTP failed:', error);
            throw error;
        }
    }

    /**
     * Forgot password
     */
    static async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
        try {
            const response = await apiClient.post<ForgotPasswordResponse>(
                AUTH_ENDPOINTS.FORGOT_PASSWORD,
                data
            );

            return response;
        } catch (error: any) {
            console.error('Forgot password failed:', error);
            throw error;
        }
    }

    /**
     * Reset password
     */
    static async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
        try {
            const response = await apiClient.post<ResetPasswordResponse>(
                AUTH_ENDPOINTS.RESET_PASSWORD,
                data
            );

            return response;
        } catch (error: any) {
            console.error('Reset password failed:', error);
            throw error;
        }
    }

    /**
     * Check current authentication status
     */
    static async checkAuthStatus(): Promise<{ isAuthenticated: boolean; user: User | null }> {
        try {
            const accessToken = TokenManager.getAccessToken();
            const user = TokenManager.getUserInfo();

            if (!accessToken || !user) {
                return { isAuthenticated: false, user: null };
            }

            // Check if access token is expired
            if (TokenManager.isAccessTokenExpired()) {
                // Try to refresh token
                try {
                    await this.refreshToken();
                    const updatedUser = TokenManager.getUserInfo();
                    return { isAuthenticated: true, user: updatedUser };
                } catch (refreshError) {
                    // Refresh failed, user is not authenticated
                    TokenManager.clearAllAuthData();
                    return { isAuthenticated: false, user: null };
                }
            }

            return { isAuthenticated: true, user };
        } catch (error: any) {
            console.error('Auth status check failed:', error);
            TokenManager.clearAllAuthData();
            return { isAuthenticated: false, user: null };
        }
    }

    /**
     * Check if user has specific role
     */
    static hasRole(role: string): boolean {
        const user = TokenManager.getUserInfo();
        return user?.roles?.includes(role as any) || false;
    }

    /**
     * Check if user's email is verified
     */
    static isEmailVerified(): boolean {
        const user = TokenManager.getUserInfo();
        return user?.emailVerified || false;
    }

    /**
     * Get current user info
     */
    static getCurrentUser(): User | null {
        return TokenManager.getUserInfo();
    }

    /**
     * Update user info in storage
     */
    static updateUserInfo(updates: Partial<User>): void {
        const currentUser = TokenManager.getUserInfo();
        if (currentUser) {
            const updatedUser: User = {
                ...currentUser,
                ...updates,
            };
            TokenManager.setUserInfo(updatedUser);
        }
    }

    /**
     * Update user profile on backend
     */
    static async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
        try {
            const response = await apiClient.patch<{ message: string; user: User }>(
                AUTH_ENDPOINTS.UPDATE_PROFILE(userId),
                updates
            );

            // Update local storage with the returned user data
            if (response.user) {
                this.updateUserInfo(response.user);
            }

            return response.user;
        } catch (error: any) {
            console.error('Profile update failed:', error);
            throw error;
        }
    }

    /**
     * Initialize auth on app start
     */
    static async initializeAuth(): Promise<{ isAuthenticated: boolean; user: User | null }> {
        try {
            // Check if we have stored auth data
            const authStatus = await this.checkAuthStatus();

            if (authStatus.isAuthenticated) {
                console.log('User authentication restored from storage');
            } else {
                console.log('No valid authentication found');
            }

            return authStatus;
        } catch (error: any) {
            console.error('Auth initialization failed:', error);
            TokenManager.clearAllAuthData();
            return { isAuthenticated: false, user: null };
        }
    }

    // Store the interval ID to prevent multiple timers
    private static refreshTimerId: NodeJS.Timeout | null = null;

    /**
     * Auto-refresh token before expiration
     */
    static startTokenRefreshTimer(): void {
        // Clear any existing timer first
        this.stopTokenRefreshTimer();

        const checkAndRefresh = async () => {
            try {
                if (TokenManager.shouldRefreshToken()) {
                    console.log('Auto-refreshing token...');
                    await this.refreshToken();
                }
            } catch (error) {
                console.error('Auto-refresh failed:', error);
                // If refresh fails, stop the timer and clear auth data
                this.stopTokenRefreshTimer();
            }
        };

        // Check every minute
        this.refreshTimerId = setInterval(checkAndRefresh, 60 * 1000);

        // Also check immediately
        checkAndRefresh();
    }

    /**
     * Stop token refresh timer
     */
    static stopTokenRefreshTimer(): void {
        if (this.refreshTimerId) {
            clearInterval(this.refreshTimerId);
            this.refreshTimerId = null;
        }
    }

    /**
     * Navigate to login with current route as redirect
     */
    static redirectToLogin(message?: string): void {
        if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            const searchParams = new URLSearchParams();

            if (message) {
                searchParams.set('message', message);
            }

            if (currentPath !== '/login') {
                searchParams.set('redirect', currentPath);
            }

            const queryString = searchParams.toString();
            const loginUrl = `/login${queryString ? `?${queryString}` : ''}`;

            window.location.href = loginUrl;
        }
    }

    /**
     * Check if current route is protected
     */
    static isProtectedRoute(pathname: string): boolean {
        const protectedRoutes = ['/checkout', '/order-confirmation', '/shopping-cart'];
        return protectedRoutes.some(route => pathname.startsWith(route));
    }
}

// Export as default for easier importing
export default AuthService;