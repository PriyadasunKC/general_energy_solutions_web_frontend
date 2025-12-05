// src/hooks/orderHook.ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import {
    createOrder,
    fetchOrders,
    fetchOrderById,
    fetchMoreOrders,
    cancelOrder,
    fetchPaymentStatus,
    clearOrderError,
    clearOrdersError,
    clearAllOrderErrors,
    clearCurrentOrder,
    clearOrders,
    clearCheckoutData,
    setOrderFilters,
    resetOrderFilters,
    clearCancelOrderError,
    clearPaymentStatusError,
    clearPaymentStatus,
    selectOrders,
    selectCurrentOrder,
    selectOrdersLoading,
    selectOrderLoading,
    selectOrdersError,
    selectOrderError,
    selectOrderPagination,
    selectCheckoutData,
    selectOrdersInitialized,
    selectOrderFilters,
    selectCancellingOrder,
    selectCancelOrderError,
    selectPaymentStatus,
    selectPaymentStatusLoading,
    selectPaymentStatusError,
} from '../store/slices/orderSlice';
import { OrderService } from '../services/orderService';
import {
    Order,
    CreateOrderPayload,
    OrderQueryParams,
    OrderStatus,
    Checkout,
    PaymentStatus,
} from '../types/orderTypes';

/**
 * Custom hook for order management
 */
export const useOrders = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Selectors
    const orders = useSelector((state: RootState) => selectOrders(state));
    const currentOrder = useSelector((state: RootState) => selectCurrentOrder(state));
    const ordersLoading = useSelector((state: RootState) => selectOrdersLoading(state));
    const orderLoading = useSelector((state: RootState) => selectOrderLoading(state));
    const ordersError = useSelector((state: RootState) => selectOrdersError(state));
    const orderError = useSelector((state: RootState) => selectOrderError(state));
    const pagination = useSelector((state: RootState) => selectOrderPagination(state));
    const checkoutData = useSelector((state: RootState) => selectCheckoutData(state));
    const isInitialized = useSelector((state: RootState) => selectOrdersInitialized(state));
    const filters = useSelector((state: RootState) => selectOrderFilters(state));
    const cancellingOrder = useSelector((state: RootState) => selectCancellingOrder(state));
    const cancelOrderError = useSelector((state: RootState) => selectCancelOrderError(state));
    const paymentStatus = useSelector((state: RootState) => selectPaymentStatus(state));
    const paymentStatusLoading = useSelector((state: RootState) => selectPaymentStatusLoading(state));
    const paymentStatusError = useSelector((state: RootState) => selectPaymentStatusError(state));

    /**
     * Create a new order
     */
    const placeOrder = useCallback(
        async (payload: CreateOrderPayload): Promise<{ order: Order; checkout: Checkout }> => {
            return await dispatch(createOrder(payload)).unwrap();
        },
        [dispatch]
    );

    /**
     * Fetch all orders with optional filters
     */
    const fetchAllOrders = useCallback(
        async (params?: OrderQueryParams): Promise<Order[]> => {
            const result = await dispatch(fetchOrders(params)).unwrap();
            return result.orders;
        },
        [dispatch]
    );

    /**
     * Fetch a specific order by ID
     */
    const fetchOrder = useCallback(
        async (orderId: string): Promise<Order> => {
            return await dispatch(fetchOrderById(orderId)).unwrap();
        },
        [dispatch]
    );

    /**
     * Load more orders (pagination)
     */
    const loadMoreOrders = useCallback(async (): Promise<Order[]> => {
        const result = await dispatch(fetchMoreOrders()).unwrap();
        return result.orders;
    }, [dispatch]);

    /**
     * Cancel an order
     */
    const cancelOrderAction = useCallback(
        async (orderId: string): Promise<Order> => {
            return await dispatch(cancelOrder(orderId)).unwrap();
        },
        [dispatch]
    );

    /**
     * Fetch payment status for an order
     */
    const fetchPaymentStatusAction = useCallback(
        async (orderId: string): Promise<PaymentStatus> => {
            return await dispatch(fetchPaymentStatus(orderId)).unwrap();
        },
        [dispatch]
    );

    /**
     * Clear all errors
     */
    const clearErrors = useCallback(() => {
        dispatch(clearAllOrderErrors());
    }, [dispatch]);

    /**
     * Clear order error only
     */
    const clearOrderErrorOnly = useCallback(() => {
        dispatch(clearOrderError());
    }, [dispatch]);

    /**
     * Clear orders error only
     */
    const clearOrdersErrorOnly = useCallback(() => {
        dispatch(clearOrdersError());
    }, [dispatch]);

    /**
     * Clear current order
     */
    const clearCurrent = useCallback(() => {
        dispatch(clearCurrentOrder());
    }, [dispatch]);

    /**
     * Clear all orders
     */
    const clearAll = useCallback(() => {
        dispatch(clearOrders());
    }, [dispatch]);

    /**
     * Clear checkout data
     */
    const clearCheckout = useCallback(() => {
        dispatch(clearCheckoutData());
    }, [dispatch]);

    /**
     * Clear cancel order error
     */
    const clearCancelError = useCallback(() => {
        dispatch(clearCancelOrderError());
    }, [dispatch]);

    /**
     * Clear payment status error
     */
    const clearPaymentError = useCallback(() => {
        dispatch(clearPaymentStatusError());
    }, [dispatch]);

    /**
     * Clear payment status data
     */
    const clearPaymentStatusData = useCallback(() => {
        dispatch(clearPaymentStatus());
    }, [dispatch]);

    /**
     * Set order filters
     */
    const setFilters = useCallback(
        (newFilters: Partial<typeof filters>) => {
            dispatch(setOrderFilters(newFilters));
        },
        [dispatch]
    );

    /**
     * Reset order filters
     */
    const resetFilters = useCallback(() => {
        dispatch(resetOrderFilters());
    }, [dispatch]);

    /**
     * Format order total
     */
    const formatOrderTotal = useCallback((order: Order): string => {
        return OrderService.formatOrderTotal(order);
    }, []);

    /**
     * Get order status color
     */
    const getOrderStatusColor = useCallback((status: OrderStatus): string => {
        return OrderService.getOrderStatusColor(status);
    }, []);

    /**
     * Get payment status color
     */
    const getPaymentStatusColor = useCallback((status: string): string => {
        return OrderService.getPaymentStatusColor(status);
    }, []);

    /**
     * Check if order can be cancelled
     */
    const canCancelOrder = useCallback((order: Order): boolean => {
        return OrderService.canCancelOrder(order);
    }, []);

    /**
     * Check if there are more pages to load
     */
    const hasNextPage = useCallback((): boolean => {
        return pagination.page < pagination.pages;
    }, [pagination]);

    return {
        // State
        orders,
        currentOrder,
        ordersLoading,
        orderLoading,
        ordersError,
        orderError,
        pagination,
        checkoutData,
        isInitialized,
        filters,
        cancellingOrder,
        cancelOrderError,
        paymentStatus,
        paymentStatusLoading,
        paymentStatusError,

        // Actions
        placeOrder,
        fetchAllOrders,
        fetchOrder,
        loadMoreOrders,
        cancelOrder: cancelOrderAction,
        fetchPaymentStatus: fetchPaymentStatusAction,
        clearErrors,
        clearOrderErrorOnly,
        clearOrdersErrorOnly,
        clearCurrent,
        clearAll,
        clearCheckout,
        clearCancelError,
        clearPaymentError,
        clearPaymentStatusData,
        setFilters,
        resetFilters,

        // Utilities
        formatOrderTotal,
        getOrderStatusColor,
        getPaymentStatusColor,
        canCancelOrder,
        hasNextPage,
    };
};

