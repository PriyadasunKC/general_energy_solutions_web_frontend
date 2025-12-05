// src/hooks/packageOrderHook.ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import {
    createPackageOrder,
    fetchPackageOrders,
    fetchPackageOrderById,
    cancelPackageOrder,
    clearOrderError,
    clearOrdersError,
    clearAllOrderErrors,
    clearCurrentOrder,
    clearOrders,
    selectCurrentOrder,
    selectOrders,
    selectOrderLoading,
    selectOrdersLoading,
    selectOrderError,
    selectOrdersError,
} from '../store/slices/packageOrderSlice';
import { CreatePackageOrderPayload, PackageOrder } from '../types/packageOrderTypes';

/**
 * Custom hook for package order management
 */
export const usePackageOrders = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Selectors
    const currentOrder = useSelector((state: RootState) => selectCurrentOrder(state));
    const orders = useSelector((state: RootState) => selectOrders(state));
    const orderLoading = useSelector((state: RootState) => selectOrderLoading(state));
    const ordersLoading = useSelector((state: RootState) => selectOrdersLoading(state));
    const orderError = useSelector((state: RootState) => selectOrderError(state));
    const ordersError = useSelector((state: RootState) => selectOrdersError(state));

    /**
     * Create a new package order
     */
    const placeOrder = useCallback(
        async (payload: CreatePackageOrderPayload): Promise<PackageOrder> => {
            return await dispatch(createPackageOrder(payload)).unwrap();
        },
        [dispatch]
    );

    /**
     * Fetch all package orders for the user
     */
    const fetchAllOrders = useCallback(async (): Promise<PackageOrder[]> => {
        return await dispatch(fetchPackageOrders()).unwrap();
    }, [dispatch]);

    /**
     * Fetch a specific order by ID
     */
    const fetchOrderById = useCallback(
        async (orderId: string): Promise<PackageOrder> => {
            return await dispatch(fetchPackageOrderById(orderId)).unwrap();
        },
        [dispatch]
    );

    /**
     * Cancel an order
     */
    const cancelOrder = useCallback(
        async (orderId: string): Promise<PackageOrder> => {
            return await dispatch(cancelPackageOrder(orderId)).unwrap();
        },
        [dispatch]
    );

    /**
     * Clear error states
     */
    const clearErrors = useCallback(() => {
        dispatch(clearAllOrderErrors());
    }, [dispatch]);

    const clearOrderErrorOnly = useCallback(() => {
        dispatch(clearOrderError());
    }, [dispatch]);

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
    const clearAllOrders = useCallback(() => {
        dispatch(clearOrders());
    }, [dispatch]);

    return {
        // State
        currentOrder,
        orders,
        orderLoading,
        ordersLoading,
        orderError,
        ordersError,

        // Actions
        placeOrder,
        fetchAllOrders,
        fetchOrderById,
        cancelOrder,
        clearErrors,
        clearOrderErrorOnly,
        clearOrdersErrorOnly,
        clearCurrent,
        clearAllOrders,
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
        async (orderId: string): Promise<PackageOrder> => {
            return await dispatch(fetchPackageOrderById(orderId)).unwrap();
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

export default usePackageOrders;
