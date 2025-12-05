// src/services/webxpayService.ts

/**
 * WebXPay Payment Gateway Service
 *
 * IMPORTANT: This service DOES NOT handle encryption or data preparation.
 * All encryption is handled by the backend. The frontend only:
 * 1. Receives pre-encrypted data from the backend
 * 2. Submits it to WebXPay via form POST
 * 3. Provides utility methods for status checking
 */
export class WebXPayService {
    private static instance: WebXPayService;

    private constructor() {}

    /**
     * Get singleton instance
     */
    public static getInstance(): WebXPayService {
        if (!WebXPayService.instance) {
            WebXPayService.instance = new WebXPayService();
        }
        return WebXPayService.instance;
    }

    /**
     * Submit payment request to WebXPay
     * Takes the URL and data from backend and submits it as-is
     *
     * @param url - WebXPay endpoint URL (from backend)
     * @param data - Pre-encrypted payment data (from backend)
     */
    public submitPaymentRequest(url: string, data: Record<string, unknown>): void {
        // Create a form element
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = url;
        form.style.display = 'none';
        // Use multipart/form-data to preserve Base64 special characters (+, /, =)
        form.enctype = 'multipart/form-data';

        // Add all request data as hidden inputs (data is already encrypted by backend)
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = String(value);
                form.appendChild(input);
            }
        });

        // Append form to body and submit
        document.body.appendChild(form);
        form.submit();
    }

    /**
     * Check if payment was successful based on status code
     * According to WebXPay documentation:
     * - Code 0 and 00 = Transaction Approved
     * - Code 15 = Transaction Declined
     */
    public isPaymentSuccessful(statusCode: string): boolean {
        return statusCode === '0' || statusCode === '00';
    }

    /**
     * Get payment status message
     */
    public getPaymentStatusMessage(statusCode: string): string {
        const statusMessages: Record<string, string> = {
            '0': 'Transaction Successful',
            '00': 'Transaction Successful',
            '15': 'Transaction Declined',
        };

        return statusMessages[statusCode] || 'Unknown payment status';
    }

    /**
     * Get error message for WebXPay error code
     */
    public getErrorMessage(errorCode: number): string {
        const errorMessages: Record<number, string> = {
            401: 'Invalid access',
            402: "Can't identify product",
            403: 'Invalid Secret Key',
            405: 'First name is required',
            406: 'Last name is required',
            407: 'Email Address is required',
            408: 'Contact Number is required',
            409: 'Total amount less than 1 USD/1 LKR',
            410: 'LKR total amount exceed',
            411: 'USD total amount exceed',
            412: 'Not supported currency code',
            413: "Can't find the Gateways",
            414: 'Selected gateway is not found',
            415: 'Error gateway ID',
            416: 'Bank Response not received',
            417: 'Currency code not defined',
            418: 'Return URL missing X Gateway',
            419: 'Transaction Blocked for this IP Address',
            420: 'Transaction Blocked for this E-mail address',
            421: 'Transaction Blocked for this merchant',
            423: 'An error has occurred while processing your payment',
            424: 'Invalid Request URL',
        };

        return errorMessages[errorCode] || 'Unknown error occurred';
    }

    /**
     * Validate basic request data before submission
     * Note: This validates format only. Backend handles encryption validation.
     */
    public validateRequestData(data: Record<string, unknown>): {
        isValid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];

        // Check required fields exist
        if (!data.first_name || String(data.first_name).length > 30) {
            errors.push('First name is required and must be less than 30 characters');
        }

        if (!data.last_name || String(data.last_name).length > 30) {
            errors.push('Last name is required and must be less than 30 characters');
        }

        if (!data.email || !this.isValidEmail(String(data.email))) {
            errors.push('Valid email address is required');
        }

        if (!data.contact_number || !this.isValidPhoneNumber(String(data.contact_number))) {
            errors.push('Valid contact number is required (9-20 characters, numbers and + only)');
        }

        if (!data.address_line_one) {
            errors.push('Address line 1 is required');
        }

        if (!data.secret_key) {
            errors.push('Secret key is required');
        }

        if (!data.payment) {
            errors.push('Payment data is required (should be encrypted by backend)');
        }

        if (!data.process_currency) {
            errors.push('Currency is required');
        }

        if (data.process_currency && !['LKR', 'USD', 'GBP', 'AUD'].includes(String(data.process_currency))) {
            errors.push('Invalid currency code');
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    /**
     * Validate email format
     */
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate phone number format
     */
    private isValidPhoneNumber(phone: string): boolean {
        const phoneRegex = /^[+\d]{9,20}$/;
        return phoneRegex.test(phone);
    }
}

// Export singleton instance
export const webXPayService = WebXPayService.getInstance();

export default webXPayService;
