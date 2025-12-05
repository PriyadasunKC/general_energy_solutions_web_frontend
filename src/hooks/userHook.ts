// src/hooks/userHook.ts
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import {
    fetchCart,
    createCart as createCartThunk,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCartError,
    clearCartOperationError,
    clearAllCartErrors,
    clearCart,
    toggleCartSidebar,
    openCartSidebar,
    closeCartSidebar,
    setRecentlyAddedItem,
    clearRecentlyAddedItem,
    setCartInitialized,
    updateCartCalculations,
    updateCartItemLocal,
    removeCartItemLocal,
    selectCart,
    selectCartLoading,
    selectCartError,
    selectCartTotals,
    selectCartCalculations,
    selectAddingToCart,
    selectUpdatingCartItem,
    selectRemovingFromCart,
    selectCartOperationError,
    selectIsCartInitialized,
    selectCartSidebarOpen,
    selectRecentlyAddedItem,
    selectCartItems,
    selectCartItemCount,
    selectCartTotalQuantity,
    selectIsCartEmpty,
    selectCartItemByProductId,
    selectIsProductInCart,
    selectUnavailableCartItems,
    selectOutOfStockCartItems,
    selectHasCartIssues,
} from '../store/slices/userSlice';
import { UserService } from '../services/userService';
import {
    UseCartReturn,
    ShoppingCart,
    CartItem,
    CreateCartRequest,
    CartQueryParams,
    CartTotals,
    CartItemCalculation,
} from '../types/userTypes';

/**
 * Custom hook for cart management
 * Provides all cart-related functionality with Redux integration
 */
