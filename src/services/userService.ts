// src/services/userService.ts
import { apiClient } from './apiClient';
import {
    ShoppingCart,
    CartItem,
    CreateCartRequest,
    CreateCartResponse,
    AddToCartRequest,
    AddToCartResponse,
    UpdateCartItemRequest,
    UpdateCartItemResponse,
    RemoveFromCartResponse,
    GetCartResponse,
    GetCartByIdResponse,
    CartQueryParams,
    CartTotals,
    CartItemCalculation,
    CART_ENDPOINTS,
    CART_CONSTANTS,
} from '../types/userTypes';

/**
 * User Service
 * Handles all user-related API calls including shopping cart
 */
export class UserService {
    /**
     * Fetch user's shopping cart
     */
    static async fetchCart(params: CartQueryParams = {}): Promise<GetCartResponse> {
        try {
            const queryParams = new URLSearchParams();

            // Add pagination params
            if (params.page) queryParams.set('page', params.page.toString());
            if (params.limit) queryParams.set('limit', params.limit.toString());

            // Add filter params
            if (params.isAvailable !== undefined) {
                queryParams.set('isAvailable', params.isAvailable.toString());
            }

            const queryString = queryParams.toString();
            const url = `${CART_ENDPOINTS.CART}${queryString ? `?${queryString}` : ''}`;

            const response = await apiClient.get<GetCartResponse>(url);
            return response;
        } catch (error) {
            console.error('Failed to fetch cart:', error);
            throw error;
        }
    }

    /**
     * Fetch cart by ID
     */
    static async fetchCartById(cartId: string): Promise<GetCartByIdResponse> {
        try {
            if (!cartId) {
                throw new Error('Cart ID is required');
            }

            const response = await apiClient.get<GetCartByIdResponse>(
                CART_ENDPOINTS.CART_BY_ID(cartId)
            );
            return response;
        } catch (error) {
            console.error(`Failed to fetch cart ${cartId}:`, error);
            throw error;
        }
    }

    /**
     * Create new cart with initial items (first time adding to cart)
     */
    static async createCart(items: CreateCartRequest[]): Promise<CreateCartResponse> {
        try {
            if (!items || items.length === 0) {
                throw new Error('At least one item is required to create cart');
            }

            // Validate items
            items.forEach(item => {
                if (!item.product_id) {
                    throw new Error('Product ID is required');
                }
                if (item.quantity < CART_CONSTANTS.MIN_QUANTITY_PER_ITEM ||
                    item.quantity > CART_CONSTANTS.MAX_QUANTITY_PER_ITEM) {
                    throw new Error(
                        `Quantity must be between ${CART_CONSTANTS.MIN_QUANTITY_PER_ITEM} and ${CART_CONSTANTS.MAX_QUANTITY_PER_ITEM}`
                    );
                }
            });

            const response = await apiClient.post<CreateCartResponse>(
                CART_ENDPOINTS.CART,
                items
            );
            return response;
        } catch (error) {
            console.error('Failed to create cart:', error);
            throw error;
        }
    }

    /**
     * Add item to existing cart
     */
    static async addToCart(productId: string, quantity: number): Promise<AddToCartResponse> {
        try {
            if (!productId) {
                throw new Error('Product ID is required');
            }

            if (quantity < CART_CONSTANTS.MIN_QUANTITY_PER_ITEM ||
                quantity > CART_CONSTANTS.MAX_QUANTITY_PER_ITEM) {
                throw new Error(
                    `Quantity must be between ${CART_CONSTANTS.MIN_QUANTITY_PER_ITEM} and ${CART_CONSTANTS.MAX_QUANTITY_PER_ITEM}`
                );
            }

            const requestData: AddToCartRequest = {
                product_id: productId,
                quantity,
            };

            const response = await apiClient.post<AddToCartResponse>(
                CART_ENDPOINTS.ADD_TO_CART,
                requestData
            );
            return response;
        } catch (error) {
            console.error(`Failed to add product ${productId} to cart:`, error);
            throw error;
        }
    }

