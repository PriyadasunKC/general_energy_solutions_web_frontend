/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthService } from '../../services/authService';
import { TokenManager } from '../../services/tokenManager';
import {
    AuthState,
    User,
    RegisterRequest,
    RegisterResponse,
    LoginRequest,
    LoginResponse,
    RefreshTokenResponse,
    VerifyEmailOTPRequest,
    VerifyEmailOTPResponse,
    ResendOTPRequest,
    ResendOTPResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
    APIError,
} from '../../types/authTypes';

// Initial state
const initialState: AuthState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isInitialized: false,
};

// Async thunks for authentication actions

/**
 * Initialize auth on app start
 */
export const initializeAuth = createAsyncThunk<
    { isAuthenticated: boolean; user: User | null; accessToken: string | null },
    void,
    { rejectValue: APIError }
>(
    'auth/initialize',
    async (_, { rejectWithValue }) => {
        try {
            const result = await AuthService.initializeAuth();
            const accessToken = TokenManager.getAccessToken();
            return {
                ...result,
                accessToken,
            };
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

/**
 * Register user
 */
export const registerUser = createAsyncThunk<
    RegisterResponse,
    RegisterRequest,
    { rejectValue: APIError }
>(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const result = await AuthService.register(userData);
            return result;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

/**
 * Login user
 */
export const loginUser = createAsyncThunk<
    LoginResponse,
    LoginRequest,
    { rejectValue: APIError }
>(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const result = await AuthService.login(credentials);
            return result;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

/**
 * Logout user
 */
export const logoutUser = createAsyncThunk<
    void,
    void,
    { rejectValue: APIError }
>(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await AuthService.logout();
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

/**
 * Refresh access token
 */
export const refreshAccessToken = createAsyncThunk<
    RefreshTokenResponse,
    void,
    { rejectValue: APIError }
>(
    'auth/refreshToken',
    async (_, { rejectWithValue }) => {
        try {
            const result = await AuthService.refreshToken();
            return result;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

/**
 * Verify email OTP
 */
export const verifyEmailOTP = createAsyncThunk<
    VerifyEmailOTPResponse,
    VerifyEmailOTPRequest,
    { rejectValue: APIError }
>(
    'auth/verifyEmailOTP',
    async (otpData, { rejectWithValue }) => {
        try {
            const result = await AuthService.verifyEmailOTP(otpData);
            return result;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

/**
 * Resend OTP
 */
export const resendOTP = createAsyncThunk<
    ResendOTPResponse,
    ResendOTPRequest,
    { rejectValue: APIError }
>(
    'auth/resendOTP',
    async (resendData, { rejectWithValue }) => {
        try {
            const result = await AuthService.resendOTP(resendData);
            return result;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

/**
 * Forgot password
 */
export const forgotPassword = createAsyncThunk<
    ForgotPasswordResponse,
    ForgotPasswordRequest,
    { rejectValue: APIError }
>(
    'auth/forgotPassword',
    async (emailData, { rejectWithValue }) => {
        try {
            const result = await AuthService.forgotPassword(emailData);
            return result;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

/**
 * Reset password
 */
export const resetPassword = createAsyncThunk<
    ResetPasswordResponse,
    ResetPasswordRequest,
    { rejectValue: APIError }
>(
    'auth/resetPassword',
    async (resetData, { rejectWithValue }) => {
        try {
            const result = await AuthService.resetPassword(resetData);
            return result;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

/**
 * Check auth status
 */
export const checkAuthStatus = createAsyncThunk<
    { isAuthenticated: boolean; user: User | null; accessToken: string | null },
    void,
    { rejectValue: APIError }
>(
    'auth/checkStatus',
    async (_, { rejectWithValue }) => {
        try {
            const result = await AuthService.checkAuthStatus();
            const accessToken = TokenManager.getAccessToken();
            return {
                ...result,
                accessToken,
            };
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

// Auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Update user info
        updateUserInfo: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                TokenManager.setUserInfo(state.user);
            }
        },

        // Set loading state
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        // Clear auth state (for logout)
        clearAuthState: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.error = null;
            TokenManager.clearAllAuthData();
        },

        // Set error
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },

        // Update access token silently (for background refresh)
        updateAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
            TokenManager.setAccessToken(action.payload);
        },
    },
    extraReducers: (builder) => {
        // Initialize Auth
        builder
            .addCase(initializeAuth.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(initializeAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isInitialized = true;
                state.isAuthenticated = action.payload.isAuthenticated;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.error = null;
            })
            .addCase(initializeAuth.rejected, (state, action) => {
                state.isLoading = false;
                state.isInitialized = true;
                state.isAuthenticated = false;
                state.user = null;
                state.accessToken = null;
                state.error = action.payload?.message || 'Authentication initialization failed';
            });

        // Register
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.accessToken = null;
                state.error = action.payload?.message || 'Registration failed';
            });

        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.accessToken = null;
                state.error = action.payload?.message || 'Login failed';
            });

        // Logout
        builder
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.accessToken = null;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false;
                // Still clear auth state even if logout fails
                state.isAuthenticated = false;
                state.user = null;
                state.accessToken = null;
                state.error = action.payload?.message || 'Logout failed';
            });

        // Refresh Token
        builder
            .addCase(refreshAccessToken.pending, (state) => {
                // Don't show loading for token refresh
                state.error = null;
            })
            .addCase(refreshAccessToken.fulfilled, (state, action) => {
                state.accessToken = action.payload.accessToken;
                state.error = null;
            })
            .addCase(refreshAccessToken.rejected, (state, action) => {
                // Token refresh failed, clear auth state
                state.isAuthenticated = false;
                state.user = null;
                state.accessToken = null;
                state.error = action.payload?.message || 'Token refresh failed';
            });

        // Verify Email OTP
        builder
            .addCase(verifyEmailOTP.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(verifyEmailOTP.fulfilled, (state) => {
                state.isLoading = false;
                if (state.user) {
                    state.user.emailVerified = true;
                }
                state.error = null;
            })
            .addCase(verifyEmailOTP.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Email verification failed';
            });

        // Resend OTP
        builder
            .addCase(resendOTP.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(resendOTP.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(resendOTP.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Failed to resend OTP';
            });

        // Forgot Password
        builder
            .addCase(forgotPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Failed to send reset email';
            });

        // Reset Password
        builder
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Failed to reset password';
            });

        // Check Auth Status
        builder
            .addCase(checkAuthStatus.pending, (state) => {
                state.error = null;
            })
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
                state.isAuthenticated = action.payload.isAuthenticated;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.error = null;
            })
            .addCase(checkAuthStatus.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.user = null;
                state.accessToken = null;
                state.error = action.payload?.message || 'Auth status check failed';
            });
    },
});

// Export actions
export const {
    clearError,
    updateUserInfo,
    setLoading,
    clearAuthState,
    setError,
    updateAccessToken,
} = authSlice.actions;

// Export selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
export const selectIsInitialized = (state: { auth: AuthState }) => state.auth.isInitialized;
export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken;

// Export reducer
export default authSlice.reducer;