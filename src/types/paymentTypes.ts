// src/types/paymentTypes.ts

/**
 * WebXPay Configuration
 */
export interface WebXPayConfig {
    publicKey: string;
    privateKey?: string; // Optional, only needed for backend decryption
    secretKey: string;
    isProduction: boolean;
    cms?: string;
    returnUrl?: string;
}

/**
 * WebXPay Request Data
 * All fields required by WebXPay payment gateway
 */
export interface WebXPayRequestData {
    first_name: string; // Max 30 characters
    last_name: string; // Max 30 characters
    email: string; // Valid email format
    contact_number: string; // Max 20, Min 9 characters (numbers and + only)
    address_line_one: string;
    address_line_two?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    secret_key: string;
    payment: string; // Encrypted: unique_order_id|total_amount
    cms: string; // React, Magento, etc.
    process_currency: 'LKR' | 'USD' | 'GBP' | 'AUD';
    custom_fields?: string; // Base64 encoded custom parameters
    payment_gateway_id?: number; // Optional gateway ID
    multiple_payment_gateway_ids?: string; // Optional: multiple IDs separated by |
}

/**
 * WebXPay Response Data
 * Decrypted payment response format: order_id|order_refference_number|date_time_transaction|status_code|comment|payment_gateway_used
 */
export interface WebXPayResponseData {
    orderId: string;
    orderReferenceNumber: string;
    transactionDateTime: string;
    statusCode: string; // '0' or '00' = success, '15' = declined
    comment: string;
    paymentGatewayUsed: string;
}

/**
 * WebXPay Encrypted Response (from callback)
 */
export interface WebXPayEncryptedResponse {
    payment: string; // Encrypted payment data
    signature: string; // Signature for validation
    custom_fields?: string; // Base64 encoded custom fields
}

/**
 * WebXPay Gateway Options
 */
export interface WebXPayGateway {
    id: number;
    name: string;
    displayName: string;
    currency: 'LKR' | 'USD';
    type: 'card' | 'wallet' | 'bank' | 'qr';
}

/**
 * WebXPay EMI Gateway Options
 */
export interface WebXPayEMIGateway {
    id: number;
    bank: string;
    tenor: string;
    currency: 'LKR';
}

/**
 * WebXPay Status Codes
 */
export enum WebXPayStatusCode {
    APPROVED = '0',
    APPROVED_ALT = '00',
    DECLINED = '15',
}

/**
 * WebXPay Error Codes
 */
export enum WebXPayErrorCode {
    INVALID_ACCESS = 401,
    CANT_IDENTIFY_PRODUCT = 402,
    INVALID_SECRET_KEY = 403,
    FIRST_NAME_REQUIRED = 405,
    LAST_NAME_REQUIRED = 406,
    EMAIL_REQUIRED = 407,
    CONTACT_NUMBER_REQUIRED = 408,
    AMOUNT_TOO_LOW = 409,
    LKR_AMOUNT_EXCEED = 410,
    USD_AMOUNT_EXCEED = 411,
    UNSUPPORTED_CURRENCY = 412,
    CANT_FIND_GATEWAYS = 413,
    GATEWAY_NOT_FOUND = 414,
    ERROR_GATEWAY_ID = 415,
    BANK_RESPONSE_NOT_RECEIVED = 416,
    CURRENCY_NOT_DEFINED = 417,
    RETURN_URL_MISSING = 418,
    IP_BLOCKED = 419,
    EMAIL_BLOCKED = 420,
    MERCHANT_BLOCKED = 421,
    PROCESSING_ERROR = 423,
    INVALID_REQUEST_URL = 424,
}

/**
 * Payment Gateway Categories
 */
export type PaymentGatewayType = 'card' | 'wallet' | 'bank' | 'qr' | 'emi';

/**
 * Available WebXPay Gateways (from documentation)
 */
