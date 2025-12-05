/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/userTypes.ts
import { Product, Category } from './productTypes';

// Cart item interfaces
export interface CartItem {
    cart_item_id: string;
    cart_id: string;
    product_id: string;
    quantity: number;
    added_at: string;
    modified_at: string;
    modified_by: string;
    product: Product;
}

// Shopping cart interface
export interface ShoppingCart {
    cart_id: string;
    customer_id: string;
    created_at: string;
    modified_at: string;
    items: CartItem[];
    total_items: number;
    total_quantity: number;
}

// Cart API request/response interfaces
export interface CreateCartRequest {
    product_id: string;
    quantity: number;
}

export interface CreateCartResponse {
    success: boolean;
    message: string;
    data: ShoppingCart;
}

export interface AddToCartRequest {
    product_id: string;
    quantity: number;
}

export interface AddToCartResponse {
    success: boolean;
    message: string;
    data: {
        cart_id: string;
        cartItem: CartItem;
    };
}

export interface UpdateCartItemRequest {
    quantity: number;
}

export interface UpdateCartItemResponse {
    success: boolean;
    message: string;
    data: CartItem;
}

export interface RemoveFromCartResponse {
    success: boolean;
    message: string;
}

export interface GetCartResponse {
    success: boolean;
    data: ShoppingCart;
}

export interface GetCartByIdResponse {
    success: boolean;
    data: ShoppingCart;
}

// Query parameters for cart
export interface CartQueryParams {
    page?: number;
    limit?: number;
    isAvailable?: boolean;
}

// Cart calculation interfaces
export interface CartTotals {
    subtotal: number;
    totalOriginalPrice: number;
    totalSavings: number;
    totalItems: number;
    totalQuantity: number;
}

export interface CartItemCalculation {
    itemId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    originalUnitPrice: number;
    totalPrice: number;
    totalOriginalPrice: number;
    savings: number;
    isAvailable: boolean;
    isInStock: boolean;
}

// Cart item display info
export interface CartItemDisplayInfo {
    title: string;
    subtitle: string;
    imageUrl: string | null;
    unitPrice: number;
    originalUnitPrice: number;
    totalPrice: number;
    savings: number;
    savingsPercentage: number;
    isAvailable: boolean;
    isInStock: boolean;
    maxQuantity: number;
}

// Cart summary
export interface CartSummary {
    isValid: boolean;
    totals: CartTotals;
    itemCount: number;
    issues: string[];
}

// State interfaces
export interface UserState {
    // Shopping cart
    cart: ShoppingCart | null;
    cartLoading: boolean;
    cartError: string | null;

    // Cart operations
    addingToCart: boolean;
    updatingCartItem: boolean;
    removingFromCart: Record<string, boolean>; // Track individual items being removed
    cartOperationError: string | null;

    // Cart calculations
    cartTotals: CartTotals;
    cartCalculations: CartItemCalculation[];

    // UI state
    isCartInitialized: boolean;
    cartSidebarOpen: boolean;
    recentlyAddedItem: CartItem | null;
}

// Hook return types
export interface UseCartReturn {
    // Cart state
    cart: ShoppingCart | null;
    cartLoading: boolean;
    cartError: string | null;
    cartTotals: CartTotals;
    cartCalculations: CartItemCalculation[];

    // Cart operations state
    addingToCart: boolean;
    updatingCartItem: boolean;
    removingFromCart: Record<string, boolean>; // Track individual items being removed
    cartOperationError: string | null;

    // Core Actions
    fetchCart: (params?: CartQueryParams) => Promise<ShoppingCart>;
    createCart: (items: CreateCartRequest[]) => Promise<ShoppingCart>;
    addToCart: (productId: string, quantity: number) => Promise<CartItem>;
    updateCartItem: (cartItemId: string, quantity: number) => Promise<CartItem>;
    removeFromCart: (cartItemId: string) => Promise<void>;
    clearCart: () => void;
    clearCartErrors: () => void;

    // Cart calculations
    calculateCartTotals: () => CartTotals;
    getCartItemCalculation: (cartItemId: string) => CartItemCalculation | null;
    isCartEmpty: () => boolean;
    getCartItemCount: () => number;
    getTotalQuantity: () => number;

    // Cart item utilities
    isProductInCart: (productId: string) => boolean;
    getCartItemByProductId: (productId: string) => CartItem | null;
    canAddMoreToCart: (productId: string, additionalQuantity: number) => boolean;
    getMaxQuantityForProduct: (productId: string) => number;

    // UI state
    isCartInitialized: boolean;
    cartSidebarOpen: boolean;
    recentlyAddedItem: CartItem | null;
    toggleCartSidebar: () => void;
    openCartSidebar: () => void;
    closeCartSidebar: () => void;
    clearRecentlyAddedItem: () => void;

    // Cart validation
    validateCartItem: (cartItem: CartItem) => boolean;
    getUnavailableItems: () => CartItem[];
    getOutOfStockItems: () => CartItem[];
    hasUnavailableItems: () => boolean;
    hasOutOfStockItems: () => boolean;

    // Additional utilities
    initializeCart: () => Promise<void>;
    refreshCart: () => Promise<void>;
    getCartSummary: () => CartSummary;
    formatPrice: (price: number) => string;
    getCartItemDisplayInfo: (item: CartItem) => CartItemDisplayInfo;
    addToCartSafe: (productId: string, quantity: number) => Promise<boolean>;
    updateCartItemSafe: (cartItemId: string, quantity: number) => Promise<boolean>;
    removeFromCartSafe: (cartItemId: string) => Promise<boolean>;
    getProductQuantityInCart: (productId: string) => number;
    isCartReadyForCheckout: () => boolean;
}

// Product cart status hook return type
export interface UseProductCartStatusReturn {
    isInCart: boolean;
    cartItem: CartItem | null;
    quantity: number;
    addingToCart: boolean;
    cartItemId?: string;
}

// Multiple products cart status hook return type
export interface UseProductsCartStatusReturn {
    statusMap: Map<string, { isInCart: boolean; quantity: number; cartItemId?: string }>;
    addingToCart: boolean;
    getStatus: (productId: string) => { isInCart: boolean; quantity: number; cartItemId?: string };
}

// Cart state only hook return type
export interface UseCartStateReturn {
    cart: ShoppingCart | null;
    cartLoading: boolean;
    cartError: string | null;
    cartTotals: CartTotals;
    isCartEmpty: boolean;
    cartItemCount: number;
}

// Cart sidebar hook return type
export interface UseCartSidebarReturn {
    cartSidebarOpen: boolean;
    recentlyAddedItem: CartItem | null;
    cartItemCount: number;
    toggleSidebar: () => void;
    openSidebar: () => void;
    closeSidebar: () => void;
    clearRecentItem: () => void;
}

// API endpoints
export const CART_ENDPOINTS = {
    CART: '/api/cart',
    CART_BY_ID: (cartId: string) => `/api/cart/${cartId}`,
    ADD_TO_CART: '/api/cart/items',
    UPDATE_CART_ITEM: (itemId: string) => `/api/cart/items/${itemId}`,
    REMOVE_FROM_CART: (itemId: string) => `/api/cart/items/${itemId}`,
} as const;

// Cart constants
export const CART_CONSTANTS = {
    MAX_QUANTITY_PER_ITEM: 999,
    MIN_QUANTITY_PER_ITEM: 1,
    DEFAULT_PAGINATION: {
        page: 1,
        limit: 10,
    },
} as const;