/**
 * Hook for current order only
 */
export const useCurrentOrder = () => {
    const dispatch = useDispatch<AppDispatch>();
    const currentOrder = useSelector((state: RootState) => selectCurrentOrder(state));
    const orderLoading = useSelector((state: RootState) => selectOrderLoading(state));
    const orderError = useSelector((state: RootState) => selectOrderError(state));

    const fetchOrder = useCallback(
        async (orderId: string): Promise<Order> => {
            return await dispatch(fetchOrderById(orderId)).unwrap();
        },
        [dispatch]
    );

    const clearOrder = useCallback(() => {
        dispatch(clearCurrentOrder());
    }, [dispatch]);

    return {
        currentOrder,
        orderLoading,
        orderError,
        fetchOrder,
        clearOrder,
    };
};

/**
 * Hook for order pagination
 */
export const useOrderPagination = () => {
    const dispatch = useDispatch<AppDispatch>();
    const pagination = useSelector((state: RootState) => selectOrderPagination(state));
    const ordersLoading = useSelector((state: RootState) => selectOrdersLoading(state));

    const loadMore = useCallback(async (): Promise<Order[]> => {
        const result = await dispatch(fetchMoreOrders()).unwrap();
        return result.orders;
    }, [dispatch]);

    const hasNextPage = useCallback((): boolean => {
        return pagination.page < pagination.pages;
    }, [pagination]);

    return {
        pagination,
        ordersLoading,
        loadMore,
        hasNextPage,
    };
};

export default useOrders;