export const WEBXPAY_GATEWAYS: WebXPayGateway[] = [
    { id: 2, name: 'ezcash', displayName: 'eZ Cash (LKR)', currency: 'LKR', type: 'wallet' },
    { id: 3, name: 'mcash', displayName: 'mCash (LKR)', currency: 'LKR', type: 'wallet' },
    { id: 4, name: 'ntb_amex_lkr', displayName: 'AMEX (LKR)', currency: 'LKR', type: 'card' },
    { id: 8, name: 'ntb_amex_usd', displayName: 'AMEX (USD)', currency: 'USD', type: 'card' },
    { id: 5, name: 'sampath_viswa', displayName: 'Sampath Viswa (LKR)', currency: 'LKR', type: 'card' },
    { id: 47, name: 'hnb_usd', displayName: 'HNB (USD)', currency: 'USD', type: 'bank' },
    { id: 46, name: 'hnb_lkr', displayName: 'HNB (LKR)', currency: 'LKR', type: 'bank' },
    { id: 16, name: 'dfcc_wallet', displayName: 'DFCC - Wallet (LKR)', currency: 'LKR', type: 'wallet' },
    { id: 35, name: 'frimi', displayName: 'FriMi (LKR)', currency: 'LKR', type: 'wallet' },
    { id: 36, name: 'seylan_lkr', displayName: 'Seylan Bank (LKR)', currency: 'LKR', type: 'bank' },
    { id: 37, name: 'seylan_usd', displayName: 'Seylan Bank (USD)', currency: 'USD', type: 'bank' },
    { id: 38, name: 'commercial_token_lkr', displayName: 'Commercial Token (LKR)', currency: 'LKR', type: 'card' },
    { id: 39, name: 'commercial_token_usd', displayName: 'Commercial Token (USD)', currency: 'USD', type: 'card' },
    { id: 40, name: 'commercial_mpgs_lkr', displayName: 'Commercial Bank MPGS (LKR)', currency: 'LKR', type: 'card' },
    { id: 41, name: 'commercial_mpgs_usd', displayName: 'Commercial Bank MPGS (USD)', currency: 'USD', type: 'card' },
    { id: 42, name: 'genie', displayName: 'Genie Visa Master (LKR)', currency: 'LKR', type: 'card' },
    { id: 43, name: 'cargills_visa_master', displayName: 'Cargills Bank Visa Master (LKR)', currency: 'LKR', type: 'card' },
    { id: 44, name: 'cargills_token', displayName: 'Cargills Bank Token (LKR)', currency: 'LKR', type: 'card' },
    { id: 45, name: 'upay', displayName: 'UPay (LKR)', currency: 'LKR', type: 'wallet' },
    { id: 52, name: 'promotional', displayName: 'Promotional (LKR)', currency: 'LKR', type: 'card' },
    { id: 96, name: 'lanka_qr', displayName: 'Lanka QR', currency: 'LKR', type: 'qr' },
];

/**
 * Available WebXPay EMI Gateways (from documentation)
 */
