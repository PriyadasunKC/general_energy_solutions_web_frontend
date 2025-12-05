import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Primary colors (green for sustainability)
                primary: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                    950: '#052e16',
                },

                // Secondary colors (amber/orange for solar energy)
                secondary: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                    950: '#451a03',
                },

                // Accent colors (blue for clean technology)
                accent: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                },
            },

            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'solar-gradient': 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #fffbeb 100%)',
                'energy-gradient': 'linear-gradient(135deg, #dcfce7 0%, #fef3c7 50%, #eff6ff 100%)',
                'sunset-gradient': 'linear-gradient(135deg, #fed7aa 0%, #fdba74 50%, #fb923c 100%)',
            },

            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },

            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 3s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },

            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)' },
                    '100%': { boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)' },
                },
            },

            boxShadow: {
                'solar': '0 10px 25px -3px rgba(34, 197, 94, 0.1), 0 4px 6px -2px rgba(34, 197, 94, 0.05)',
                'energy': '0 20px 25px -5px rgba(34, 197, 94, 0.1), 0 10px 10px -5px rgba(245, 158, 11, 0.04)',
                'glow-green': '0 0 20px rgba(34, 197, 94, 0.3)',
                'glow-amber': '0 0 20px rgba(245, 158, 11, 0.3)',
            },

            backdropBlur: {
                xs: '2px',
            },
        },
    },
};

export default config;