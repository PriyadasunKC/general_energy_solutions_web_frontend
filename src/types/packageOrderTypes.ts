// src/types/packageOrderTypes.ts

export type PaymentMethod = 'cash' | 'card';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';

/**
 * Package order creation payload
 */
export interface CreatePackageOrderPayload {
    package_id: string;
    quantity: number;
    delivery_address: string;
    payment_method: PaymentMethod;
    notes?: string;
}

/**
 * Package order item in response
 */
export interface PackageOrderItem {
    package_order_item_id: string;
    package_order_id: string;
    package_item_id: string;
    title: string;
    subtitle?: string;
    quantity: number;
    price: string;
    created_at: string;
}

/**
 * Customer info in package order
 */
export interface PackageOrderCustomer {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

/**
 * Package info in package order
 */
export interface PackageOrderPackageInfo {
    package_id: string;
    package_code: string;
    title: string;
}

/**
 * Package order response from API
 */
export interface PackageOrder {
    package_order_id: string;
    customer_id: string;
    package_id: string;
    package_code: string;
    title: string;
    subtitle: string;
    description: string;
    specification: {
        warranty?: string;
        efficiency?: string;
        panel_type?: string;
        power_output?: string;
        [key: string]: string | undefined;
    };
    image_urls: string[];
    quantity: number;
    sale_price: string;
    original_price: string;
    total_price: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    delivery_address: string;
    payment_method: PaymentMethod;
    payment_status: PaymentStatus;
    order_status: OrderStatus;
    notes?: string;
    created_at: string;
    confirmed_at: string | null;
    completed_at: string | null;
    cancelled_at: string | null;
    modified_at: string;
    modified_by: string | null;
    customer: PackageOrderCustomer;
    package: PackageOrderPackageInfo;
    packageOrderItems: PackageOrderItem[];
}

/**
 * API response for creating package order
 */
export interface CreatePackageOrderResponse {
    success: boolean;
    message: string;
    data: PackageOrder;
}

/**
 * Package order state for Redux
 */
export interface PackageOrderState {
    currentOrder: PackageOrder | null;
    orders: PackageOrder[];
    orderLoading: boolean;
    ordersLoading: boolean;
    orderError: string | null;
    ordersError: string | null;
    pdfSending: boolean;
    pdfSendError: string | null;
}