export const WEBXPAY_EMI_GATEWAYS: WebXPayEMIGateway[] = [
    // NTB - AMEX EMI
    { id: 23, bank: 'NTB - AMEX', tenor: '03 Month (LKR)', currency: 'LKR' },
    { id: 24, bank: 'NTB - AMEX', tenor: '06 Month (LKR)', currency: 'LKR' },
    { id: 25, bank: 'NTB - AMEX', tenor: '12 Month (LKR)', currency: 'LKR' },
    { id: 26, bank: 'NTB - AMEX', tenor: '20 Month (LKR)', currency: 'LKR' },
    { id: 27, bank: 'NTB - AMEX', tenor: '24 Month (LKR)', currency: 'LKR' },
    { id: 28, bank: 'NTB - AMEX', tenor: '36 Month (LKR)', currency: 'LKR' },
    // HNB EMI
    { id: 48, bank: 'HNB', tenor: '3 Month (LKR)', currency: 'LKR' },
    { id: 49, bank: 'HNB', tenor: '6 Month (LKR)', currency: 'LKR' },
    { id: 50, bank: 'HNB', tenor: '12 Month (LKR)', currency: 'LKR' },
    { id: 51, bank: 'HNB', tenor: '24 Month (LKR)', currency: 'LKR' },
    // DFCC EMI
    { id: 53, bank: 'DFCC', tenor: '3 Month (LKR)', currency: 'LKR' },
    { id: 54, bank: 'DFCC', tenor: '6 Month (LKR)', currency: 'LKR' },
    { id: 66, bank: 'DFCC', tenor: '7 Month (LKR)', currency: 'LKR' },
    { id: 67, bank: 'DFCC', tenor: '9 Month (LKR)', currency: 'LKR' },
    { id: 55, bank: 'DFCC', tenor: '12 Month (LKR)', currency: 'LKR' },
    { id: 68, bank: 'DFCC', tenor: '15 Month (LKR)', currency: 'LKR' },
    { id: 69, bank: 'DFCC', tenor: '18 Month (LKR)', currency: 'LKR' },
    { id: 56, bank: 'DFCC', tenor: '24 Month (LKR)', currency: 'LKR' },
    { id: 70, bank: 'DFCC', tenor: '27 Month (LKR)', currency: 'LKR' },
    { id: 71, bank: 'DFCC', tenor: '36 Month (LKR)', currency: 'LKR' },
    { id: 72, bank: 'DFCC', tenor: '41 Month (LKR)', currency: 'LKR' },
    // Commercial Bank EMI
    { id: 61, bank: 'Commercial Bank', tenor: '3 Month (LKR)', currency: 'LKR' },
    { id: 57, bank: 'Commercial Bank', tenor: '6 Month (LKR)', currency: 'LKR' },
    { id: 62, bank: 'Commercial Bank', tenor: '9 Month (LKR)', currency: 'LKR' },
    { id: 58, bank: 'Commercial Bank', tenor: '12 Month (LKR)', currency: 'LKR' },
    { id: 59, bank: 'Commercial Bank', tenor: '18 Month (LKR)', currency: 'LKR' },
    { id: 60, bank: 'Commercial Bank', tenor: '24 Month (LKR)', currency: 'LKR' },
    { id: 63, bank: 'Commercial Bank', tenor: '36 Month (LKR)', currency: 'LKR' },
    { id: 64, bank: 'Commercial Bank', tenor: '48 Month (LKR)', currency: 'LKR' },
    { id: 65, bank: 'Commercial Bank', tenor: '60 Month (LKR)', currency: 'LKR' },
    // NDB EMI
    { id: 75, bank: 'NDB', tenor: '6 Month (LKR)', currency: 'LKR' },
    { id: 76, bank: 'NDB', tenor: '9 Month (LKR)', currency: 'LKR' },
    { id: 77, bank: 'NDB', tenor: '12 Month (LKR)', currency: 'LKR' },
    { id: 78, bank: 'NDB', tenor: '18 Month (LKR)', currency: 'LKR' },
    { id: 79, bank: 'NDB', tenor: '24 Month (LKR)', currency: 'LKR' },
    { id: 80, bank: 'NDB', tenor: '36 Month (LKR)', currency: 'LKR' },
    { id: 81, bank: 'NDB', tenor: '60 Month (LKR)', currency: 'LKR' },
    // Seylan EMI
    { id: 90, bank: 'Seylan', tenor: '6 Month (LKR)', currency: 'LKR' },
    { id: 91, bank: 'Seylan', tenor: '12 Month (LKR)', currency: 'LKR' },
    { id: 92, bank: 'Seylan', tenor: '24 Month (LKR)', currency: 'LKR' },
    // Union Bank EMI
    { id: 97, bank: 'Union Bank', tenor: '3 Month (LKR)', currency: 'LKR' },
    { id: 98, bank: 'Union Bank', tenor: '6 Month (LKR)', currency: 'LKR' },
    { id: 99, bank: 'Union Bank', tenor: '12 Month (LKR)', currency: 'LKR' },
    { id: 100, bank: 'Union Bank', tenor: '18 Month (LKR)', currency: 'LKR' },
    { id: 101, bank: 'Union Bank', tenor: '24 Month (LKR)', currency: 'LKR' },
    { id: 102, bank: 'Union Bank', tenor: '36 Month (LKR)', currency: 'LKR' },
];

/**
 * Get gateways by currency
 */
export function getGatewaysByCurrency(currency: 'LKR' | 'USD'): WebXPayGateway[] {
    return WEBXPAY_GATEWAYS.filter((gateway) => gateway.currency === currency);
}

/**
 * Get gateways by type
 */
export function getGatewaysByType(type: PaymentGatewayType): WebXPayGateway[] {
    return WEBXPAY_GATEWAYS.filter((gateway) => gateway.type === type);
}

/**
 * Get EMI gateways by bank
 */
export function getEMIGatewaysByBank(bank: string): WebXPayEMIGateway[] {
    return WEBXPAY_EMI_GATEWAYS.filter((gateway) => gateway.bank === bank);
}

/**
 * Get gateway by ID
 */
export function getGatewayById(id: number): WebXPayGateway | undefined {
    return WEBXPAY_GATEWAYS.find((gateway) => gateway.id === id);
}

/**
 * Get EMI gateway by ID
 */
export function getEMIGatewayById(id: number): WebXPayEMIGateway | undefined {
    return WEBXPAY_EMI_GATEWAYS.find((gateway) => gateway.id === id);
}
