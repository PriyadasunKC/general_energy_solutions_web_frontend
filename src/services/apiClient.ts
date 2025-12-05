/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/apiClient.ts
import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig
} from 'axios';
import { TokenManager } from './tokenManager';
import { AUTH_ENDPOINTS, RefreshTokenResponse, APIError } from '../types/authTypes';
import type { AppDispatch } from '../store/store';

// Base URL from environment or fallback
export const BackEndBaseURL = `https://057c2e350062.ngrok-free.app`;

/**
 * API Client with automatic token management and refresh
 */
class APIClient {
    private axiosInstance: AxiosInstance;
    private isRefreshing = false;
    private failedQueue: Array<{
        resolve: (value?: any) => void;
        reject: (error?: any) => void;
    }> = [];
    private dispatch: AppDispatch | null = null;

    constructor() {
        // Create axios instance with base configuration
        this.axiosInstance = axios.create({
            baseURL: BackEndBaseURL,
            timeout: 30000, // 30 seconds
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            withCredentials: true, // Important for cookies
        });

        this.setupInterceptors();
    }

    /**
     * Set Redux dispatch for updating store on token refresh
     * This should be called from the app initialization
     */
    setDispatch(dispatch: AppDispatch): void {
        this.dispatch = dispatch;
    }

    /**
     * Setup request and response interceptors
     */
    private setupInterceptors(): void {
        // Request interceptor
        this.axiosInstance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                return this.handleRequest(config);
            },
            (error: any) => {
                return Promise.reject(this.handleError(error));
            }
        );

        // Response interceptor
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                return response;
            },
            async (error: any) => {
                return this.handleResponseError(error);
            }
        );
    }

    /**
     * Handle outgoing requests - add auth token
     */
    private handleRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
        const accessToken = TokenManager.getAccessToken();

        if (accessToken && !this.isAuthEndpoint(config.url || '')) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Add request timestamp for debugging
        // if (process.env.NODE_ENV === 'development') {
        //     console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        //         timestamp: new Date().toISOString(),
        //         data: config.data,
        //         params: config.params,
        //     });
        // }

        return config;
    }

    /**
     * Handle response errors - implement token refresh logic
     */
    private async handleResponseError(error: any): Promise<any> {
        const originalRequest = error.config;

        // Log error for debugging
        // if (process.env.NODE_ENV === 'development') {
        //     console.error(`[API Error] ${error.response?.status} ${error.config?.url}`, {
        //         timestamp: new Date().toISOString(),
        //         error: error.response?.data,
        //         status: error.response?.status,
        //     });
        // }

        // Handle 401 Unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (this.isAuthEndpoint(originalRequest.url)) {
                // If it's an auth endpoint, don't retry
                return Promise.reject(this.handleError(error));
            }

            if (this.isRefreshing) {
                // If already refreshing, queue the request
                return new Promise((resolve, reject) => {
                    this.failedQueue.push({ resolve, reject });
                }).then(() => {
                    return this.axiosInstance(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            this.isRefreshing = true;

            try {
                const refreshToken = TokenManager.getRefreshTokenFromCookie();

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Attempt to refresh token
                const response = await this.axiosInstance.post<RefreshTokenResponse>(
                    AUTH_ENDPOINTS.REFRESH,
                    { refreshToken }
                );

                const { accessToken } = response.data;

                // Update stored token
                TokenManager.setAccessToken(accessToken);

                // Update Redux store if dispatch is available
                if (this.dispatch) {
                    // Dynamically import the action to avoid circular dependencies
                    const { updateAccessToken } = await import('../store/slices/authSlice');
                    this.dispatch(updateAccessToken(accessToken));
                }

                // Process queued requests
                this.processQueue(null);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return this.axiosInstance(originalRequest);

            } catch (refreshError) {
                // Refresh failed - clear tokens and redirect to login
                this.processQueue(refreshError);
                this.handleAuthFailure();
                return Promise.reject(this.handleError(refreshError));
            } finally {
                this.isRefreshing = false;
            }
        }

        // Handle other errors
        return Promise.reject(this.handleError(error));
    }

    /**
     * Process queued requests after token refresh
     */
    private processQueue(error: any): void {
        this.failedQueue.forEach(({ resolve, reject }) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });

        this.failedQueue = [];
    }

    /**
     * Handle authentication failure - clear tokens and redirect
     */
    private handleAuthFailure(): void {
        TokenManager.clearAllAuthData();

        // Check if we're in a browser environment
        if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            const protectedRoutes = ['/checkout', '/order-confirmation', '/shopping-cart', '/package-checkout', '/profile'];

            // Only redirect if on a protected route
            if (protectedRoutes.some(route => currentPath.startsWith(route))) {
                window.location.href = '/login?message=Session expired. Please sign in again.';
            }
        }
    }

    /**
     * Check if URL is an auth endpoint
     */
    private isAuthEndpoint(url: string): boolean {
        return Object.values(AUTH_ENDPOINTS).some(endpoint => {
            // Handle both string endpoints and function endpoints
            if (typeof endpoint === 'function') {
                return false; // Skip function endpoints in the check
            }
            return url.includes(endpoint);
        });
    }

    /**
     * Standardize error handling
     */
    private handleError(error: any): APIError {
        if (error.response) {
            // Server responded with error status
            // Try multiple possible error message fields to be more flexible
            const errorMessage =
                error.response.data?.error ||           // Some API uses 'error' field
                error.response.data?.message ||         // Some APIs use 'message' field
                error.response.data?.details ||         // Some APIs use 'details' field
                error.response.statusText ||            // Fallback to HTTP status text
                'An error occurred';                    // Final fallback

            return {
                message: errorMessage,
                status: error.response.status,
                data: error.response.data,
            };
        } else if (error.request) {
            // Request made but no response
            return {
                message: 'Network error - please check your connection',
                status: 0,
                data: null,
            };
        } else {
            // Something else happened
            return {
                message: error.message || 'An unexpected error occurred',
                status: 0,
                data: null,
            };
        }
    }

    /**
     * Public methods for making requests
     */

    async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.get<T>(url, config);
        return response.data;
    }

    async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.post<T>(url, data, config);
        return response.data;
    }

    async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.put<T>(url, data, config);
        return response.data;
    }

    async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.patch<T>(url, data, config);
        return response.data;
    }

    async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.delete<T>(url, config);
        return response.data;
    }

    /**
     * Get the underlying axios instance if needed
     */
    getAxiosInstance(): AxiosInstance {
        return this.axiosInstance;
    }

    /**
     * Check authentication status
     */
    isAuthenticated(): boolean {
        return TokenManager.isAuthenticated();
    }

    /**
     * Force token refresh
     */
    async forceTokenRefresh(): Promise<string> {
        const refreshToken = TokenManager.getRefreshTokenFromCookie();

        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await this.post<RefreshTokenResponse>(
            AUTH_ENDPOINTS.REFRESH,
            { refreshToken }
        );

        TokenManager.setAccessToken(response.accessToken);

        // Update Redux store if dispatch is available
        if (this.dispatch) {
            const { updateAccessToken } = await import('../store/slices/authSlice');
            this.dispatch(updateAccessToken(response.accessToken));
        }

        return response.accessToken;
    }
}

// Create and export singleton instance
export const apiClient = new APIClient();

// Export for testing or advanced usage
export { APIClient };