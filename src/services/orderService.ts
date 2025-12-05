// src/services/orderService.ts
import { apiClient } from './apiClient';
import {
    Order,
    CreateOrderPayload,
    OrderQueryParams,
    CreateOrderResponse,
    OrdersResponse,
    OrderResponse,
    CancelOrderResponse,
    PaymentStatusResponse,
    OrderStatus,
    ORDER_ENDPOINTS,
    ORDER_STATUS_COLORS,
    PAYMENT_STATUS_COLORS,
    ORDER_CONSTANTS,
} from '../types/orderTypes';

/**
 * Order Service
 * Handles all product order-related API calls
 */
export class OrderService {
    /**
     * Create a new product order
     */
    static async createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
        try {
            const response = await apiClient.post<CreateOrderResponse>(
                ORDER_ENDPOINTS.CREATE,
                payload
            );
            return response;
        } catch (error) {
            console.error('Failed to create order:', error);
            throw error;
        }
    }

    /**
     * Get all orders for the current user with pagination
     */
    static async getAllOrders(params: OrderQueryParams = {}): Promise<OrdersResponse> {
        try {
            const queryParams = new URLSearchParams();

            if (params.page) {
                queryParams.set('page', params.page.toString());
            }
            if (params.limit) {
                queryParams.set('limit', params.limit.toString());
            }
            if (params.status) {
                queryParams.set('status', params.status);
            }

            const queryString = queryParams.toString();
            const url = `${ORDER_ENDPOINTS.GET_ALL}${queryString ? `?${queryString}` : ''}`;

            const response = await apiClient.get<OrdersResponse>(url);
            return response;
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            throw error;
        }
    }

    /**
     * Get order by ID
     */
    static async getOrderById(orderId: string): Promise<OrderResponse> {
        try {
            if (!orderId) {
                throw new Error('Order ID is required');
            }

            const response = await apiClient.get<OrderResponse>(
                ORDER_ENDPOINTS.GET_BY_ID(orderId)
            );
            return response;
        } catch (error) {
            console.error(`Failed to fetch order ${orderId}:`, error);
            throw error;
        }
    }

    /**
     * Cancel an order
     */
    static async cancelOrder(orderId: string): Promise<CancelOrderResponse> {
        try {
            if (!orderId) {
                throw new Error('Order ID is required');
            }

            const response = await apiClient.patch<CancelOrderResponse>(
                ORDER_ENDPOINTS.CANCEL(orderId)
            );
            return response;
        } catch (error) {
            console.error(`Failed to cancel order ${orderId}:`, error);
            throw error;
        }
    }

    /**
     * Get payment status for an order
     */
    static async getPaymentStatus(orderId: string): Promise<PaymentStatusResponse> {
        try {
            if (!orderId) {
                throw new Error('Order ID is required');
            }

            const response = await apiClient.get<PaymentStatusResponse>(
                ORDER_ENDPOINTS.GET_PAYMENT_STATUS(orderId)
            );
            return response;
        } catch (error) {
            console.error(`Failed to fetch payment status for order ${orderId}:`, error);
            throw error;
        }
    }

    /**
     * Format order total price for display
     */
    static formatOrderTotal(order: Order): string {
        const total = parseFloat(order.total_price);
        return `LKR ${total.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    }

    /**
     * Format order price as number
     */
    static getOrderTotalAsNumber(order: Order): number {
        return parseFloat(order.total_price);
    }

    /**
     * Get order status color
     */
    static getOrderStatusColor(status: OrderStatus): string {
        return ORDER_STATUS_COLORS[status] || '#6b7280';
    }

    /**
     * Get payment status color
     */
    static getPaymentStatusColor(status: string): string {
        return PAYMENT_STATUS_COLORS[status as keyof typeof PAYMENT_STATUS_COLORS] || '#6b7280';
    }

    /**
     * Check if order can be cancelled
     */
    static canCancelOrder(order: Order): boolean {
        return ORDER_CONSTANTS.CANCELABLE_STATUSES.includes(order.status);
    }

    /**
     * Format order date for display
     */
    static formatOrderDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    /**
     * Format order date (short format)
     */
    static formatOrderDateShort(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    }

    /**
     * Get order status label
     */
    static getOrderStatusLabel(status: OrderStatus): string {
        const labels: Record<OrderStatus, string> = {
            pending: 'Pending',
            confirmed: 'Confirmed',
            completed: 'Completed',
            cancelled: 'Cancelled',
        };
        return labels[status] || status;
    }

    /**
     * Get payment status label
     */
    static getPaymentStatusLabel(isPaymentSuccess: boolean): string {
        return isPaymentSuccess ? 'Paid' : 'Pending Payment';
    }

    /**
     * Calculate total items in order
     */
    static getTotalItems(order: Order): number {
        return order.orderProducts.reduce((total, product) => total + product.quantity, 0);
    }

    /**
     * Get order summary text
     */
    static getOrderSummary(order: Order): string {
        const itemCount = this.getTotalItems(order);
        const total = this.formatOrderTotal(order);
        const itemText = itemCount === 1 ? 'item' : 'items';
        return `${itemCount} ${itemText} - ${total}`;
    }

    /**
     * Check if order has payment information
     */
    static hasPaymentInfo(order: Order): boolean {
        return order.payment !== null;
    }

    /**
     * Check if order is paid
     */
    static isOrderPaid(order: Order): boolean {
        return order.is_payment_success;
    }

    /**
     * Check if order is pending
     */
    static isOrderPending(order: Order): boolean {
        return order.status === 'pending';
    }

    /**
     * Check if order is confirmed
     */
    static isOrderConfirmed(order: Order): boolean {
        return order.status === 'confirmed';
    }

    /**
     * Check if order is completed
     */
    static isOrderCompleted(order: Order): boolean {
        return order.status === 'completed';
    }

    /**
     * Check if order is cancelled
     */
    static isOrderCancelled(order: Order): boolean {
        return order.status === 'cancelled';
    }

    /**
     * Filter orders by status
     */
    static filterOrdersByStatus(orders: Order[], status: OrderStatus): Order[] {
        return orders.filter((order) => order.status === status);
    }

    /**
     * Sort orders by date (newest first)
     */
    static sortOrdersByDate(orders: Order[], ascending = false): Order[] {
        return [...orders].sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return ascending ? dateA - dateB : dateB - dateA;
        });
    }

    /**
     * Get order type label
     */
    static getOrderTypeLabel(order: Order): string {
        return order.type === 'product' ? 'Product Order' : 'Package Order';
    }

    /**
     * Get payment method label
     */
    static getPaymentMethodLabel(paymentType: string): string {
        const labels: Record<string, string> = {
            card: 'Card Payment',
            cash: 'Cash on Delivery',
        };
        return labels[paymentType] || paymentType;
    }

    /**
     * Format product price
     */
    static formatProductPrice(price: string): string {
        const priceNum = parseFloat(price);
        return `LKR ${priceNum.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    }

    /**
     * Calculate product subtotal
     */
    static calculateProductSubtotal(price: string, quantity: number): string {
        const priceNum = parseFloat(price);
        const subtotal = priceNum * quantity;
        return subtotal.toFixed(2);
    }

    /**
     * Get first product image
     */
    static getFirstProductImage(order: Order): string | null {
        if (order.orderProducts.length > 0 && order.orderProducts[0].image_urls.length > 0) {
            return order.orderProducts[0].image_urls[0];
        }
        return null;
    }

    /**
     * Validate order payload before submission
     */
    static validateOrderPayload(payload: CreateOrderPayload): {
        isValid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];

        if (!payload.products || payload.products.length === 0) {
            errors.push('At least one product is required');
        }

        if (!payload.address || !payload.address.trim()) {
            errors.push('Delivery address is required');
        }

        if (!payload.customer_info) {
            errors.push('Customer information is required');
        } else {
            if (!payload.customer_info.first_name) {
                errors.push('First name is required');
            }
            if (!payload.customer_info.last_name) {
                errors.push('Last name is required');
            }
            if (!payload.customer_info.email) {
                errors.push('Email is required');
            }
            if (!payload.customer_info.phone) {
                errors.push('Phone number is required');
            }
            if (!payload.customer_info.city) {
                errors.push('City is required');
            }
            if (!payload.customer_info.country) {
                errors.push('Country is required');
            }
        }

        payload.products.forEach((product, index) => {
            if (!product.product_id) {
                errors.push(`Product ${index + 1}: Product ID is required`);
            }
            if (!product.quantity || product.quantity <= 0) {
                errors.push(`Product ${index + 1}: Valid quantity is required`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors,
        };
    }
}

export default OrderService;
