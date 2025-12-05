// src/store/slices/packageOrderSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PackageOrderService } from '../../services/packageOrderService';
import {
    PackageOrderState,
    PackageOrder,
    CreatePackageOrderPayload,
} from '../../types/packageOrderTypes';
import { APIError } from '../../types/authTypes';

// Initial state
const initialState: PackageOrderState = {
    currentOrder: null,
    orders: [],
    orderLoading: false,
    ordersLoading: false,
    orderError: null,
    ordersError: null,
    pdfSending: false,
    pdfSendError: null,
};

// Async thunks

/**
 * Create package order
 */
export const createPackageOrder = createAsyncThunk<
    PackageOrder,
    CreatePackageOrderPayload,
    { rejectValue: APIError }
>('packageOrders/create', async (payload, { rejectWithValue }) => {
    try {
        const response = await PackageOrderService.createPackageOrder(payload);
        return response.data;
    } catch (error) {
        return rejectWithValue(error as APIError);
    }
});

/**
 * Fetch all package orders
 */
export const fetchPackageOrders = createAsyncThunk<
    PackageOrder[],
    void,
    { rejectValue: APIError }
>('packageOrders/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await PackageOrderService.getAllPackageOrders();
        return response.data;
    } catch (error) {
        return rejectWithValue(error as APIError);
    }
});

/**
 * Fetch package order by ID
 */
export const fetchPackageOrderById = createAsyncThunk<
    PackageOrder,
    string,
    { rejectValue: APIError }
>('packageOrders/fetchById', async (orderId, { rejectWithValue }) => {
    try {
        const response = await PackageOrderService.getPackageOrderById(orderId);
        return response.data;
    } catch (error) {
        return rejectWithValue(error as APIError);
    }
});

/**
 * Cancel package order
 */
export const cancelPackageOrder = createAsyncThunk<
    PackageOrder,
    string,
    { rejectValue: APIError }
>('packageOrders/cancel', async (orderId, { rejectWithValue }) => {
    try {
        const response = await PackageOrderService.cancelPackageOrder(orderId);
        return response.data;
    } catch (error) {
        return rejectWithValue(error as APIError);
    }
});

/**
 * Send package order PDF via email
 */
export const sendPackageOrderPDF = createAsyncThunk<
    {
        success: boolean;
        message: string;
        sentTo: string;
        ccTo: string;
    },
    {
        orderId: string;
        pdfBase64: string;
        pdfFileName: string;
    },
    { rejectValue: APIError }
>('packageOrders/sendPDF', async ({ orderId, pdfBase64, pdfFileName }, { rejectWithValue }) => {
    try {
        const response = await PackageOrderService.sendPackageOrderPDF(
            orderId,
            pdfBase64,
            pdfFileName
        );
        return response.data;
    } catch (error) {
        return rejectWithValue(error as APIError);
    }
});

// Package order slice
const packageOrderSlice = createSlice({
    name: 'packageOrders',
    initialState,
    reducers: {
        // Clear errors
        clearOrderError: (state) => {
            state.orderError = null;
        },

        clearOrdersError: (state) => {
            state.ordersError = null;
        },

        clearPdfSendError: (state) => {
            state.pdfSendError = null;
        },

        clearAllOrderErrors: (state) => {
            state.orderError = null;
            state.ordersError = null;
            state.pdfSendError = null;
        },

        // Clear current order
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
            state.orderError = null;
        },

        // Clear all orders
        clearOrders: (state) => {
            state.orders = [];
            state.ordersError = null;
        },
    },
    extraReducers: (builder) => {
        // Create package order
        builder
            .addCase(createPackageOrder.pending, (state) => {
                state.orderLoading = true;
                state.orderError = null;
            })
            .addCase(createPackageOrder.fulfilled, (state, action) => {
                state.orderLoading = false;
                state.currentOrder = action.payload;
                state.orders = [action.payload, ...state.orders];
                state.orderError = null;
            })
            .addCase(createPackageOrder.rejected, (state, action) => {
                state.orderLoading = false;
                state.orderError = action.payload?.message || 'Failed to create order';
            });

        // Fetch all package orders
        builder
            .addCase(fetchPackageOrders.pending, (state) => {
                state.ordersLoading = true;
                state.ordersError = null;
            })
            .addCase(fetchPackageOrders.fulfilled, (state, action) => {
                state.ordersLoading = false;
                state.orders = action.payload;
                state.ordersError = null;
            })
            .addCase(fetchPackageOrders.rejected, (state, action) => {
                state.ordersLoading = false;
                state.ordersError = action.payload?.message || 'Failed to fetch orders';
            });

        // Fetch package order by ID
        builder
            .addCase(fetchPackageOrderById.pending, (state) => {
                state.orderLoading = true;
                state.orderError = null;
            })
            .addCase(fetchPackageOrderById.fulfilled, (state, action) => {
                state.orderLoading = false;
                state.currentOrder = action.payload;
                state.orderError = null;
            })
            .addCase(fetchPackageOrderById.rejected, (state, action) => {
                state.orderLoading = false;
                state.currentOrder = null;
                state.orderError = action.payload?.message || 'Failed to fetch order';
            });

        // Cancel package order
        builder
            .addCase(cancelPackageOrder.pending, (state) => {
                state.orderLoading = true;
                state.orderError = null;
            })
            .addCase(cancelPackageOrder.fulfilled, (state, action) => {
                state.orderLoading = false;
                state.currentOrder = action.payload;
                // Update in orders list
                const index = state.orders.findIndex(
                    (order) => order.package_order_id === action.payload.package_order_id
                );
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
                state.orderError = null;
            })
            .addCase(cancelPackageOrder.rejected, (state, action) => {
                state.orderLoading = false;
                state.orderError = action.payload?.message || 'Failed to cancel order';
            });

        // Send package order PDF
        builder
            .addCase(sendPackageOrderPDF.pending, (state) => {
                state.pdfSending = true;
                state.pdfSendError = null;
            })
            .addCase(sendPackageOrderPDF.fulfilled, (state) => {
                state.pdfSending = false;
                state.pdfSendError = null;
            })
            .addCase(sendPackageOrderPDF.rejected, (state, action) => {
                state.pdfSending = false;
                state.pdfSendError = action.payload?.message || 'Failed to send PDF email';
            });
    },
});

// Export actions
export const {
    clearOrderError,
    clearOrdersError,
    clearPdfSendError,
    clearAllOrderErrors,
    clearCurrentOrder,
    clearOrders,
} = packageOrderSlice.actions;

// Export selectors
export const selectCurrentOrder = (state: { packageOrders: PackageOrderState }) =>
    state.packageOrders.currentOrder;
export const selectOrders = (state: { packageOrders: PackageOrderState }) =>
    state.packageOrders.orders;
export const selectOrderLoading = (state: { packageOrders: PackageOrderState }) =>
    state.packageOrders.orderLoading;
export const selectOrdersLoading = (state: { packageOrders: PackageOrderState }) =>
    state.packageOrders.ordersLoading;
export const selectOrderError = (state: { packageOrders: PackageOrderState }) =>
    state.packageOrders.orderError;
export const selectOrdersError = (state: { packageOrders: PackageOrderState }) =>
    state.packageOrders.ordersError;
export const selectPdfSending = (state: { packageOrders: PackageOrderState }) =>
    state.packageOrders.pdfSending;
export const selectPdfSendError = (state: { packageOrders: PackageOrderState }) =>
    state.packageOrders.pdfSendError;

// Export reducer
export default packageOrderSlice.reducer;
