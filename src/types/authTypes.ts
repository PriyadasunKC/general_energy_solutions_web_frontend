/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/authTypes.ts

// User role types
export type UserRole = 'customer' | 'admin' | 'staff';

// Base user interface
export interface User {
    userId: string;
    email: string;
    emailVerified: boolean;
    firstName: string;
    lastName: string;
    phone: string | null;
    imgUrl: string | null;
    address: string | null;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    modifiedAt: string;
    modifiedBy: string | null;
    deletedAt: string | null;
    lastLoginAt: string | null;
    roles: UserRole[];
}

// Auth tokens interface
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

// Auth state interface
export interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    isInitialized: boolean;
}

// Register request payload
export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

// Register response
export interface RegisterResponse {
    message: string;
    accessToken: string;
    refreshToken: string;
    user: User;
}

// Login request payload
export interface LoginRequest {
    email: string;
    password: string;
}

// Login response
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

// Refresh token request
export interface RefreshTokenRequest {
    refreshToken: string;
}

// Refresh token response
export interface RefreshTokenResponse {
    accessToken: string;
}

// Verify email OTP request
export interface VerifyEmailOTPRequest {
    userId: string;
    email: string;
    otp: string;
}

// Verify email OTP response
export interface VerifyEmailOTPResponse {
    message: string;
}

// Resend OTP request
export interface ResendOTPRequest {
    userId: string;
    email: string;
}

// Resend OTP response
export interface ResendOTPResponse {
    message: string;
}

// Forgot password request
export interface ForgotPasswordRequest {
    email: string;
}

// Forgot password response
export interface ForgotPasswordResponse {
    message: string;
}

// Reset password request
export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

// Reset password response
export interface ResetPasswordResponse {
    message: string;
}

// API Error response
export interface APIError {
    message: string;
    status?: number;
    data?: any;
}

// Auth hook return type
export interface UseAuthReturn {
    // State
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    isInitialized: boolean;

    // Core Actions
    register: (data: RegisterRequest) => Promise<RegisterResponse>;
    login: (data: LoginRequest) => Promise<LoginResponse>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<RefreshTokenResponse>;
    verifyEmailOTP: (data: VerifyEmailOTPRequest) => Promise<VerifyEmailOTPResponse>;
    resendOTP: (data: ResendOTPRequest) => Promise<ResendOTPResponse>;
    forgotPassword: (data: ForgotPasswordRequest) => Promise<ForgotPasswordResponse>;
    resetPassword: (data: ResetPasswordRequest) => Promise<ResetPasswordResponse>;
    clearError: () => void;
    checkAuthStatus: () => Promise<void>;

    // User Management
    updateUser: (updates: Partial<User>) => void;
    hasRole: (role: string) => boolean;
    isEmailVerified: () => boolean;
    canAccessProtectedContent: () => boolean;
    requireEmailVerification: () => boolean;
    setAuthError: (errorMessage: string) => void;

    // Navigation & Redirect (NEW)
    redirectToLogin: (message?: string, returnUrl?: string) => void;
    getReturnUrl: () => string | null;
    clearReturnUrl: () => void;
    redirectToReturnUrl: (fallback?: string) => void;

    // Authentication Checks (NEW)
    requireAuth: (action?: string) => boolean;
    requireAuthAndVerification: (action?: string) => boolean;
}

// Token storage keys
export const TOKEN_STORAGE_KEYS = {
    ACCESS_TOKEN: 'ges_access_token',
    USER_INFO: 'ges_user_info',
    REFRESH_TOKEN: 'ges_refresh_token', // This will be stored in cookies
} as const;

// API endpoints
export const AUTH_ENDPOINTS = {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    REFRESH: '/api/auth/refresh',
    VERIFY_EMAIL_OTP: '/api/auth/verify-email-otp',
    RESEND_OTP: '/api/auth/resend-otp',
    FORGOT_PASSWORD: '/api/auth/forget-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    UPDATE_PROFILE: (userId: string) => `/api/users/${userId}/profile`,
} as const;

// Protected routes
export const PROTECTED_ROUTES = [
    '/checkout',
    '/order-confirmation',
    '/shopping-cart',
] as const;

// Public routes
export const PUBLIC_ROUTES = [
    '/about-us',
    '/main-products',
    '/privacy',
    '/products',
    '/resources',
    '/resources/solar-maintenance-tips',
    '/resources/solar-saving-calulator',
    '/terms',
    '/contact-us',
    '/login',
    '/signup',
    '/forgot-password',
    '/verify-otp',
    '/new-password',
    '/reset-password',
] as const;