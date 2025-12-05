// src/app/not-found.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Sun,
    Home,
    Search,
    ArrowLeft,
    Zap,
    Battery,
    Leaf,
    ChevronRight,
    ShoppingBag,
    Phone
} from 'lucide-react';
import { solarTheme } from '@/theme/theme';

export default function NotFound() {
    const [isAnimated, setIsAnimated] = useState(false);

    useEffect(() => {
        setIsAnimated(true);
    }, []);

    const quickLinks = [
        { icon: <Home className="h-4 w-4" />, label: 'Home', href: '/' },
        { icon: <ShoppingBag className="h-4 w-4" />, label: 'Solar Panels', href: '/main-products' },
        { icon: <Battery className="h-4 w-4" />, label: 'Energy Storage', href: '/products' },
        { icon: <Phone className="h-4 w-4" />, label: 'Contact Us', href: '/contact-us' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 relative overflow-hidden">
            {/* Background Elements - Mobile optimized */}
            <div className="absolute inset-0">
                <div
                    className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 h-32 sm:w-96 sm:h-96 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
                    style={{ backgroundColor: solarTheme.primary[300] }}
                ></div>
                <div
                    className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-32 h-32 sm:w-96 sm:h-96 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
                    style={{ backgroundColor: solarTheme.secondary[300] }}
                ></div>
                <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-[500px] sm:h-[500px] rounded-full mix-blend-multiply filter blur-xl opacity-10"
                    style={{ backgroundColor: solarTheme.accent[300] }}
                ></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6">
                <div className="max-w-4xl mx-auto text-center w-full">

                    {/* 404 Visual - Mobile responsive */}
                    <div className={`mb-6 sm:mb-8 transition-all duration-1000 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="relative inline-flex items-center justify-center">
                            {/* Large 404 Text - Responsive sizing */}
                            <h1 className="text-6xl sm:text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-orange-500 to-blue-500 select-none leading-none">
                                404
                            </h1>

                            {/* Floating Solar Icons - Mobile optimized positioning */}
                            <div className="absolute inset-0">
                                <div
                                    className="absolute top-2 sm:top-4 left-4 sm:left-8 w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg animate-bounce"
                                    style={{
                                        backgroundColor: solarTheme.primary[500],
                                        animationDelay: '0ms',
                                        animationDuration: '2s'
                                    }}
                                >
                                    <Sun className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                                </div>

                                <div
                                    className="absolute top-4 sm:top-8 right-6 sm:right-12 w-6 h-6 sm:w-10 sm:h-10 rounded-md sm:rounded-lg flex items-center justify-center shadow-lg animate-bounce"
                                    style={{
                                        backgroundColor: solarTheme.secondary[500],
                                        animationDelay: '500ms',
                                        animationDuration: '2s'
                                    }}
                                >
                                    <Zap className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                                </div>

                                <div
                                    className="absolute bottom-2 sm:bottom-4 left-8 sm:left-16 w-6 h-6 sm:w-10 sm:h-10 rounded-md sm:rounded-lg flex items-center justify-center shadow-lg animate-bounce"
                                    style={{
                                        backgroundColor: solarTheme.accent[500],
                                        animationDelay: '1000ms',
                                        animationDuration: '2s'
                                    }}
                                >
                                    <Battery className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                                </div>

                                <div
                                    className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 w-6 h-6 sm:w-10 sm:h-10 rounded-md sm:rounded-lg flex items-center justify-center shadow-lg animate-bounce"
                                    style={{
                                        backgroundColor: solarTheme.primary[600],
                                        animationDelay: '1500ms',
                                        animationDuration: '2s'
                                    }}
                                >
                                    <Leaf className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Message - Mobile responsive typography */}
                    <div className={`mb-6 sm:mb-8 px-4 transition-all duration-1000 delay-300 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                            Oops! Page Not Found
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-2 leading-relaxed">
                            The page you&apos;re looking for seems to have powered down.
                            Don&apos;t worry, our solar energy is still flowing strong!
                        </p>
                        <p className="text-sm text-gray-500">
                            Let&apos;s get you back on track to clean energy solutions.
                        </p>
                    </div>

                    {/* Action Buttons - Mobile responsive */}
                    <div className={`mb-6 sm:mb-8 px-4 transition-all duration-1000 delay-500 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center px-6 py-3 sm:py-4 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 touch-manipulation"
                                style={{ backgroundColor: solarTheme.primary[500] }}
                            >
                                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                Back to Home
                            </Link>

                            <Link
                                href="/main-products"
                                className="inline-flex items-center justify-center px-6 py-3 sm:py-4 rounded-xl font-medium border-2 hover:shadow-lg transform hover:scale-105 transition-all duration-200 touch-manipulation"
                                style={{
                                    borderColor: solarTheme.secondary[500],
                                    color: solarTheme.secondary[600],
                                    backgroundColor: 'white'
                                }}
                            >
                                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                View Solar Panels
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links - Mobile responsive grid */}
                    <div className={`mb-6 sm:mb-8 px-4 transition-all duration-1000 delay-700 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                            Popular Destinations
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
                            {quickLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className="group p-4 sm:p-5 rounded-xl border-2 border-transparent hover:shadow-lg transform hover:scale-105 transition-all duration-200 bg-white/60 backdrop-blur-sm touch-manipulation"
                                    style={{ borderColor: 'transparent' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = solarTheme.primary[300];
                                        e.currentTarget.style.backgroundColor = solarTheme.primary[50];
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'transparent';
                                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
                                                style={{ backgroundColor: solarTheme.primary[100] }}
                                            >
                                                <span style={{ color: solarTheme.primary[600] }}>
                                                    {link.icon}
                                                </span>
                                            </div>
                                            <span className="text-sm sm:text-base font-medium text-gray-700 group-hover:text-gray-900">
                                                {link.label}
                                            </span>
                                        </div>
                                        <ChevronRight
                                            className="h-4 w-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0"
                                        />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Energy Stats Footer - Mobile responsive */}
                    <div className={`px-4 transition-all duration-1000 delay-900 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="inline-flex items-center justify-center flex-wrap gap-4 sm:gap-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/60 backdrop-blur-sm shadow-lg max-w-lg mx-auto">
                            <div className="text-center">
                                <div
                                    className="text-xl sm:text-2xl font-bold"
                                    style={{ color: solarTheme.primary[600] }}
                                >
                                    99.9%
                                </div>
                                <div className="text-xs text-gray-500">Uptime</div>
                            </div>

                            <div className="hidden sm:block w-px h-8 bg-gray-300"></div>

                            <div className="text-center">
                                <div
                                    className="text-xl sm:text-2xl font-bold"
                                    style={{ color: solarTheme.secondary[600] }}
                                >
                                    24/7
                                </div>
                                <div className="text-xs text-gray-500">Support</div>
                            </div>

                            <div className="hidden sm:block w-px h-8 bg-gray-300"></div>

                            <div className="text-center">
                                <div
                                    className="text-xl sm:text-2xl font-bold"
                                    style={{ color: solarTheme.accent[600] }}
                                >
                                    50MW
                                </div>
                                <div className="text-xs text-gray-500">Generated</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}