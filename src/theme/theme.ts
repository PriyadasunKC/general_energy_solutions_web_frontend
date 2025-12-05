// theme/theme.ts - Solar Energy Platform Color Theme

export const solarTheme = {
    // Primary Colors - Green (representing nature, sustainability)
    primary: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e', // Main primary
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
        950: '#052e16',
    },

    // Secondary Colors - Orange/Yellow (representing sun, energy)
    secondary: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b', // Main secondary
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
        950: '#451a03',
    },

    // Accent Colors - Blue (representing clean energy, sky)
    accent: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6', // Main accent
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        950: '#172554',
    },

    // Neutral Colors
    neutral: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
        950: '#0a0a0a',
    },

    // Status Colors
    success: {
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
    },

    error: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
    },

    warning: {
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
    },

    // Background gradients for solar theme
    gradients: {
        primary: 'from-primary-50 via-white to-primary-100',
        secondary: 'from-secondary-50 via-white to-secondary-100',
        sunset: 'from-secondary-200 via-secondary-100 to-primary-100',
        energy: 'from-primary-100 via-secondary-50 to-accent-50',
    },
} as const;

// CSS Variables for Tailwind
export const solarThemeCSS = `
:root {
  /* Primary Colors */
  --color-primary-50: 240 253 244;
  --color-primary-100: 220 252 231;
  --color-primary-200: 187 247 208;
  --color-primary-300: 134 239 172;
  --color-primary-400: 74 222 128;
  --color-primary-500: 34 197 94;
  --color-primary-600: 22 163 74;
  --color-primary-700: 21 128 61;
  --color-primary-800: 22 101 52;
  --color-primary-900: 20 83 45;
  --color-primary-950: 5 46 22;

  /* Secondary Colors */
  --color-secondary-50: 255 251 235;
  --color-secondary-100: 254 243 199;
  --color-secondary-200: 253 230 138;
  --color-secondary-300: 252 211 77;
  --color-secondary-400: 251 191 36;
  --color-secondary-500: 245 158 11;
  --color-secondary-600: 217 119 6;
  --color-secondary-700: 180 83 9;
  --color-secondary-800: 146 64 14;
  --color-secondary-900: 120 53 15;
  --color-secondary-950: 69 26 3;

  /* Accent Colors */
  --color-accent-50: 239 246 255;
  --color-accent-100: 219 234 254;
  --color-accent-200: 191 219 254;
  --color-accent-300: 147 197 253;
  --color-accent-400: 96 165 250;
  --color-accent-500: 59 130 246;
  --color-accent-600: 37 99 235;
  --color-accent-700: 29 78 216;
  --color-accent-800: 30 64 175;
  --color-accent-900: 30 58 138;
  --color-accent-950: 23 37 84;
}
`;

export type SolarTheme = typeof solarTheme;