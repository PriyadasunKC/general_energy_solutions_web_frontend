/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/orderTypes.ts

/**
 * Order status types
 */
export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

/**
 * Order type (product or package)
 */
export type OrderType = 'product' | 'package';

/**
 * Payment type
 */
export type PaymentType = 'cash' | 'card';

/**
 * Customer information in order
 */
export interface OrderCustomer {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    address?: string | null;
}

/**
 * Product information in order
 */
export interface OrderProductInfo {
    product_id: string;
    title: string;
    sale_price: string;
    image_urls: string[];
}

/**
 * Product in order with snapshot data
 */
export interface OrderProduct {
    order_product_id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    price: string;
    title: string;
    subtitle: string;
    description: string;
    specifications: Record<string, any>;
    image_urls: string[];
    product: OrderProductInfo;
}

/**
 * Payment information
 */
export interface Payment {
    payment_id: string;
    order_id: string;
    webxpay_payment_id: string; // Changed from payhere_payment_id
    webxpay_order_reference: string; // WebXPay order reference number
    method: PaymentType;
    status_code: string; // Changed to string to match WebXPay response
    status_message: string;
    webxpay_amount: string; // Changed from payhere_amount
    webxpay_currency: string; // Changed from payhere_currency
    transaction_datetime: string; // WebXPay transaction date time
    payment_gateway_used: string; // Which gateway was used for payment
    custom_data: {
        custom_fields: string[];
        checkout_initiated: boolean;
    };
    created_at: string;
    verified: boolean;
}

/**
 * Checkout data from order creation
 * Contains WebXPay payment gateway integration data
 */
export interface Checkout {
    url: string; // WebXPay payment URL
    data: {
        first_name: string;
        last_name: string;
        email: string;
        contact_number: string;
        address_line_one: string;
        address_line_two: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
        secret_key: string; // WebXPay merchant secret key
        payment: string; // Encrypted payment data (order_id|amount)
        cms: string; // Platform identifier (e.g., 'React')
        process_currency: 'LKR' | 'USD' | 'GBP' | 'AUD'; // Payment currency
        custom_fields?: string; // Base64 encoded custom parameters
        payment_gateway_id?: number; // Optional: specific gateway ID
        multiple_payment_gateway_ids?: string; // Optional: multiple gateway IDs
    };
    payment_type: PaymentType;
}

/**
 * Order interface matching API response
 */
export interface Order {
    order_id: string;
    customer_id: string;
    total_price: string;
    status: OrderStatus;
    type: OrderType;
    address: string;
    payment_type: PaymentType;
    is_payment_success: boolean;
    created_at: string;
    confirmed_at: string | null;
    completed_at: string | null;
    cancelled_at: string | null;
    customer?: OrderCustomer;
    orderProducts: OrderProduct[];
    payment: Payment | null;
}

/**
 * Customer info for order creation
 */
export interface CustomerInfo {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    city: string;
    country: string;
}

/**
 * Product for order creation
 */
export interface OrderProductInput {
    product_id: string;
    quantity: number;
}

/**
 * Create order payload
 */
export interface CreateOrderPayload {
    products: OrderProductInput[];
    address: string;
    type: OrderType;
    payment_type: PaymentType;
    customer_info: CustomerInfo;
}

/**
 * Order query parameters for filtering
 */
export interface OrderQueryParams {
    page?: number;
    limit?: number;
    status?: OrderStatus;
}

/**
 * Pagination information
 */
export interface OrderPagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

/**
 * Create order API response
 */
export interface CreateOrderResponse {
    success: boolean;
    message: string;
    data: {
        order: Order;
        checkout: Checkout;
    };
}

/**
 * Get all orders API response
 */
export interface OrdersResponse {
    success: boolean;
    data: {
        orders: Order[];
        pagination: OrderPagination;
    };
}

/**
 * Get single order API response
 */
export interface OrderResponse {
    success: boolean;
    data: Order;
}

/**
 * Cancel order API response
 */
export interface CancelOrderResponse {
    success: boolean;
    message: string;
    data: Order;
}

/**
 * Payment status information
 */
export interface PaymentStatus {
    order_id: string;
    order_status: OrderStatus;
    payment_status: string;
    payment_method: PaymentType;
    amount: string;
    transaction_id: string;
    processed_at: string;
    payment_success: boolean;
}

/**
 * Get payment status API response
 */
export interface PaymentStatusResponse {
    success: boolean;
    data: PaymentStatus;
}

/**
 * Redux state for order management
 */
export interface OrderState {
    orders: Order[];
    currentOrder: Order | null;
    ordersLoading: boolean;
    orderLoading: boolean;
    ordersError: string | null;
    orderError: string | null;
    pagination: OrderPagination;
    checkoutData: Checkout | null;
    isInitialized: boolean;
    filters: {
        status?: OrderStatus;
        page: number;
        limit: number;
    };
    cancellingOrder: boolean;
    cancelOrderError: string | null;
    paymentStatus: PaymentStatus | null;
    paymentStatusLoading: boolean;
    paymentStatusError: string | null;
}

/**
 * Hook return type for useOrders
 */
export interface UseOrderReturn {
    // State
    orders: Order[];
    currentOrder: Order | null;
    ordersLoading: boolean;
    orderLoading: boolean;
    ordersError: string | null;
    orderError: string | null;
    pagination: OrderPagination;
    checkoutData: Checkout | null;
    isInitialized: boolean;
    filters: OrderState['filters'];
    cancellingOrder: boolean;
    paymentStatus: PaymentStatus | null;
    paymentStatusLoading: boolean;

    // Actions
    placeOrder: (payload: CreateOrderPayload) => Promise<{ order: Order; checkout: Checkout }>;
    fetchAllOrders: (params?: OrderQueryParams) => Promise<Order[]>;
    fetchOrder: (orderId: string) => Promise<Order>;
    loadMoreOrders: () => Promise<Order[]>;
    cancelOrder: (orderId: string) => Promise<Order>;
    fetchPaymentStatus: (orderId: string) => Promise<PaymentStatus>;
    clearErrors: () => void;
    clearCurrent: () => void;
    clearCheckout: () => void;
    clearAll: () => void;
    setFilters: (filters: Partial<OrderState['filters']>) => void;

    // Utilities
    formatOrderTotal: (order: Order) => string;
    getOrderStatusColor: (status: OrderStatus) => string;
    getPaymentStatusColor: (paymentStatus: string) => string;
    canCancelOrder: (order: Order) => boolean;
    hasNextPage: () => boolean;
}

/**
 * API endpoints for order management
 */
export const ORDER_ENDPOINTS = {
    CREATE: '/api/orders',
    GET_ALL: '/api/orders',
    GET_BY_ID: (orderId: string) => `/api/orders/${orderId}`,
    CANCEL: (orderId: string) => `/api/orders/${orderId}/cancel`,
    GET_PAYMENT_STATUS: (orderId: string) => `/api/orders/${orderId}/payment`,
} as const;

/**
 * Order constants
 */
export const ORDER_CONSTANTS = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    CANCELABLE_STATUSES: ['pending', 'confirmed'] as OrderStatus[],
} as const;

/**
 * Order status colors
 */
export const ORDER_STATUS_COLORS = {
    pending: '#f59e0b',
    confirmed: '#3b82f6',
    completed: '#22c55e',
    cancelled: '#ef4444',
} as const;

/**
 * Payment status colors
 */
export const PAYMENT_STATUS_COLORS = {
    pending: '#f59e0b',
    completed: '#22c55e',
    failed: '#ef4444',
    refunded: '#6b7280',
} as const;
