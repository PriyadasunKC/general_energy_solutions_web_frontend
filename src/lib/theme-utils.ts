/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/theme-utils.ts - Utility functions for solar theme

import { solarTheme, type SolarTheme } from '@/theme/theme';

// Helper function to get theme colors
export const getThemeColor = (path: string): string => {
    const keys = path.split('.');
    let result: any = solarTheme;

    for (const key of keys) {
        result = result[key];
        if (!result) return '';
    }

    return result;
};

// Predefined color combinations for different UI states
export const colorCombinations = {
    primary: {
        background: 'bg-primary-500',
        hover: 'hover:bg-primary-600',
        text: 'text-white',
        border: 'border-primary-500',
        ring: 'focus:ring-primary-500',
    },

    secondary: {
        background: 'bg-secondary-500',
        hover: 'hover:bg-secondary-600',
        text: 'text-white',
        border: 'border-secondary-500',
        ring: 'focus:ring-secondary-500',
    },

    accent: {
        background: 'bg-accent-500',
        hover: 'hover:bg-accent-600',
        text: 'text-white',
        border: 'border-accent-500',
        ring: 'focus:ring-accent-500',
    },

    success: {
        background: 'bg-green-500',
        hover: 'hover:bg-green-600',
        text: 'text-white',
        border: 'border-green-500',
        ring: 'focus:ring-green-500',
    },

    error: {
        background: 'bg-red-500',
        hover: 'hover:bg-red-600',
        text: 'text-white',
        border: 'border-red-500',
        ring: 'focus:ring-red-500',
    },

    warning: {
        background: 'bg-amber-500',
        hover: 'hover:bg-amber-600',
        text: 'text-white',
        border: 'border-amber-500',
        ring: 'focus:ring-amber-500',
    },
};

// Gradient combinations for solar theme
export const gradients = {
    primary: 'bg-gradient-to-r from-green-500 to-emerald-600',
    secondary: 'bg-gradient-to-r from-amber-400 to-orange-500',
    accent: 'bg-gradient-to-r from-blue-500 to-cyan-600',
    solar: 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500',
    nature: 'bg-gradient-to-r from-green-400 to-blue-500',
    sunset: 'bg-gradient-to-r from-orange-400 via-red-500 to-pink-500',
    energy: 'bg-gradient-to-br from-green-50 via-white to-amber-50',
};

// Glass morphism styles for modern UI
export const glassStyles = {
    light: 'bg-white/70 backdrop-blur-sm border border-white/20',
    medium: 'bg-white/80 backdrop-blur-md border border-white/30',
    heavy: 'bg-white/90 backdrop-blur-lg border border-white/20',
    colored: 'bg-green-500/10 backdrop-blur-md border border-green-500/20',
};

// Shadow variations for depth
export const shadows = {
    soft: 'shadow-lg shadow-green-500/10',
    medium: 'shadow-xl shadow-green-500/20',
    strong: 'shadow-2xl shadow-green-500/25',
    colored: 'shadow-lg shadow-green-500/30',
};

// Helper function to combine classes safely
export const cn = (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(' ');
};

// Animation classes for engaging interactions
export const animations = {
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    pulse: 'animate-pulse-slow',
    bounce: 'animate-bounce',
    float: 'hover:transform hover:-translate-y-1 transition-transform duration-200',
    scale: 'hover:scale-105 transition-transform duration-200',
    glow: 'hover:shadow-lg hover:shadow-green-500/25 transition-shadow duration-300',
};

// Responsive text sizes
export const textSizes = {
    hero: 'text-4xl md:text-5xl lg:text-6xl',
    title: 'text-2xl md:text-3xl lg:text-4xl',
    subtitle: 'text-lg md:text-xl lg:text-2xl',
    body: 'text-sm md:text-base',
    caption: 'text-xs md:text-sm',
};

// Spacing utilities
export const spacing = {
    section: 'py-12 md:py-16 lg:py-20',
    container: 'px-4 md:px-6 lg:px-8',
    element: 'mb-4 md:mb-6 lg:mb-8',
};

export default {
    getThemeColor,
    colorCombinations,
    gradients,
    glassStyles,
    shadows,
    cn,
    animations,
    textSizes,
    spacing,
};