// src/config/webxpayConfig.ts

/**
 * WebXPay Payment Gateway Configuration
 *
 * IMPORTANT: Frontend does NOT need WebXPay keys or encryption.
 * All encryption is handled by the backend.
 * Frontend only needs environment settings for callback URLs.
 */

/**
 * Get payment callback URL for WebXPay
 */
export function getPaymentCallbackUrl(): string {
    return process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/payment-callback`
        : 'http://localhost:3000/payment-callback';
}

/**
 * Get payment gateway URL based on environment
 * This is only used for reference - backend provides the actual URL
 */
export function getPaymentGatewayUrl(): string {
    const isProduction = process.env.NEXT_PUBLIC_WEBXPAY_ENV === 'production';
    return isProduction
        ? 'https://webxpay.com/index.php?route=checkout/billing'
        : 'https://stagingxpay.info/index.php?route=checkout/billing';
}

/**
 * Check if running in production environment
 */
export function isProductionEnvironment(): boolean {
    return process.env.NEXT_PUBLIC_WEBXPAY_ENV === 'production';
}

/**
 * Validate WebXPay frontend configuration
 */
export function validateWebXPayConfig(): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    // Frontend only needs environment setting and callback URL
    if (!process.env.NEXT_PUBLIC_WEBXPAY_ENV) {
        errors.push('NEXT_PUBLIC_WEBXPAY_ENV is not set (should be "staging" or "production")');
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
        errors.push('NEXT_PUBLIC_APP_URL is not set (needed for payment callback)');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

// Environment variable configuration guide
export const ENV_VARIABLES_GUIDE = {
    FRONTEND_ENV_VARIABLES: {
        NEXT_PUBLIC_WEBXPAY_ENV: {
            description: 'WebXPay environment (production or staging)',
            required: true,
            example: 'staging',
            default: 'staging',
            location: 'Frontend (.env.local)',
        },
        NEXT_PUBLIC_APP_URL: {
            description: 'Your application URL (for payment callback)',
            required: true,
            example: 'https://yourdomain.com',
            location: 'Frontend (.env.local)',
        },
    },
    BACKEND_ENV_VARIABLES: {
        note: 'These variables are handled by the backend - NOT needed in frontend',
        variables: {
            WEBXPAY_PUBLIC_KEY: 'RSA public key for encryption (Backend only)',
            WEBXPAY_SECRET_KEY: 'Merchant secret key (Backend only)',
            WEBXPAY_PRIVATE_KEY: 'RSA private key for decryption (Backend only)',
            FRONTEND_URL: 'Frontend URL for callback redirect (Backend only)',
        },
    },
};

export default {
    getPaymentCallbackUrl,
    getPaymentGatewayUrl,
    isProductionEnvironment,
    validateWebXPayConfig,
    ENV_VARIABLES_GUIDE,
};