export const useCart = (): UseCartReturn => {
    const dispatch = useDispatch<AppDispatch>();

    // Selectors
    const cart = useSelector((state: RootState) => selectCart(state));
    const cartLoading = useSelector((state: RootState) => selectCartLoading(state));
    const cartError = useSelector((state: RootState) => selectCartError(state));
    const cartTotals = useSelector((state: RootState) => selectCartTotals(state));
    const cartCalculations = useSelector((state: RootState) => selectCartCalculations(state));

    const addingToCart = useSelector((state: RootState) => selectAddingToCart(state));
    const updatingCartItem = useSelector((state: RootState) => selectUpdatingCartItem(state));
    const removingFromCart = useSelector((state: RootState) => selectRemovingFromCart(state));
    const cartOperationError = useSelector((state: RootState) => selectCartOperationError(state));

    const isCartInitialized = useSelector((state: RootState) => selectIsCartInitialized(state));
    const cartSidebarOpen = useSelector((state: RootState) => selectCartSidebarOpen(state));
    const recentlyAddedItem = useSelector((state: RootState) => selectRecentlyAddedItem(state));

    /**
     * Fetch cart data
     */
    const fetchCartData = useCallback(async (params?: CartQueryParams): Promise<ShoppingCart> => {
        const result = await dispatch(fetchCart(params)).unwrap();
        return result;
    }, [dispatch]);

    /**
     * Create new cart with initial items (first time adding to cart)
     */
    const createCartData = useCallback(async (items: CreateCartRequest[]): Promise<ShoppingCart> => {
        const result = await dispatch(createCartThunk(items)).unwrap();
        return result;
    }, [dispatch]);

    /**
     * Add product to cart
     */
    const addToCartData = useCallback(async (productId: string, quantity: number): Promise<CartItem> => {
        const result = await dispatch(addToCart({ productId, quantity })).unwrap();
        return result;
    }, [dispatch]);

    /**
     * Update cart item quantity
     */
    const updateCartItemData = useCallback(async (cartItemId: string, quantity: number): Promise<CartItem> => {
        // Optimistic update
        dispatch(updateCartItemLocal({ cartItemId, quantity }));

        try {
            const result = await dispatch(updateCartItem({ cartItemId, quantity })).unwrap();
            return result;
        } catch (error) {
            // Revert optimistic update by refetching cart
            dispatch(fetchCart());
            throw error;
        }
    }, [dispatch]);

    /**
     * Remove item from cart
     */
    const removeFromCartData = useCallback(async (cartItemId: string): Promise<void> => {
        // Optimistic update
        dispatch(removeCartItemLocal(cartItemId));

        try {
            await dispatch(removeFromCart(cartItemId)).unwrap();
        } catch (error) {
            // Revert optimistic update by refetching cart
            dispatch(fetchCart());
            throw error;
        }
    }, [dispatch]);

    /**
     * Clear cart
     */
    const clearCartData = useCallback((): void => {
        dispatch(clearCart());
    }, [dispatch]);

    /**
     * Clear cart errors
     */
    const clearCartErrors = useCallback((): void => {
        dispatch(clearAllCartErrors());
    }, [dispatch]);

    /**
     * Calculate cart totals
     */
    const calculateCartTotals = useCallback((): CartTotals => {
        return UserService.calculateCartTotals(cart);
    }, [cart]);

    /**
     * Get cart item calculation by ID
     */
    const getCartItemCalculation = useCallback((cartItemId: string): CartItemCalculation | null => {
        return cartCalculations.find(calc => calc.itemId === cartItemId) || null;
    }, [cartCalculations]);

    /**
     * Check if cart is empty
     */
    const isCartEmpty = useCallback((): boolean => {
        return !cart || !cart.items || cart.items.length === 0;
    }, [cart]);

    /**
     * Get cart item count
     */
    const getCartItemCount = useCallback((): number => {
        return cart?.total_items || 0;
    }, [cart]);

    /**
     * Get total quantity in cart
     */
    const getTotalQuantity = useCallback((): number => {
        return cart?.total_quantity || 0;
    }, [cart]);

    /**
     * Check if product is in cart
     */
    const isProductInCart = useCallback((productId: string): boolean => {
        return UserService.isProductInCart(cart, productId);
    }, [cart]);

    /**
     * Get cart item by product ID
     */
    const getCartItemByProductId = useCallback((productId: string): CartItem | null => {
        return UserService.getCartItemByProductId(cart, productId);
    }, [cart]);

    /**
     * Check if more quantity can be added to cart
     */
    const canAddMoreToCart = useCallback((productId: string, additionalQuantity: number): boolean => {
        return UserService.canAddMoreToCart(cart, productId, additionalQuantity);
    }, [cart]);

    /**
     * Get maximum quantity allowed for product
     */
    const getMaxQuantityForProduct = useCallback((productId: string): number => {
        return UserService.getMaxQuantityForProduct(cart, productId);
    }, [cart]);

    /**
     * Toggle cart sidebar
     */
    const toggleCartSidebarData = useCallback((): void => {
        dispatch(toggleCartSidebar());
    }, [dispatch]);

    /**
     * Open cart sidebar
     */
    const openCartSidebarData = useCallback((): void => {
        dispatch(openCartSidebar());
    }, [dispatch]);

    /**
     * Close cart sidebar
     */
    const closeCartSidebarData = useCallback((): void => {
        dispatch(closeCartSidebar());
    }, [dispatch]);

    /**
     * Clear recently added item
     */
    const clearRecentlyAddedItemData = useCallback((): void => {
        dispatch(clearRecentlyAddedItem());
    }, [dispatch]);

    /**
     * Validate cart item
     */
    const validateCartItem = useCallback((cartItem: CartItem): boolean => {
        return UserService.validateCartItem(cartItem);
    }, []);

    /**
     * Get unavailable items in cart
     */
    const getUnavailableItems = useCallback((): CartItem[] => {
        return UserService.getUnavailableItems(cart);
    }, [cart]);

    /**
     * Get out of stock items in cart
     */
    const getOutOfStockItems = useCallback((): CartItem[] => {
        return UserService.getOutOfStockItems(cart);
    }, [cart]);

    /**
     * Check if cart has unavailable items
     */
    const hasUnavailableItems = useCallback((): boolean => {
        return UserService.hasUnavailableItems(cart);
    }, [cart]);

    /**
     * Check if cart has out of stock items
     */
    const hasOutOfStockItems = useCallback((): boolean => {
        return UserService.hasOutOfStockItems(cart);
    }, [cart]);

    /**
     * Initialize cart
     */
    const initializeCart = useCallback(async (): Promise<void> => {
        try {
            if (!isCartInitialized) {
                await dispatch(fetchCart()).unwrap();
                dispatch(setCartInitialized(true));
            }
        } catch (error) {
            console.error('Failed to initialize cart:', error);
            dispatch(setCartInitialized(true)); // Mark as initialized even on error
        }
    }, [dispatch, isCartInitialized]);

    /**
     * Refresh cart data
     */
    const refreshCart = useCallback(async (): Promise<void> => {
        await dispatch(fetchCart()).unwrap();
    }, [dispatch]);

    /**
     * Get cart summary for display
     */
    const getCartSummary = useCallback(() => {
        return UserService.getCartSummary(cart);
    }, [cart]);

    /**
     * Format price for display
     */
    const formatPrice = useCallback((price: number): string => {
        return UserService.formatPrice(price);
    }, []);

    /**
     * Get cart item display info
     */
    const getCartItemDisplayInfo = useCallback((item: CartItem) => {
        return UserService.getCartItemDisplayInfo(item);
    }, []);

    /**
     * Add to cart with error handling and cart creation logic
     */
    const addToCartSafe = useCallback(async (productId: string, quantity: number): Promise<boolean> => {
        try {
            // Check if cart exists
            if (!cart) {
                // Create cart with first item
                await createCartData([{ product_id: productId, quantity }]);
            } else {
                // Add to existing cart
                await addToCartData(productId, quantity);
            }
            dispatch(openCartSidebar()); // Open cart sidebar on successful add
            return true;
        } catch (error) {
            console.error('Failed to add to cart:', error);
            return false;
        }
    }, [cart, createCartData, addToCartData, dispatch]);

    /**
     * Update cart item with error handling
     */
    const updateCartItemSafe = useCallback(async (cartItemId: string, quantity: number): Promise<boolean> => {
        try {
            await updateCartItemData(cartItemId, quantity);
            return true;
        } catch (error) {
            console.error('Failed to update cart item:', error);
            return false;
        }
    }, [updateCartItemData]);

    /**
     * Remove from cart with error handling
     */
    const removeFromCartSafe = useCallback(async (cartItemId: string): Promise<boolean> => {
        try {
            await removeFromCartData(cartItemId);
            return true;
        } catch (error) {
            console.error('Failed to remove from cart:', error);
            return false;
        }
    }, [removeFromCartData]);

    /**
     * Get quantity of specific product in cart
     */
    const getProductQuantityInCart = useCallback((productId: string): number => {
        const cartItem = getCartItemByProductId(productId);
        return cartItem?.quantity || 0;
    }, [getCartItemByProductId]);

    /**
     * Check if cart is ready for checkout
     */
    const isCartReadyForCheckout = useCallback((): boolean => {
        const summary = getCartSummary();
        return summary.isValid && summary.itemCount > 0;
    }, [getCartSummary]);

    return {
        // State
        cart,
        cartLoading,
        cartError,
        cartTotals,
        cartCalculations,

        // Operation states
        addingToCart,
        updatingCartItem,
        removingFromCart,
        cartOperationError,

        // Actions
        fetchCart: fetchCartData,
        createCart: createCartData,
        addToCart: addToCartData,
        updateCartItem: updateCartItemData,
        removeFromCart: removeFromCartData,
        clearCart: clearCartData,
        clearCartErrors,

        // Cart calculations
        calculateCartTotals,
        getCartItemCalculation,
        isCartEmpty,
        getCartItemCount,
        getTotalQuantity,

        // Cart item utilities
        isProductInCart,
        getCartItemByProductId,
        canAddMoreToCart,
        getMaxQuantityForProduct,

        // UI state
        isCartInitialized,
        cartSidebarOpen,
        recentlyAddedItem,
        toggleCartSidebar: toggleCartSidebarData,
        openCartSidebar: openCartSidebarData,
        closeCartSidebar: closeCartSidebarData,
        clearRecentlyAddedItem: clearRecentlyAddedItemData,

        // Cart validation
        validateCartItem,
        getUnavailableItems,
        getOutOfStockItems,
        hasUnavailableItems,
        hasOutOfStockItems,

        // Additional utilities
        initializeCart,
        refreshCart,
        getCartSummary,
        formatPrice,
        getCartItemDisplayInfo,
        addToCartSafe,
        updateCartItemSafe,
        removeFromCartSafe,
        getProductQuantityInCart,
        isCartReadyForCheckout,
    };
};

