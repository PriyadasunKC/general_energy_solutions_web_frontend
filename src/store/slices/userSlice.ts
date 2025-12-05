// src/store/slices/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { WritableDraft } from 'immer';
import { UserService } from '../../services/userService';
import {
    UserState,
    ShoppingCart,
    CartItem,
    CreateCartRequest,
    CartQueryParams,
    CartTotals,
    CartItemCalculation,
} from '../../types/userTypes';
import { APIError } from '../../types/authTypes';

// Initial cart totals
const initialCartTotals: CartTotals = {
    subtotal: 0,
    totalOriginalPrice: 0,
    totalSavings: 0,
    totalItems: 0,
    totalQuantity: 0,
};

// Initial state
const initialState: UserState = {
    // Shopping cart
    cart: null,
    cartLoading: false,
    cartError: null,

    // Cart operations
    addingToCart: false,
    updatingCartItem: false,
    removingFromCart: {}, // Changed to object to track individual items: { [cartItemId]: boolean }
    cartOperationError: null,

    // Cart calculations
    cartTotals: initialCartTotals,
    cartCalculations: [],

    // UI state
    isCartInitialized: false,
    cartSidebarOpen: false,
    recentlyAddedItem: null,
};

// Helper function to update cart calculations
const recalculateCartTotals = (state: WritableDraft<UserState>): void => {
    state.cartTotals = UserService.calculateCartTotals(state.cart);
    state.cartCalculations = UserService.calculateCartItemDetails(state.cart);
};

// Async thunks for cart actions

/**
 * Fetch user's shopping cart
 */
export const fetchCart = createAsyncThunk(
    'user/fetchCart',
    async (params: CartQueryParams | undefined, { rejectWithValue }) => {
        try {
            const response = await UserService.fetchCart(params || {});
            return response.data;
        } catch (error) {
            return rejectWithValue(error as APIError);
        }
    }
);

/**
 * Create cart with initial items
 */
export const createCart = createAsyncThunk(
    'user/createCart',
    async (items: CreateCartRequest[], { rejectWithValue }) => {
        try {
            const response = await UserService.createCart(items);
            return response.data;
        } catch (error) {
            return rejectWithValue(error as APIError);
        }
    }
);

/**
 * Add item to cart
 */
export const addToCart = createAsyncThunk(
    'user/addToCart',
    async (payload: { productId: string; quantity: number }, { rejectWithValue }) => {
        try {
            const response = await UserService.addToCart(payload.productId, payload.quantity);
            return response.data.cartItem;
        } catch (error) {
            return rejectWithValue(error as APIError);
        }
    }
);

/**
 * Update cart item quantity
 */
export const updateCartItem = createAsyncThunk(
    'user/updateCartItem',
    async (payload: { cartItemId: string; quantity: number }, { rejectWithValue }) => {
        try {
            const response = await UserService.updateCartItem(payload.cartItemId, payload.quantity);
            return response.data;
        } catch (error) {
            return rejectWithValue(error as APIError);
        }
    }
);

/**
 * Remove item from cart
 */
export const removeFromCart = createAsyncThunk(
    'user/removeFromCart',
    async (cartItemId: string, { rejectWithValue }) => {
        try {
            await UserService.removeFromCart(cartItemId);
            return cartItemId;
        } catch (error) {
            return rejectWithValue(error as APIError);
        }
    }
);

