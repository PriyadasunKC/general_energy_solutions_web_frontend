import React from 'react';
import { solarTheme } from '@/theme/theme';

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Primary Background Layer - Multi-gradient */}
            <div
                className="fixed inset-0 z-0"
                style={{
                    background: `
                        linear-gradient(135deg, ${solarTheme.primary[50]} 0%, ${solarTheme.secondary[50]} 25%, ${solarTheme.accent[50]} 50%, ${solarTheme.primary[50]} 75%, ${solarTheme.secondary[50]} 100%),
                        radial-gradient(ellipse at top left, ${solarTheme.primary[100]}40 0%, transparent 50%),
                        radial-gradient(ellipse at bottom right, ${solarTheme.secondary[100]}40 0%, transparent 50%)
                    `
                }}
            ></div>

            {/* Animated Floating Orbs Layer */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Large Primary Orbs */}
                <div
                    className="absolute -top-48 -left-48 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-20"
                    style={{
                        backgroundColor: solarTheme.primary[300],
                        animation: 'float 20s ease-in-out infinite'
                    }}
                ></div>

                <div
                    className="absolute -top-32 -right-32 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-15"
                    style={{
                        backgroundColor: solarTheme.secondary[300],
                        animation: 'float 25s ease-in-out infinite reverse'
                    }}
                ></div>

                <div
                    className="absolute -bottom-48 -right-48 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-18"
                    style={{
                        backgroundColor: solarTheme.accent[400],
                        animation: 'float 24s ease-in-out infinite reverse'
                    }}
                ></div>

                <div
                    className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-16"
                    style={{
                        backgroundColor: solarTheme.primary[400],
                        animation: 'float 22s ease-in-out infinite'
                    }}
                ></div>

                {/* Medium Floating Orbs - Positioned throughout the page */}
                <div
                    className="absolute top-1/4 -left-40 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-22"
                    style={{
                        backgroundColor: solarTheme.accent[300],
                        animation: 'float 18s ease-in-out infinite'
                    }}
                ></div>

                <div
                    className="absolute top-1/2 -right-40 w-64 h-64 rounded-full mix-blend-multiply filter blur-xl opacity-20"
                    style={{
                        backgroundColor: solarTheme.primary[500],
                        animation: 'float 16s ease-in-out infinite reverse'
                    }}
                ></div>

                <div
                    className="absolute top-3/4 -left-32 w-56 h-56 rounded-full mix-blend-multiply filter blur-lg opacity-25"
                    style={{
                        backgroundColor: solarTheme.secondary[400],
                        animation: 'float 14s ease-in-out infinite'
                    }}
                ></div>

                <div
                    className="absolute bottom-1/4 -right-32 w-48 h-48 rounded-full mix-blend-multiply filter blur-lg opacity-28"
                    style={{
                        backgroundColor: solarTheme.accent[500],
                        animation: 'float 12s ease-in-out infinite reverse'
                    }}
                ></div>

                {/* Small Dynamic Orbs */}
                <div
                    className="absolute top-1/6 left-1/4 w-40 h-40 rounded-full mix-blend-multiply filter blur-lg opacity-30"
                    style={{
                        backgroundColor: solarTheme.primary[600],
                        animation: 'float 10s ease-in-out infinite'
                    }}
                ></div>

                <div
                    className="absolute top-2/3 right-1/4 w-44 h-44 rounded-full mix-blend-multiply filter blur-lg opacity-26"
                    style={{
                        backgroundColor: solarTheme.secondary[500],
                        animation: 'float 13s ease-in-out infinite reverse'
                    }}
                ></div>

                <div
                    className="absolute bottom-1/3 left-1/3 w-36 h-36 rounded-full mix-blend-multiply filter blur-md opacity-32"
                    style={{
                        backgroundColor: solarTheme.accent[600],
                        animation: 'float 11s ease-in-out infinite'
                    }}
                ></div>

                <div
                    className="absolute top-1/3 right-1/3 w-32 h-32 rounded-full mix-blend-multiply filter blur-md opacity-35"
                    style={{
                        backgroundColor: solarTheme.primary[700],
                        animation: 'float 9s ease-in-out infinite reverse'
                    }}
                ></div>
            </div>

            {/* Grid Pattern Overlay */}
            <div
                className="fixed inset-0 z-0 opacity-8 pointer-events-none"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 2px 2px, ${solarTheme.primary[600]} 1px, transparent 0),
                        radial-gradient(circle at 50px 50px, ${solarTheme.secondary[600]} 0.5px, transparent 0),
                        radial-gradient(circle at 25px 75px, ${solarTheme.accent[600]} 0.5px, transparent 0)
                    `,
                    backgroundSize: '50px 50px, 100px 100px, 75px 75px'
                }}
            ></div>

            {/* Mesh Gradient Overlay */}
            <div
                className="fixed inset-0 z-0 opacity-30 pointer-events-none"
                style={{
                    background: `
                        radial-gradient(ellipse at top, transparent 0%, ${solarTheme.primary[100]}20 50%, transparent 100%),
                        radial-gradient(ellipse at bottom, transparent 0%, ${solarTheme.secondary[100]}20 50%, transparent 100%),
                        radial-gradient(ellipse at center, transparent 0%, ${solarTheme.accent[100]}15 50%, transparent 100%)
                    `
                }}
            ></div>

            {/* Subtle Noise Texture Overlay */}
            <div
                className="fixed inset-0 z-0 opacity-5 mix-blend-multiply pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundSize: '256px 256px'
                }}
            ></div>

            {/* Content Layer */}
            <div className="relative z-10">
                {children}
            </div>

            {/* CSS Animation Keyframes */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { 
                        transform: translateY(0px) translateX(0px) scale(1); 
                    }
                    25% { 
                        transform: translateY(-20px) translateX(10px) scale(1.05); 
                    }
                    50% { 
                        transform: translateY(-10px) translateX(-5px) scale(0.95); 
                    }
                    75% { 
                        transform: translateY(-15px) translateX(-10px) scale(1.02); 
                    }
                }

                @keyframes pulse-glow {
                    0%, 100% { 
                        opacity: 0.2; 
                        filter: blur(20px);
                    }
                    50% { 
                        opacity: 0.4; 
                        filter: blur(15px);
                    }
                }
            `}</style>
        </div>
    );
}