    /**
     * Update cart item quantity
     */
    static async updateCartItem(cartItemId: string, quantity: number): Promise<UpdateCartItemResponse> {
        try {
            if (!cartItemId) {
                throw new Error('Cart item ID is required');
            }

            if (quantity < CART_CONSTANTS.MIN_QUANTITY_PER_ITEM ||
                quantity > CART_CONSTANTS.MAX_QUANTITY_PER_ITEM) {
                throw new Error(
                    `Quantity must be between ${CART_CONSTANTS.MIN_QUANTITY_PER_ITEM} and ${CART_CONSTANTS.MAX_QUANTITY_PER_ITEM}`
                );
            }

            const requestData: UpdateCartItemRequest = {
                quantity,
            };

            const response = await apiClient.put<UpdateCartItemResponse>(
                CART_ENDPOINTS.UPDATE_CART_ITEM(cartItemId),
                requestData
            );
            return response;
        } catch (error) {
            console.error(`Failed to update cart item ${cartItemId}:`, error);
            throw error;
        }
    }

    /**
     * Remove item from cart
     */
    static async removeFromCart(cartItemId: string): Promise<RemoveFromCartResponse> {
        try {
            if (!cartItemId) {
                throw new Error('Cart item ID is required');
            }

            const response = await apiClient.delete<RemoveFromCartResponse>(
                CART_ENDPOINTS.REMOVE_FROM_CART(cartItemId)
            );
            return response;
        } catch (error) {
            console.error(`Failed to remove cart item ${cartItemId}:`, error);
            throw error;
        }
    }

    /**
     * Calculate cart totals
     */
    static calculateCartTotals(cart: ShoppingCart | null): CartTotals {
        if (!cart || !cart.items || cart.items.length === 0) {
            return {
                subtotal: 0,
                totalOriginalPrice: 0,
                totalSavings: 0,
                totalItems: 0,
                totalQuantity: 0,
            };
        }

        const calculations = cart.items.reduce(
            (totals, item) => {
                const salePrice = parseFloat(item.product.sale_price);
                const originalPrice = parseFloat(item.product.original_price);
                const itemSubtotal = salePrice * item.quantity;
                const itemOriginalTotal = originalPrice * item.quantity;
                const itemSavings = itemOriginalTotal - itemSubtotal;

                return {
                    subtotal: totals.subtotal + itemSubtotal,
                    totalOriginalPrice: totals.totalOriginalPrice + itemOriginalTotal,
                    totalSavings: totals.totalSavings + itemSavings,
                    totalItems: totals.totalItems + 1,
                    totalQuantity: totals.totalQuantity + item.quantity,
                };
            },
            {
                subtotal: 0,
                totalOriginalPrice: 0,
                totalSavings: 0,
                totalItems: 0,
                totalQuantity: 0,
            }
        );

        return calculations;
    }

    /**
     * Calculate individual cart item details
     */
    static calculateCartItemDetails(cart: ShoppingCart | null): CartItemCalculation[] {
        if (!cart || !cart.items || cart.items.length === 0) {
            return [];
        }

        return cart.items.map(item => {
            const unitPrice = parseFloat(item.product.sale_price);
            const originalUnitPrice = parseFloat(item.product.original_price);
            const totalPrice = unitPrice * item.quantity;
            const totalOriginalPrice = originalUnitPrice * item.quantity;
            const savings = totalOriginalPrice - totalPrice;
            const isAvailable = item.product.is_available && !item.product.is_deleted;
            const isInStock = isAvailable && item.product.quantity_available > 0;

            return {
                itemId: item.cart_item_id,
                productId: item.product_id,
                quantity: item.quantity,
                unitPrice,
                originalUnitPrice,
                totalPrice,
                totalOriginalPrice,
                savings,
                isAvailable,
                isInStock,
            };
        });
    }

    /**
     * Check if product is already in cart
     */
    static isProductInCart(cart: ShoppingCart | null, productId: string): boolean {
        if (!cart || !cart.items) return false;
        return cart.items.some(item => item.product_id === productId);
    }

    /**
     * Get cart item by product ID
     */
    static getCartItemByProductId(cart: ShoppingCart | null, productId: string): CartItem | null {
        if (!cart || !cart.items) return null;
        return cart.items.find(item => item.product_id === productId) || null;
    }

    /**
     * Check if more quantity can be added to cart for a product
     */
    static canAddMoreToCart(cart: ShoppingCart | null, productId: string, additionalQuantity: number): boolean {
        if (!cart || !cart.items) return true;

        const existingItem = this.getCartItemByProductId(cart, productId);
        if (!existingItem) return true;

        const newQuantity = existingItem.quantity + additionalQuantity;
        const maxAllowed = Math.min(
            existingItem.product.quantity_available,
            CART_CONSTANTS.MAX_QUANTITY_PER_ITEM
        );

        return newQuantity <= maxAllowed;
    }

