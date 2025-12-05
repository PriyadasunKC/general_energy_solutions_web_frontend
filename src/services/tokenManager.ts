// src/services/tokenManager.ts
import { TOKEN_STORAGE_KEYS, User } from '../types/authTypes';

/**
 * Token Manager Service
 * Handles storage and retrieval of tokens and user data
 * Access tokens -> localStorage
 * Refresh tokens -> HttpOnly cookies (handled by server)
 * User info -> localStorage
 */
export class TokenManager {
    // Access Token Management (localStorage)
    static setAccessToken(token: string): void {
        try {
            localStorage.setItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN, token);
        } catch (error) {
            console.error('Failed to set access token:', error);
        }
    }

    static getAccessToken(): string | null {
        try {
            return localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
        } catch (error) {
            console.error('Failed to get access token:', error);
            return null;
        }
    }

    static removeAccessToken(): void {
        try {
            localStorage.removeItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
        } catch (error) {
            console.error('Failed to remove access token:', error);
        }
    }

    // User Info Management (localStorage)
    static setUserInfo(user: User): void {
        try {
            localStorage.setItem(TOKEN_STORAGE_KEYS.USER_INFO, JSON.stringify(user));
        } catch (error) {
            console.error('Failed to set user info:', error);
        }
    }

    static getUserInfo(): User | null {
        try {
            const userInfo = localStorage.getItem(TOKEN_STORAGE_KEYS.USER_INFO);
            return userInfo ? JSON.parse(userInfo) : null;
        } catch (error) {
            console.error('Failed to get user info:', error);
            return null;
        }
    }

    static removeUserInfo(): void {
        try {
            localStorage.removeItem(TOKEN_STORAGE_KEYS.USER_INFO);
        } catch (error) {
            console.error('Failed to remove user info:', error);
        }
    }

    // Refresh Token Management (Cookies - handled by browser)
    // Note: Refresh tokens are set as HttpOnly cookies by the server
    // We don't directly manage them on the client side
    static setRefreshTokenCookie(token: string): void {
        try {
            // Set refresh token as HttpOnly cookie
            // This is typically handled by the server, but for development we can set it
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 7); // 7 days

            document.cookie = `${TOKEN_STORAGE_KEYS.REFRESH_TOKEN}=${token}; expires=${expirationDate.toUTCString()}; path=/; secure; samesite=strict`;
        } catch (error) {
            console.error('Failed to set refresh token cookie:', error);
        }
    }

    static getRefreshTokenFromCookie(): string | null {
        try {
            const cookies = document.cookie.split(';');
            const refreshTokenCookie = cookies.find(cookie =>
                cookie.trim().startsWith(`${TOKEN_STORAGE_KEYS.REFRESH_TOKEN}=`)
            );

            if (refreshTokenCookie) {
                return refreshTokenCookie.split('=')[1].trim();
            }
            return null;
        } catch (error) {
            console.error('Failed to get refresh token from cookie:', error);
            return null;
        }
    }

    static removeRefreshTokenCookie(): void {
        try {
            document.cookie = `${TOKEN_STORAGE_KEYS.REFRESH_TOKEN}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        } catch (error) {
            console.error('Failed to remove refresh token cookie:', error);
        }
    }

    // Clear All Auth Data
    static clearAllAuthData(): void {
        this.removeAccessToken();
        this.removeUserInfo();
        this.removeRefreshTokenCookie();
    }

    // Check if user is authenticated
    static isAuthenticated(): boolean {
        const accessToken = this.getAccessToken();
        const userInfo = this.getUserInfo();
        return !!(accessToken && userInfo);
    }

    // Check if access token is expired (basic check)
    static isAccessTokenExpired(): boolean {
        const token = this.getAccessToken();
        if (!token) return true;

        try {
            // Decode JWT token to check expiration
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);

            return tokenPayload.exp < currentTime;
        } catch (error) {
            console.error('Failed to check token expiration:', error);
            return true; // Assume expired if we can't parse
        }
    }

    // Get token expiration time
    static getTokenExpirationTime(): number | null {
        const token = this.getAccessToken();
        if (!token) return null;

        try {
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            return tokenPayload.exp * 1000; // Convert to milliseconds
        } catch (error) {
            console.error('Failed to get token expiration time:', error);
            return null;
        }
    }

    // Get time until token expires (in milliseconds)
    static getTimeUntilTokenExpires(): number | null {
        const expirationTime = this.getTokenExpirationTime();
        if (!expirationTime) return null;

        const currentTime = Date.now();
        return Math.max(0, expirationTime - currentTime);
    }

    // Check if refresh is needed (refresh when 5 minutes left)
    static shouldRefreshToken(): boolean {
        const timeUntilExpiry = this.getTimeUntilTokenExpires();
        if (!timeUntilExpiry) return false;

        // Refresh if less than 5 minutes remaining
        return timeUntilExpiry < 5 * 60 * 1000;
    }

    // Store complete auth session
    static setAuthSession(accessToken: string, refreshToken: string, user: User): void {
        this.setAccessToken(accessToken);
        this.setRefreshTokenCookie(refreshToken);
        this.setUserInfo(user);
    }

    // Get complete auth session
    static getAuthSession(): {
        accessToken: string | null;
        refreshToken: string | null;
        user: User | null;
    } {
        return {
            accessToken: this.getAccessToken(),
            refreshToken: this.getRefreshTokenFromCookie(),
            user: this.getUserInfo(),
        };
    }
}