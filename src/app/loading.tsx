// src/app/loading.tsx
"use client";

import React from 'react';
import { Sun } from 'lucide-react';
import { solarTheme } from '@/theme/theme';

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center" style={{
            background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white, ${solarTheme.secondary[50]})`
        }}>
            <div className="text-center">
                {/* Simple Sun Icon with Spin */}
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

                {/* Brand Name */}
                <h1 className="text-3xl font-bold mb-2" style={{ color: solarTheme.primary[700] }}>
                    General Energy Solutions
                </h1>
                <p className="text-gray-600 mb-8">Powering Your Future</p>

                {/* Simple Loading Dots */}
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