    /**
     * Get maximum quantity that can be ordered for a product
     */
    static getMaxQuantityForProduct(cart: ShoppingCart | null, productId: string): number {
        const existingItem = this.getCartItemByProductId(cart, productId);

        if (!existingItem) {
            return CART_CONSTANTS.MAX_QUANTITY_PER_ITEM;
        }

        const availableQuantity = existingItem.product.quantity_available;
        const currentQuantity = existingItem.quantity;
        const remainingFromStock = Math.max(0, availableQuantity - currentQuantity);

        return Math.min(remainingFromStock + currentQuantity, CART_CONSTANTS.MAX_QUANTITY_PER_ITEM);
    }

    /**
     * Validate cart item (check if product is still available and in stock)
     */
    static validateCartItem(item: CartItem): boolean {
        const product = item.product;

        if (!product.is_available || product.is_deleted) {
            return false;
        }

        if (product.quantity_available <= 0) {
            return false;
        }

        if (item.quantity > product.quantity_available) {
            return false;
        }

        return true;
    }

    /**
     * Get unavailable items in cart
     */
    static getUnavailableItems(cart: ShoppingCart | null): CartItem[] {
        if (!cart || !cart.items) return [];

        return cart.items.filter(item =>
            !item.product.is_available || item.product.is_deleted
        );
    }

    /**
     * Get out of stock items in cart
     */
    static getOutOfStockItems(cart: ShoppingCart | null): CartItem[] {
        if (!cart || !cart.items) return [];

        return cart.items.filter(item =>
            item.product.is_available &&
            !item.product.is_deleted &&
            (item.product.quantity_available <= 0 || item.quantity > item.product.quantity_available)
        );
    }

    /**
     * Check if cart has any unavailable items
     */
    static hasUnavailableItems(cart: ShoppingCart | null): boolean {
        return this.getUnavailableItems(cart).length > 0;
    }

    /**
     * Check if cart has any out of stock items
     */
    static hasOutOfStockItems(cart: ShoppingCart | null): boolean {
        return this.getOutOfStockItems(cart).length > 0;
    }

    /**
     * Get cart summary for checkout
     */
    static getCartSummary(cart: ShoppingCart | null): {
        isValid: boolean;
        totals: CartTotals;
        itemCount: number;
        issues: string[];
    } {
        const totals = this.calculateCartTotals(cart);
        const unavailableItems = this.getUnavailableItems(cart);
        const outOfStockItems = this.getOutOfStockItems(cart);

        const issues: string[] = [];

        if (unavailableItems.length > 0) {
            issues.push(`${unavailableItems.length} item(s) are no longer available`);
        }

        if (outOfStockItems.length > 0) {
            issues.push(`${outOfStockItems.length} item(s) are out of stock or quantity exceeded`);
        }

        return {
            isValid: issues.length === 0 && totals.totalItems > 0,
            totals,
            itemCount: totals.totalItems,
            issues,
        };
    }

    /**
     * Format price for display
     */
    static formatPrice(price: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(price);
    }

    /**
     * Calculate savings percentage for cart item
     */
    static calculateSavingsPercentage(item: CartItem): number {
        const salePrice = parseFloat(item.product.sale_price);
        const originalPrice = parseFloat(item.product.original_price);

        if (originalPrice <= salePrice) return 0;

        return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
    }

    /**
     * Get cart item display info
     */
    static getCartItemDisplayInfo(item: CartItem): {
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
    } {
        const unitPrice = parseFloat(item.product.sale_price);
        const originalUnitPrice = parseFloat(item.product.original_price);
        const totalPrice = unitPrice * item.quantity;
        const savings = (originalUnitPrice - unitPrice) * item.quantity;
        const savingsPercentage = this.calculateSavingsPercentage(item);
        const isAvailable = item.product.is_available && !item.product.is_deleted;
        const isInStock = isAvailable && item.product.quantity_available >= item.quantity;

        return {
            title: item.product.title,
            subtitle: item.product.subtitle,
            imageUrl: item.product.image_urls?.[0] || null,
            unitPrice,
            originalUnitPrice,
            totalPrice,
            savings,
            savingsPercentage,
            isAvailable,
            isInStock,
            maxQuantity: Math.min(item.product.quantity_available, CART_CONSTANTS.MAX_QUANTITY_PER_ITEM),
        };
    }
}

export default UserService;