// User slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Clear cart errors
        clearCartError: (state) => {
            state.cartError = null;
        },

        clearCartOperationError: (state) => {
            state.cartOperationError = null;
        },

        clearAllCartErrors: (state) => {
            state.cartError = null;
            state.cartOperationError = null;
        },

        // Clear cart
        clearCart: (state) => {
            state.cart = null;
            state.cartTotals = initialCartTotals;
            state.cartCalculations = [];
            state.cartError = null;
            state.recentlyAddedItem = null;
        },

        // Cart sidebar management
        toggleCartSidebar: (state) => {
            state.cartSidebarOpen = !state.cartSidebarOpen;
        },

        openCartSidebar: (state) => {
            state.cartSidebarOpen = true;
        },

        closeCartSidebar: (state) => {
            state.cartSidebarOpen = false;
        },

        // Recently added item management
        setRecentlyAddedItem: (state, action: PayloadAction<CartItem>) => {
            state.recentlyAddedItem = action.payload;
        },

        clearRecentlyAddedItem: (state) => {
            state.recentlyAddedItem = null;
        },

        // Loading states
        setCartLoading: (state, action: PayloadAction<boolean>) => {
            state.cartLoading = action.payload;
        },

        setAddingToCart: (state, action: PayloadAction<boolean>) => {
            state.addingToCart = action.payload;
        },

        setUpdatingCartItem: (state, action: PayloadAction<boolean>) => {
            state.updatingCartItem = action.payload;
        },

        setRemovingFromCart: (state, action: PayloadAction<{ cartItemId: string; isRemoving: boolean }>) => {
            const { cartItemId, isRemoving } = action.payload;
            if (isRemoving) {
                state.removingFromCart[cartItemId] = true;
            } else {
                delete state.removingFromCart[cartItemId];
            }
        },

        // Mark cart as initialized
        setCartInitialized: (state, action: PayloadAction<boolean>) => {
            state.isCartInitialized = action.payload;
        },

        // Manually update cart calculations (useful when product data changes)
        updateCartCalculations: (state) => {
            recalculateCartTotals(state);
        },

        // Update cart item locally (optimistic update)
        updateCartItemLocal: (state, action: PayloadAction<{ cartItemId: string; quantity: number }>) => {
            if (state.cart && state.cart.items) {
                const { cartItemId, quantity } = action.payload;
                const itemIndex = state.cart.items.findIndex(item => item.cart_item_id === cartItemId);

                if (itemIndex !== -1) {
                    state.cart.items[itemIndex].quantity = quantity;
                    state.cart.items[itemIndex].modified_at = new Date().toISOString();

                    // Update totals
                    state.cart.total_quantity = state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

                    // Recalculate cart totals and calculations
                    recalculateCartTotals(state);
                }
            }
        },

        // Remove cart item locally (optimistic update)
        removeCartItemLocal: (state, action: PayloadAction<string>) => {
            if (state.cart && state.cart.items) {
                const cartItemId = action.payload;
                state.cart.items = state.cart.items.filter(item => item.cart_item_id !== cartItemId);

                // Update cart summary
                state.cart.total_items = state.cart.items.length;
                state.cart.total_quantity = state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

                // Recalculate cart totals and calculations
                recalculateCartTotals(state);
            }
        },
    },
    extraReducers: (builder) => {
        // Fetch Cart
        builder
            .addCase(fetchCart.pending, (state) => {
                state.cartLoading = true;
                state.cartError = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.cartLoading = false;
                state.cart = action.payload as ShoppingCart;
                state.cartError = null;
                state.isCartInitialized = true;

                // Update calculations
                recalculateCartTotals(state);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.cartLoading = false;
                state.cart = null;
                state.cartError = (action.payload as APIError)?.message || 'Failed to fetch cart';
                state.isCartInitialized = true; // Mark as initialized even on error
            });

        // Create Cart
        builder
            .addCase(createCart.pending, (state) => {
                state.addingToCart = true;
                state.cartOperationError = null;
            })
            .addCase(createCart.fulfilled, (state, action) => {
                state.addingToCart = false;
                state.cartOperationError = null;
                state.cart = action.payload as ShoppingCart;
                state.isCartInitialized = true;

                // Set most recently added item
                if ((action.payload as ShoppingCart).items.length > 0) {
                    state.recentlyAddedItem = (action.payload as ShoppingCart).items[(action.payload as ShoppingCart).items.length - 1];
                }

                // Update calculations
                recalculateCartTotals(state);
            })
            .addCase(createCart.rejected, (state, action) => {
                state.addingToCart = false;
                state.cartOperationError = (action.payload as APIError)?.message || 'Failed to create cart';
            });

        // Add to Cart
        builder
            .addCase(addToCart.pending, (state) => {
                state.addingToCart = true;
                state.cartOperationError = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.addingToCart = false;
                state.cartOperationError = null;

                // Set recently added item
                state.recentlyAddedItem = action.payload as CartItem;

                // Update cart if it exists, otherwise initialize it
                if (state.cart) {
                    // Check if item already exists in cart
                    const existingItemIndex = state.cart.items.findIndex(
                        item => item.product_id === (action.payload as CartItem).product_id
                    );

                    if (existingItemIndex !== -1) {
                        // Update existing item
                        state.cart.items[existingItemIndex] = action.payload as CartItem;
                    } else {
                        // Add new item
                        state.cart.items.push(action.payload as CartItem);
                    }

                    // Update cart summary
                    state.cart.total_items = state.cart.items.length;
                    state.cart.total_quantity = state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
                    state.cart.modified_at = new Date().toISOString();
                } else {
                    // Initialize cart with the new item
                    const cartItem = action.payload as CartItem;
                    state.cart = {
                        cart_id: cartItem.cart_id,
                        customer_id: cartItem.modified_by,
                        created_at: new Date().toISOString(),
                        modified_at: new Date().toISOString(),
                        items: [cartItem],
                        total_items: 1,
                        total_quantity: cartItem.quantity,
                    };
                }

                // Update calculations
                recalculateCartTotals(state);
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.addingToCart = false;
                state.cartOperationError = (action.payload as APIError)?.message || 'Failed to add item to cart';
            });

        // Update Cart Item
        builder
            .addCase(updateCartItem.pending, (state) => {
                state.updatingCartItem = true;
                state.cartOperationError = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.updatingCartItem = false;
                state.cartOperationError = null;

                if (state.cart && state.cart.items) {
                    const itemIndex = state.cart.items.findIndex(
                        item => item.cart_item_id === (action.payload as CartItem).cart_item_id
                    );

                    if (itemIndex !== -1) {
                        state.cart.items[itemIndex] = action.payload as CartItem;

                        // Update cart summary
                        state.cart.total_quantity = state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
                        state.cart.modified_at = new Date().toISOString();

                        // Update calculations
                        recalculateCartTotals(state);
                    }
                }
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.updatingCartItem = false;
                state.cartOperationError = (action.payload as APIError)?.message || 'Failed to update cart item';
            });

        // Remove from Cart
        builder
            .addCase(removeFromCart.pending, (state, action) => {
                const cartItemId = action.meta.arg;
                state.removingFromCart[cartItemId] = true;
                state.cartOperationError = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                const cartItemId = action.payload as string;
                delete state.removingFromCart[cartItemId];
                state.cartOperationError = null;

                if (state.cart && state.cart.items) {
                    state.cart.items = state.cart.items.filter(item => item.cart_item_id !== cartItemId);

                    // Update cart summary
                    state.cart.total_items = state.cart.items.length;
                    state.cart.total_quantity = state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
                    state.cart.modified_at = new Date().toISOString();

                    // Update calculations
                    recalculateCartTotals(state);
                }
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                const cartItemId = action.meta.arg;
                delete state.removingFromCart[cartItemId];
                state.cartOperationError = (action.payload as APIError)?.message || 'Failed to remove item from cart';
            });
    },
});

