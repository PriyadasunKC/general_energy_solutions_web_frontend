// src/store/slices/orderSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { OrderService } from '../../services/orderService';
import {
    OrderState,
    Order,
    CreateOrderPayload,
    OrderQueryParams,
    Checkout,
    PaymentStatus,
    ORDER_CONSTANTS,
} from '../../types/orderTypes';
import { APIError } from '../../types/authTypes';

// Initial state
const initialState: OrderState = {
    orders: [],
    currentOrder: null,
    ordersLoading: false,
    orderLoading: false,
    ordersError: null,
    orderError: null,
    pagination: {
        page: ORDER_CONSTANTS.DEFAULT_PAGE,
        limit: ORDER_CONSTANTS.DEFAULT_LIMIT,
        total: 0,
        pages: 0,
    },
    checkoutData: null,
    isInitialized: false,
    filters: {
        page: ORDER_CONSTANTS.DEFAULT_PAGE,
        limit: ORDER_CONSTANTS.DEFAULT_LIMIT,
    },
    cancellingOrder: false,
    cancelOrderError: null,
    paymentStatus: null,
    paymentStatusLoading: false,
    paymentStatusError: null,
};

// Async thunks

/**
 * Create a new order
 */
export const createOrder = createAsyncThunk<
    { order: Order; checkout: Checkout },
    CreateOrderPayload,
    { rejectValue: APIError }
>('orders/create', async (payload, { rejectWithValue }) => {
    try {
        const response = await OrderService.createOrder(payload);
        return response.data;
    } catch (error) {
        return rejectWithValue(error as APIError);
    }
});

/**
 * Fetch all orders with pagination
 */
export const fetchOrders = createAsyncThunk<
    { orders: Order[]; pagination: OrderState['pagination'] },
    OrderQueryParams | undefined,
    { rejectValue: APIError }
>('orders/fetchAll', async (params = {}, { rejectWithValue }) => {
    try {
        const response = await OrderService.getAllOrders(params);
        return {
            orders: response.data.orders,
            pagination: response.data.pagination,
        };
    } catch (error) {
        return rejectWithValue(error as APIError);
    }
});

/**
 * Fetch order by ID
 */
export const fetchOrderById = createAsyncThunk<
    Order,
    string,
    { rejectValue: APIError }
>('orders/fetchById', async (orderId, { rejectWithValue }) => {
    try {
        const response = await OrderService.getOrderById(orderId);
        return response.data;
    } catch (error) {
        return rejectWithValue(error as APIError);
    }
});

/**
 * Fetch more orders (pagination)
 */
export const fetchMoreOrders = createAsyncThunk<
    { orders: Order[]; pagination: OrderState['pagination'] },
    void,
    { rejectValue: APIError; state: { orders: OrderState } }
>('orders/fetchMore', async (_, { rejectWithValue, getState }) => {
    try {
        const state = getState();
        const nextPage = state.orders.pagination.page + 1;

        const response = await OrderService.getAllOrders({
            page: nextPage,
            limit: state.orders.filters.limit,
            status: state.orders.filters.status,
        });

        return {
            orders: response.data.orders,
            pagination: response.data.pagination,
        };
    } catch (error) {
        return rejectWithValue(error as APIError);
    }
});

/**
 * Cancel an order
 */
export const cancelOrder = createAsyncThunk<
    Order,
    string,
    { rejectValue: APIError }
>('orders/cancel', async (orderId, { rejectWithValue }) => {
    try {
        const response = await OrderService.cancelOrder(orderId);
        return response.data;
    } catch (error) {
        return rejectWithValue(error as APIError);
    }
});

/**
 * Fetch payment status for an order
 */
export const fetchPaymentStatus = createAsyncThunk<
    PaymentStatus,
    string,
    { rejectValue: APIError }
>('orders/fetchPaymentStatus', async (orderId, { rejectWithValue }) => {
    try {
        const response = await OrderService.getPaymentStatus(orderId);
        return response.data;
    } catch (error) {
        return rejectWithValue(error as APIError);
    }
});

