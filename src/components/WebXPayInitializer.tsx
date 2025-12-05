// src/components/WebXPayInitializer.tsx
'use client';

import { useEffect } from 'react';
import { validateWebXPayConfig } from '@/config/webxpayConfig';

interface WebXPayInitializerProps {
    children: React.ReactNode;
}

/**
 * WebXPayInitializer component that validates WebXPay configuration
 *
 * IMPORTANT: Frontend does NOT initialize WebXPay service since all
 * encryption is handled by the backend. This component only validates
 * that the required environment variables are set.
 */
export default function WebXPayInitializer({ children }: WebXPayInitializerProps) {
    useEffect(() => {
        // Only run on client-side
        if (typeof window !== 'undefined') {
            try {
                // Validate frontend configuration
                const validation = validateWebXPayConfig();

                if (!validation.isValid) {
                    console.warn('⚠️ WebXPay configuration incomplete:');
                    validation.errors.forEach((error) => {
                        console.warn(`  - ${error}`);
                    });
                    console.warn('💡 Check your .env.local file for required variables');
                } else {
                    console.log('✅ WebXPay frontend configuration validated');
                }
            } catch (error) {
                console.error('❌ Failed to validate WebXPay configuration:', error);
            }
        }
    }, []);

    return <>{children}</>;
}
