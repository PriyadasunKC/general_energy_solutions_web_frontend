// src/app/error.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    AlertTriangle,
    RefreshCw,
    Home,
    Sun,
    Shield,
    Phone,
    Mail,
    ChevronRight,
    Zap,
    Battery,
    WifiOff,
    ShoppingBag
} from 'lucide-react';
import { solarTheme } from '@/theme/theme';

interface ErrorPageProps {
    error?: Error & { digest?: string };
    reset?: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
    const [isAnimated, setIsAnimated] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [isRetrying, setIsRetrying] = useState(false);

    useEffect(() => {
        setIsAnimated(true);
    }, []);

    const handleRetry = async () => {
        setIsRetrying(true);
        setRetryCount(prev => prev + 1);

        // Simulate retry delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (reset) {
            reset();
        } else {
            window.location.reload();
        }

        setIsRetrying(false);
    };

    const supportOptions = [
        {
            icon: <Phone className="h-4 w-4" />,
            label: 'Call Support',
            description: '24/7 Technical Support',
            action: 'tel:+1-800-SOLAR-01',
            color: solarTheme.primary[500]
        },
        {
            icon: <Mail className="h-4 w-4" />,
            label: 'Email Us',
            description: 'Get help via email',
            action: 'mailto:support@generalenergy.com',
            color: solarTheme.secondary[500]
        },
        {
            icon: <Home className="h-4 w-4" />,
            label: 'Go Home',
            description: 'Back to main page',
            action: '/',
            color: solarTheme.accent[500]
        }
    ];

    const quickLinks = [
        { icon: <Home className="h-4 w-4" />, label: 'Home', href: '/' },
        { icon: <ShoppingBag className="h-4 w-4" />, label: 'Solar Panels', href: '/main-products' },
        { icon: <Battery className="h-4 w-4" />, label: 'Energy Storage', href: '/products' },
        { icon: <Phone className="h-4 w-4" />, label: 'Contact Us', href: '/contact-us' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 relative overflow-hidden">
            {/* Background Elements - Mobile optimized */}
            <div className="absolute inset-0">
                <div
                    className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 h-32 sm:w-96 sm:h-96 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
                    style={{ backgroundColor: solarTheme.error[300] }}
                ></div>
                <div
                    className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-32 h-32 sm:w-96 sm:h-96 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
                    style={{ backgroundColor: solarTheme.secondary[300] }}
                ></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6">
                <div className="max-w-2xl mx-auto text-center w-full">

                    {/* Error Icon Animation - Mobile responsive */}
                    <div className={`mb-6 sm:mb-8 transition-all duration-1000 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="relative inline-flex items-center justify-center mb-4 sm:mb-6">
                            {/* Central Error Icon - Responsive sizing */}
                            <div
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl animate-pulse"
                                style={{ backgroundColor: solarTheme.error[500] }}
                            >
                                <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                            </div>

                            {/* Orbiting Status Icons - Mobile optimized */}
                            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
                                <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                                    <div
                                        className="absolute -top-4 sm:-top-6 left-1/2 transform -translate-x-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center shadow-lg"
                                        style={{ backgroundColor: solarTheme.warning[500] }}
                                    >
                                        <WifiOff className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                    </div>

                                    <div
                                        className="absolute top-1/2 -right-4 sm:-right-6 transform -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center shadow-lg"
                                        style={{ backgroundColor: solarTheme.neutral[500] }}
                                    >
                                        <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                    </div>

                                    <div
                                        className="absolute -bottom-4 sm:-bottom-6 left-1/2 transform -translate-x-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center shadow-lg"
                                        style={{ backgroundColor: solarTheme.primary[500] }}
                                    >
                                        <Battery className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                    </div>

                                    <div
                                        className="absolute top-1/2 -left-4 sm:-left-6 transform -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center shadow-lg"
                                        style={{ backgroundColor: solarTheme.secondary[500] }}
                                    >
                                        <Sun className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Message - Mobile responsive */}
                    <div className={`mb-6 sm:mb-8 px-4 transition-all duration-1000 delay-300 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                            System Temporarily Offline
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                            We&apos;re experiencing a temporary power outage in our system.
                            Our solar panels are working to restore service quickly.
                        </p>

                        {/* Error Details - Mobile responsive */}
                        {error?.message && (
                            <div
                                className="p-3 sm:p-4 rounded-lg border-l-4 text-left max-w-lg mx-auto mb-3 sm:mb-4"
                                style={{
                                    backgroundColor: solarTheme.error[50],
                                    borderColor: solarTheme.error[500]
                                }}
                            >
                                <p className="text-sm font-medium" style={{ color: solarTheme.error[700] }}>
                                    Error Details:
                                </p>
                                <p className="text-sm text-gray-600 mt-1 break-words">
                                    {error.message}
                                </p>
                                {error.digest && (
                                    <p className="text-xs text-gray-500 mt-2 break-all">
                                        Error ID: {error.digest}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Retry Button - Mobile optimized */}
                    <div className={`mb-6 sm:mb-8 px-4 transition-all duration-1000 delay-500 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <button
                            onClick={handleRetry}
                            disabled={isRetrying}
                            className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-4 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none touch-manipulation"
                            style={{ backgroundColor: solarTheme.primary[500] }}
                        >
                            {isRetrying ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    Recharging System...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="h-5 w-5 mr-3" />
                                    Try Again {retryCount > 0 && `(${retryCount})`}
                                </>
                            )}
                        </button>

                        {retryCount > 2 && (
                            <p className="text-sm text-gray-500 mt-3 px-4">
                                Still having trouble? Try contacting our support team below.
                            </p>
                        )}
                    </div>

                    {/* Support Options - Mobile responsive grid */}
                    <div className={`mb-6 sm:mb-8 px-4 transition-all duration-1000 delay-700 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                            Need Immediate Help?
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                            {supportOptions.map((option, index) => (
                                <Link
                                    key={index}
                                    href={option.action}
                                    className="group p-4 sm:p-6 rounded-xl border-2 border-transparent hover:shadow-lg transform hover:scale-105 transition-all duration-200 bg-white/80 backdrop-blur-sm touch-manipulation"
                                    style={{ borderColor: 'transparent' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = option.color;
                                        e.currentTarget.style.backgroundColor = `${option.color}10`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'transparent';
                                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                                    }}
                                >
                                    <div className="text-center">
                                        <div
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200"
                                            style={{ backgroundColor: `${option.color}20` }}
                                        >
                                            <span style={{ color: option.color }}>
                                                {option.icon}
                                            </span>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                                            {option.label}
                                        </h4>
                                        <p className="text-xs sm:text-sm text-gray-600 mb-2">
                                            {option.description}
                                        </p>
                                        <ChevronRight
                                            className="h-4 w-4 text-gray-400 group-hover:text-gray-600 mx-auto group-hover:translate-x-1 transition-all duration-200"
                                        />
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Quick Navigation Links */}
                        <div className="space-y-3">
                            <h4 className="text-base font-medium text-gray-700">Quick Navigation</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                                {quickLinks.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.href}
                                        className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-white/60 backdrop-blur-sm hover:bg-white hover:shadow-md transition-all duration-200 touch-manipulation"
                                        style={{ color: solarTheme.primary[600] }}
                                    >
                                        {link.icon}
                                        <span className="text-xs sm:text-sm font-medium">{link.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* System Status - Mobile responsive */}
                    <div className={`px-4 transition-all duration-1000 delay-900 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/60 backdrop-blur-sm shadow-lg max-w-lg mx-auto">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                                <span className="text-xs sm:text-sm text-gray-600">System Status</span>
                            </div>

                            <div className="hidden sm:block w-px h-4 bg-gray-300"></div>

                            <div className="flex items-center space-x-2">
                                <Shield className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: solarTheme.primary[500] }} />
                                <span className="text-xs sm:text-sm text-gray-600">Secure</span>
                            </div>

                            <div className="hidden sm:block w-px h-4 bg-gray-300"></div>

                            <div className="flex items-center space-x-2">
                                <Sun className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: solarTheme.secondary[500] }} />
                                <span className="text-xs sm:text-sm text-gray-600">Solar Powered</span>
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-3 sm:mt-4">
                            Our team has been notified and is working to restore full service.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}