// src/components/AuthInitializer.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/lib/redux-hooks';
import { apiClient } from '@/services/apiClient';
import { solarTheme } from '@/theme/theme';
import { Sun } from 'lucide-react';

interface AuthInitializerProps {
    children: React.ReactNode;
}

/**
 * AuthInitializer component that handles auth initialization on app startup
 * This ensures authentication state is properly restored from storage
 */
export default function AuthInitializer({ children }: AuthInitializerProps) {
    const { isInitialized } = useAuth();
    const [showInitialLoad, setShowInitialLoad] = useState(true);
    const dispatch = useAppDispatch();

    // Initialize apiClient with Redux dispatch
    useEffect(() => {
        apiClient.setDispatch(dispatch);
    }, [dispatch]);

    // Hide initial loading after auth is initialized
    useEffect(() => {
        if (isInitialized) {
            // Small delay to prevent flash
            const timer = setTimeout(() => {
                setShowInitialLoad(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isInitialized]);

    // Show loading screen during initial auth check
    if (showInitialLoad || !isInitialized) {
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
                    <p className="text-gray-600 mb-8">Initializing...</p>
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
    }

    return <>{children}</>;
}