/**
 * Hook for cart state only (lighter version)
 */
export const useCartState = () => {
    const cart = useSelector((state: RootState) => selectCart(state));
    const cartLoading = useSelector((state: RootState) => selectCartLoading(state));
    const cartError = useSelector((state: RootState) => selectCartError(state));
    const cartTotals = useSelector((state: RootState) => selectCartTotals(state));
    const isCartEmpty = useSelector((state: RootState) => selectIsCartEmpty(state));
    const cartItemCount = useSelector((state: RootState) => selectCartItemCount(state));

    return {
        cart,
        cartLoading,
        cartError,
        cartTotals,
        isCartEmpty,
        cartItemCount,
    };
};

/**
 * Hook for cart sidebar
 */
export const useCartSidebar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const cartSidebarOpen = useSelector((state: RootState) => selectCartSidebarOpen(state));
    const recentlyAddedItem = useSelector((state: RootState) => selectRecentlyAddedItem(state));
    const cartItemCount = useSelector((state: RootState) => selectCartItemCount(state));

    const toggleSidebar = useCallback(() => {
        dispatch(toggleCartSidebar());
    }, [dispatch]);

    const openSidebar = useCallback(() => {
        dispatch(openCartSidebar());
    }, [dispatch]);

    const closeSidebar = useCallback(() => {
        dispatch(closeCartSidebar());
    }, [dispatch]);

    const clearRecentItem = useCallback(() => {
        dispatch(clearRecentlyAddedItem());
    }, [dispatch]);

    return {
        cartSidebarOpen,
        recentlyAddedItem,
        cartItemCount,
        toggleSidebar,
        openSidebar,
        closeSidebar,
        clearRecentItem,
    };
};

