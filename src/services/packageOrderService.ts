// src/services/packageOrderService.ts
import { apiClient } from './apiClient';
import {
    CreatePackageOrderPayload,
    CreatePackageOrderResponse,
    PackageOrder,
} from '../types/packageOrderTypes';

const PACKAGE_ORDER_ENDPOINTS = {
    CREATE: '/api/package-orders',
    GET_ALL: '/api/package-orders',
    GET_BY_ID: (orderId: string) => `/api/package-orders/${orderId}`,
    CANCEL: (orderId: string) => `/api/package-orders/${orderId}/cancel`,
    SEND_PDF: (orderId: string) => `/api/package-orders/${orderId}/send-pdf`,
};

export class PackageOrderService {
    /**
     * Create a new package order
     */
    static async createPackageOrder(
        payload: CreatePackageOrderPayload
    ): Promise<CreatePackageOrderResponse> {
        try {
            const response = await apiClient.post<CreatePackageOrderResponse>(
                PACKAGE_ORDER_ENDPOINTS.CREATE,
                payload
            );
            return response;
        } catch (error) {
            console.error('Error creating package order:', error);
            throw error;
        }
    }

    /**
     * Get all package orders for current user
     */
    static async getAllPackageOrders(): Promise<{ success: boolean; data: PackageOrder[] }> {
        try {
            const response = await apiClient.get<{ success: boolean; data: PackageOrder[] }>(
                PACKAGE_ORDER_ENDPOINTS.GET_ALL
            );
            return response;
        } catch (error) {
            console.error('Error fetching package orders:', error);
            throw error;
        }
    }

    /**
     * Get package order by ID
     */
    static async getPackageOrderById(
        orderId: string
    ): Promise<{ success: boolean; data: PackageOrder }> {
        try {
            const response = await apiClient.get<{ success: boolean; data: PackageOrder }>(
                PACKAGE_ORDER_ENDPOINTS.GET_BY_ID(orderId)
            );
            return response;
        } catch (error) {
            console.error('Error fetching package order:', error);
            throw error;
        }
    }

    /**
     * Cancel package order
     */
    static async cancelPackageOrder(
        orderId: string
    ): Promise<{ success: boolean; message: string; data: PackageOrder }> {
        try {
            const response = await apiClient.patch<{
                success: boolean;
                message: string;
                data: PackageOrder;
            }>(PACKAGE_ORDER_ENDPOINTS.CANCEL(orderId));
            return response;
        } catch (error) {
            console.error('Error cancelling package order:', error);
            throw error;
        }
    }

    /**
     * Send package order PDF via email
     */
    static async sendPackageOrderPDF(
        orderId: string,
        pdfBase64: string,
        pdfFileName: string
    ): Promise<{
        success: boolean;
        message: string;
        data: {
            success: boolean;
            message: string;
            sentTo: string;
            ccTo: string;
        };
    }> {
        try {
            const response = await apiClient.post<{
                success: boolean;
                message: string;
                data: {
                    success: boolean;
                    message: string;
                    sentTo: string;
                    ccTo: string;
                };
            }>(PACKAGE_ORDER_ENDPOINTS.SEND_PDF(orderId), {
                pdfBase64,
                pdfFileName,
            });
            return response;
        } catch (error) {
            console.error('Error sending package order PDF:', error);
            throw error;
        }
    }

    /**
     * Format order for display
     */
    static formatOrderForDisplay(order: PackageOrder): string {
        const items = order.packageOrderItems.length;
        const total = parseFloat(order.total_price);
        const formattedTotal = `LKR ${total.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

        return `Order ${order.package_code} - ${items} item(s) - ${formattedTotal}`;
    }

    /**
     * Check if order can be cancelled
     */
    static canCancelOrder(order: PackageOrder): boolean {
        return order.order_status === 'pending' || order.order_status === 'confirmed';
    }

    /**
     * Get order status color
     */
    static getOrderStatusColor(status: string): string {
        switch (status) {
            case 'pending':
                return '#f59e0b'; // warning/orange
            case 'confirmed':
                return '#3b82f6'; // blue
            case 'processing':
                return '#8b5cf6'; // purple
            case 'completed':
                return '#22c55e'; // green
            case 'cancelled':
                return '#ef4444'; // red
            default:
                return '#6b7280'; // gray
        }
    }

    /**
     * Get payment status color
     */
    static getPaymentStatusColor(status: string): string {
        switch (status) {
            case 'pending':
                return '#f59e0b'; // warning/orange
            case 'completed':
                return '#22c55e'; // green
            case 'failed':
                return '#ef4444'; // red
            case 'refunded':
                return '#6b7280'; // gray
            default:
                return '#6b7280'; // gray
        }
    }
}
