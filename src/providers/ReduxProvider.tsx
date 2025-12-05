// src/providers/ReduxProvider.tsx (Updated)
'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store/store';
import { Sun } from 'lucide-react';
import { solarTheme } from '@/theme/theme';

interface ReduxProviderProps {
    children: React.ReactNode;
}

/**
 * Redux Provider Component
 * Wraps the app with Redux store and persistence
 */
const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
    return (
        <Provider store={store}>
            <PersistGate
                loading={<LoadingComponent />}
                persistor={persistor}
            >
                {children}
            </PersistGate>
        </Provider>
    );
};

/**
 * Loading component while hydrating persisted state
 * Shows a consistent loading screen while Redux rehydrates
 */
const LoadingComponent: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div
                    className="absolute top-20 left-10 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
                    style={{ backgroundColor: solarTheme.primary[300] }}
                ></div>
                <div
                    className="absolute bottom-20 right-10 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
                    style={{ backgroundColor: solarTheme.secondary[300] }}
                ></div>
            </div>

            {/* Loading Content */}
            <div className="relative z-10 text-center">
                <div
                    className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl mb-6"
                    style={{ background: `linear-gradient(135deg, ${solarTheme.secondary[400]}, ${solarTheme.secondary[600]})` }}
                >
                    <Sun className="h-10 w-10 text-white animate-spin" style={{ animationDuration: '3s' }} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    General Energy Solutions
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                    Loading your solar experience...
                </p>

                {/* Loading Dots */}
                <div className="flex justify-center space-x-2">
                    <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                            backgroundColor: solarTheme.primary[500],
                            animationDelay: '0ms'
                        }}
                    ></div>
                    <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                            backgroundColor: solarTheme.secondary[500],
                            animationDelay: '150ms'
                        }}
                    ></div>
                    <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                            backgroundColor: solarTheme.accent[500],
                            animationDelay: '300ms'
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default ReduxProvider;