// Export actions
export const {
    clearCartError,
    clearCartOperationError,
    clearAllCartErrors,
    clearCart,
    toggleCartSidebar,
    openCartSidebar,
    closeCartSidebar,
    setRecentlyAddedItem,
    clearRecentlyAddedItem,
    setCartLoading,
    setAddingToCart,
    setUpdatingCartItem,
    setRemovingFromCart,
    setCartInitialized,
    updateCartCalculations,
    updateCartItemLocal,
    removeCartItemLocal,
} = userSlice.actions;

// Export selectors
export const selectUserState = (state: { user: UserState }) => state.user;
export const selectCart = (state: { user: UserState }) => state.user.cart;
export const selectCartLoading = (state: { user: UserState }) => state.user.cartLoading;
export const selectCartError = (state: { user: UserState }) => state.user.cartError;
export const selectCartTotals = (state: { user: UserState }) => state.user.cartTotals;
export const selectCartCalculations = (state: { user: UserState }) => state.user.cartCalculations;

export const selectAddingToCart = (state: { user: UserState }) => state.user.addingToCart;
export const selectUpdatingCartItem = (state: { user: UserState }) => state.user.updatingCartItem;
export const selectRemovingFromCart = (state: { user: UserState }) => state.user.removingFromCart;
export const selectCartOperationError = (state: { user: UserState }) => state.user.cartOperationError;

export const selectIsCartInitialized = (state: { user: UserState }) => state.user.isCartInitialized;
export const selectCartSidebarOpen = (state: { user: UserState }) => state.user.cartSidebarOpen;
export const selectRecentlyAddedItem = (state: { user: UserState }) => state.user.recentlyAddedItem;

// Derived selectors
export const selectCartItems = (state: { user: UserState }) => state.user.cart?.items || [];
export const selectCartItemCount = (state: { user: UserState }) => state.user.cart?.total_items || 0;
export const selectCartTotalQuantity = (state: { user: UserState }) => state.user.cart?.total_quantity || 0;
export const selectIsCartEmpty = (state: { user: UserState }) => (state.user.cart?.items?.length || 0) === 0;

export const selectCartItemByProductId = (productId: string) => (state: { user: UserState }) =>
    state.user.cart?.items.find(item => item.product_id === productId) || null;

export const selectIsProductInCart = (productId: string) => (state: { user: UserState }) =>
    UserService.isProductInCart(state.user.cart, productId);

export const selectUnavailableCartItems = (state: { user: UserState }) =>
    UserService.getUnavailableItems(state.user.cart);

export const selectOutOfStockCartItems = (state: { user: UserState }) =>
    UserService.getOutOfStockItems(state.user.cart);

export const selectHasCartIssues = (state: { user: UserState }) =>
    UserService.hasUnavailableItems(state.user.cart) || UserService.hasOutOfStockItems(state.user.cart);

// Export reducer
export default userSlice.reducer;