// Order slice
const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        // Clear errors
        clearOrderError: (state) => {
            state.orderError = null;
        },

        clearOrdersError: (state) => {
            state.ordersError = null;
        },

        clearAllOrderErrors: (state) => {
            state.orderError = null;
            state.ordersError = null;
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
            state.isInitialized = false;
            state.pagination = {
                page: ORDER_CONSTANTS.DEFAULT_PAGE,
                limit: ORDER_CONSTANTS.DEFAULT_LIMIT,
                total: 0,
                pages: 0,
            };
        },

        // Clear checkout data
        clearCheckoutData: (state) => {
            state.checkoutData = null;
        },

        // Set filters
        setOrderFilters: (state, action: PayloadAction<Partial<OrderState['filters']>>) => {
            state.filters = {
                ...state.filters,
                ...action.payload,
            };
        },

        // Reset filters
        resetOrderFilters: (state) => {
            state.filters = {
                page: ORDER_CONSTANTS.DEFAULT_PAGE,
                limit: ORDER_CONSTANTS.DEFAULT_LIMIT,
            };
        },

        // Clear cancel order error
        clearCancelOrderError: (state) => {
            state.cancelOrderError = null;
        },

        // Clear payment status error
        clearPaymentStatusError: (state) => {
            state.paymentStatusError = null;
        },

        // Clear payment status
        clearPaymentStatus: (state) => {
            state.paymentStatus = null;
            state.paymentStatusError = null;
        },
    },
    extraReducers: (builder) => {
        // Create order
        builder
            .addCase(createOrder.pending, (state) => {
                state.orderLoading = true;
                state.orderError = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.orderLoading = false;
                state.currentOrder = action.payload.order;
                state.checkoutData = action.payload.checkout;
                state.orders = [action.payload.order, ...state.orders];
                state.orderError = null;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.orderLoading = false;
                state.orderError = action.payload?.message || 'Failed to create order';
            });

        // Fetch all orders
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.ordersLoading = true;
                state.ordersError = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.ordersLoading = false;
                state.orders = action.payload.orders;
                state.pagination = action.payload.pagination;
                state.ordersError = null;
                state.isInitialized = true;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.ordersLoading = false;
                state.ordersError = action.payload?.message || 'Failed to fetch orders';
            });

        // Fetch order by ID
        builder
            .addCase(fetchOrderById.pending, (state) => {
                state.orderLoading = true;
                state.orderError = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.orderLoading = false;
                state.currentOrder = action.payload;
                state.orderError = null;

                // Update in orders list if it exists
                const index = state.orders.findIndex(
                    (order) => order.order_id === action.payload.order_id
                );
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.orderLoading = false;
                state.currentOrder = null;
                state.orderError = action.payload?.message || 'Failed to fetch order';
            });

        // Fetch more orders (pagination)
        builder
            .addCase(fetchMoreOrders.pending, (state) => {
                state.ordersLoading = true;
                state.ordersError = null;
            })
            .addCase(fetchMoreOrders.fulfilled, (state, action) => {
                state.ordersLoading = false;
                // Append new orders to existing list
                state.orders = [...state.orders, ...action.payload.orders];
                state.pagination = action.payload.pagination;
                state.ordersError = null;
            })
            .addCase(fetchMoreOrders.rejected, (state, action) => {
                state.ordersLoading = false;
                state.ordersError = action.payload?.message || 'Failed to fetch more orders';
            });

        // Cancel order
        builder
            .addCase(cancelOrder.pending, (state) => {
                state.cancellingOrder = true;
                state.cancelOrderError = null;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.cancellingOrder = false;
                state.cancelOrderError = null;

                // Update current order if it matches
                if (state.currentOrder?.order_id === action.payload.order_id) {
                    state.currentOrder = action.payload;
                }

                // Update in orders list
                const index = state.orders.findIndex(
                    (order) => order.order_id === action.payload.order_id
                );
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.cancellingOrder = false;
                state.cancelOrderError = action.payload?.message || 'Failed to cancel order';
            });

        // Fetch payment status
        builder
            .addCase(fetchPaymentStatus.pending, (state) => {
                state.paymentStatusLoading = true;
                state.paymentStatusError = null;
            })
            .addCase(fetchPaymentStatus.fulfilled, (state, action) => {
                state.paymentStatusLoading = false;
                state.paymentStatus = action.payload;
                state.paymentStatusError = null;
            })
            .addCase(fetchPaymentStatus.rejected, (state, action) => {
                state.paymentStatusLoading = false;
                state.paymentStatusError = action.payload?.message || 'Failed to fetch payment status';
            });
    },
});

// Export actions
export const {
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
} = orderSlice.actions;

// Export selectors
export const selectOrders = (state: { orders: OrderState }) =>
    state.orders.orders;
export const selectCurrentOrder = (state: { orders: OrderState }) =>
    state.orders.currentOrder;
export const selectOrdersLoading = (state: { orders: OrderState }) =>
    state.orders.ordersLoading;
export const selectOrderLoading = (state: { orders: OrderState }) =>
    state.orders.orderLoading;
export const selectOrdersError = (state: { orders: OrderState }) =>
    state.orders.ordersError;
export const selectOrderError = (state: { orders: OrderState }) =>
    state.orders.orderError;
export const selectOrderPagination = (state: { orders: OrderState }) =>
    state.orders.pagination;
export const selectCheckoutData = (state: { orders: OrderState }) =>
    state.orders.checkoutData;
export const selectOrdersInitialized = (state: { orders: OrderState }) =>
    state.orders.isInitialized;
export const selectOrderFilters = (state: { orders: OrderState }) =>
    state.orders.filters;
export const selectCancellingOrder = (state: { orders: OrderState }) =>
    state.orders.cancellingOrder;
export const selectCancelOrderError = (state: { orders: OrderState }) =>
    state.orders.cancelOrderError;
export const selectPaymentStatus = (state: { orders: OrderState }) =>
    state.orders.paymentStatus;
export const selectPaymentStatusLoading = (state: { orders: OrderState }) =>
    state.orders.paymentStatusLoading;
export const selectPaymentStatusError = (state: { orders: OrderState }) =>
    state.orders.paymentStatusError;

// Export reducer
export default orderSlice.reducer;