/**
 * Hook for specific product cart status
 * This is optimized to only re-render when the specific product's cart status changes
 */
export const useProductCartStatus = (productId: string) => {
    const isInCart = useSelector((state: RootState) => selectIsProductInCart(productId)(state));
    const cartItem = useSelector((state: RootState) => selectCartItemByProductId(productId)(state));
    const addingToCart = useSelector((state: RootState) => selectAddingToCart(state));

    // Memoize the return value to prevent unnecessary re-renders
    return useMemo(() => ({
        isInCart,
        cartItem,
        quantity: cartItem?.quantity || 0,
        addingToCart,
        cartItemId: cartItem?.cart_item_id,
    }), [isInCart, cartItem, addingToCart]);
};

/**
 * Hook for multiple products cart status
 * Useful for product lists to check multiple products at once
 */
export const useProductsCartStatus = (productIds: string[]) => {
    const cart = useSelector((state: RootState) => selectCart(state));
    const addingToCart = useSelector((state: RootState) => selectAddingToCart(state));

    // Create a map of product statuses
    const statusMap = useMemo(() => {
        const map = new Map<string, { isInCart: boolean; quantity: number; cartItemId?: string }>();

        productIds.forEach(productId => {
            const cartItem = cart?.items?.find(item => item.product_id === productId);
            map.set(productId, {
                isInCart: !!cartItem,
                quantity: cartItem?.quantity || 0,
                cartItemId: cartItem?.cart_item_id,
            });
        });

        return map;
    }, [cart, productIds]);

    return {
        statusMap,
        addingToCart,
        getStatus: (productId: string) => statusMap.get(productId) || { isInCart: false, quantity: 0 },
    };
};

/**
 * Hook for cart with authentication check
 * Returns cart functions that automatically check authentication
 */
export const useAuthenticatedCart = () => {
    const cart = useCart();
    const dispatch = useDispatch<AppDispatch>();

    const addToCartWithAuth = useCallback(async (
        productId: string,
        quantity: number,
        onUnauthenticated?: () => void
    ): Promise<boolean> => {
        // This would need to be integrated with your auth system
        // For now, it just calls the regular addToCartSafe
        return await cart.addToCartSafe(productId, quantity);
    }, [cart]);

    return {
        ...cart,
        addToCartWithAuth,
    };
};
