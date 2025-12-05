/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    ArrowLeft,
    ShoppingBag,
    CreditCard,
    Truck,
    Shield,
    Star,
    Package,
    AlertCircle,
    Check,
    Loader2
} from 'lucide-react';
import { useCart } from '@/hooks/userHook';
import { useProducts } from '@/hooks/productHook';
import { useAuth } from '@/hooks/useAuth';
import { solarTheme } from '@/theme/theme';
import { BackEndBaseURL } from "@/config/BackEndBaseURL";

export default function ShoppingCartPage() {
    const router = useRouter();

    // Redux hooks
    const {
        cart,
        cartLoading,
        cartError,
        cartTotals,
        addingToCart,
        updatingCartItem,
        removingFromCart,
        updateCartItemSafe,
        removeFromCartSafe,
        addToCartSafe,
        isCartEmpty,
        getCartItemCount,
        hasUnavailableItems,
        hasOutOfStockItems,
        getUnavailableItems,
        getOutOfStockItems,
        initializeCart,
        openCartSidebar
    } = useCart();

    const {
        products,
        productsLoading,
        fetchProducts,
        initializeProducts
    } = useProducts();

    const {
        isAuthenticated,
        requireAuth
    } = useAuth();

    // Local state
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [addingProductId, setAddingProductId] = useState<string | null>(null);

    // Initialize cart and products on mount
    useEffect(() => {
        const initialize = async () => {
            await initializeCart();
            await initializeProducts();
            // Fetch some products for recommendations
            await fetchProducts({ limit: 8, isAvailable: true });
        };

        if (isAuthenticated) {
            initialize();
        }
    }, [isAuthenticated]);

    // Auto-select available items
    useEffect(() => {
        if (cart?.items) {
            const availableItemIds = cart.items
                .filter(item => item.product.is_available && !item.product.is_deleted)
                .map(item => item.cart_item_id);
            setSelectedItems(new Set(availableItemIds));
        }
    }, [cart?.items]);

    // Calculate totals for selected items
    const selectedCartItems = cart?.items?.filter(item => selectedItems.has(item.cart_item_id)) || [];
    const selectedSubtotal = selectedCartItems.reduce((sum, item) => {
        return sum + (parseFloat(item.product.sale_price) * item.quantity);
    }, 0);
    const tax = selectedSubtotal * 0.08; // 8% tax
    const shipping = selectedSubtotal > 300000 ? 0 : 15000; // Free shipping over LKR 300,000
    const total = selectedSubtotal + tax + shipping;

    // Get recommended products (exclude items already in cart)
    const cartProductIds = new Set(cart?.items?.map(item => item.product_id) || []);
    const recommendedProducts = products
        .filter(product => !cartProductIds.has(product.product_id))
        .slice(0, 4);

    // Handlers
    const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        await updateCartItemSafe(cartItemId, newQuantity);
    };

    const handleRemoveItem = async (cartItemId: string) => {
        await removeFromCartSafe(cartItemId);
        setSelectedItems(prev => {
            const newSelected = new Set(prev);
            newSelected.delete(cartItemId);
            return newSelected;
        });
    };

    const toggleItemSelection = (cartItemId: string) => {
        setSelectedItems(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(cartItemId)) {
                newSelected.delete(cartItemId);
            } else {
                newSelected.add(cartItemId);
            }
            return newSelected;
        });
    };

    const toggleSelectAll = () => {
        if (!cart?.items) return;

        const availableItems = cart.items.filter(item =>
            item.product.is_available && !item.product.is_deleted
        );
        const allSelected = availableItems.every(item => selectedItems.has(item.cart_item_id));

        if (allSelected) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(availableItems.map(item => item.cart_item_id)));
        }
    };

    const handleCheckout = () => {
        if (selectedItems.size === 0) return;
        if (!requireAuth('proceed to checkout')) return;

        setCheckoutLoading(true);
        const selectedItemIds = Array.from(selectedItems).join(',');
        setTimeout(() => {
            router.push(`/checkout?items=${selectedItemIds}`);
        }, 1000);
    };

    const handleContinueShopping = () => {
        router.push('/products');
    };

    const handleProductClick = (productId: string) => {
        router.push(`/products/${productId}`);
    };

    const handleAddToCart = async (productId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!requireAuth('add to cart')) return;

        setAddingProductId(productId);
        const success = await addToCartSafe(productId, 1);
        setAddingProductId(null);

        if (success) {
            openCartSidebar();
        }
    };

    const handleBuyNow = (productId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!requireAuth('purchase')) return;
        router.push(`/checkout?product=${productId}&quantity=1`);
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ));
    };

    const formatPrice = (price: string | number) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return numPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Loading state
    if (cartLoading && !cart) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{
                background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white, ${solarTheme.secondary[50]})`
            }}>
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: solarTheme.primary[600] }} />
                    <p className="text-gray-600">Loading your cart...</p>
                </div>
            </div>
        );
    }

    // Empty cart state
    if (!cartLoading && isCartEmpty()) {
        return (
            <div className="min-h-screen" style={{
                background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white, ${solarTheme.secondary[50]})`
            }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center" style={{
                            backgroundColor: solarTheme.primary[100]
                        }}>
                            <ShoppingCart className="w-12 h-12" style={{ color: solarTheme.primary[600] }} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Discover our amazing solar energy products and start building your sustainable future today.
                        </p>
                        <button
                            onClick={handleContinueShopping}
                            className="inline-flex items-center px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105"
                            style={{
                                background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[500]})`
                            }}
                        >
                            <ShoppingBag className="w-5 h-5 mr-2" />
                            Start Shopping
                        </button>
                    </div>

                    {/* Show recommended products even when cart is empty */}
                    {recommendedProducts.length > 0 && (
                        <div className="mt-16">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                {recommendedProducts.map((product) => (
                                    <ProductCard
                                        key={product.product_id}
                                        product={product}
                                        onProductClick={handleProductClick}
                                        onAddToCart={handleAddToCart}
                                        onBuyNow={handleBuyNow}
                                        isAdding={addingProductId === product.product_id}
                                        renderStars={renderStars}
                                        formatPrice={formatPrice}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const availableItems = cart?.items?.filter(item =>
        item.product.is_available && !item.product.is_deleted
    ) || [];
    const allAvailableSelected = availableItems.length > 0 &&
        availableItems.every(item => selectedItems.has(item.cart_item_id));

    return (
        <div className="min-h-screen" style={{
            background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white, ${solarTheme.secondary[50]})`
        }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={handleContinueShopping}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Continue Shopping
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                    <p className="text-gray-600 mt-2">
                        {getCartItemCount()} item{getCartItemCount() !== 1 ? 's' : ''} in your cart
                    </p>
                </div>

                {/* Error Message */}
                {cartError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                        <AlertCircle className="w-5 h-5" />
                        <span>{cartError}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        {/* Select All Header */}
                        {availableItems.length > 0 && (
                            <div className="bg-white rounded-xl shadow-lg p-4 mb-4 border" style={{ borderColor: solarTheme.primary[200] }}>
                                <div className="flex items-center">
                                    <div className="flex items-center">
                                        <div
                                            onClick={toggleSelectAll}
                                            className={`w-5 h-5 rounded border-2 cursor-pointer transition-all duration-200 flex items-center justify-center ${allAvailableSelected
                                                    ? 'border-transparent'
                                                    : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                            style={{
                                                backgroundColor: allAvailableSelected ? solarTheme.primary[600] : 'white'
                                            }}
                                        >
                                            {allAvailableSelected && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <span className="ml-3 font-semibold text-gray-900">
                                            {allAvailableSelected ? 'Deselect All Items' : 'Select All Available Items'} ({availableItems.length})
                                        </span>
                                    </div>
                                    <div className="ml-auto text-sm text-gray-600">
                                        {selectedItems.size} of {availableItems.length} selected
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Cart Items */}
                        <div className="space-y-4">
                            {cart?.items?.map((item) => {
                                const isAvailable = item.product.is_available && !item.product.is_deleted;
                                const isInStock = isAvailable && item.product.quantity_available > 0;
                                const itemTotal = parseFloat(item.product.sale_price) * item.quantity;

                                return (
                                    <div key={item.cart_item_id} className="bg-white rounded-xl shadow-lg overflow-hidden border" style={{ borderColor: solarTheme.primary[200] }}>
                                        <div className="p-6">
                                            <div className="flex flex-col sm:flex-row gap-6">
                                                {/* Selection Checkbox */}
                                                <div className="flex items-start">
                                                    <div
                                                        onClick={() => isAvailable && toggleItemSelection(item.cart_item_id)}
                                                        className={`w-5 h-5 mt-2 rounded border-2 transition-all duration-200 flex items-center justify-center ${!isAvailable
                                                                ? 'border-gray-200 bg-gray-100 cursor-not-allowed'
                                                                : selectedItems.has(item.cart_item_id)
                                                                    ? 'border-transparent cursor-pointer'
                                                                    : 'border-gray-300 hover:border-gray-400 cursor-pointer'
                                                            }`}
                                                        style={{
                                                            backgroundColor: selectedItems.has(item.cart_item_id) && isAvailable
                                                                ? solarTheme.primary[600]
                                                                : isAvailable ? 'white' : '#f3f4f6'
                                                        }}
                                                    >
                                                        {selectedItems.has(item.cart_item_id) && isAvailable && (
                                                            <Check className="w-3 h-3 text-white" />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Product Image */}
                                                <div className="w-full sm:w-32 h-32 flex-shrink-0">
                                                    <div className="w-full h-full rounded-lg overflow-hidden" style={{
                                                        background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, ${solarTheme.primary[100]})`
                                                    }}>
                                                        <img
                                                            src={item.product.image_urls?.[0] || '/packages/product_placeholder.png'}
                                                            alt={item.product.title}
                                                            className="w-full h-full object-contain"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = "/packages/product_placeholder.png";
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                                {item.product.title}
                                                            </h3>
                                                            <p className="text-sm text-gray-600 mb-2">
                                                                Model: {item.product.product_code}
                                                            </p>
                                                            {item.product.categories.length > 0 && (
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="text-xs px-2 py-1 rounded-full" style={{
                                                                        backgroundColor: solarTheme.secondary[100],
                                                                        color: solarTheme.secondary[700]
                                                                    }}>
                                                                        {item.product.categories[0].category_name}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {!isAvailable && (
                                                                <div className="flex items-center gap-1 text-red-600 text-sm mb-2">
                                                                    <AlertCircle className="w-4 h-4" />
                                                                    <span>Product unavailable</span>
                                                                </div>
                                                            )}
                                                            {isAvailable && !isInStock && (
                                                                <div className="flex items-center gap-1 text-red-600 text-sm mb-2">
                                                                    <AlertCircle className="w-4 h-4" />
                                                                    <span>Out of stock</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveItem(item.cart_item_id)}
                                                            disabled={removingFromCart[item.cart_item_id]}
                                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                                        >
                                                            {removingFromCart[item.cart_item_id] ? (
                                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                            ) : (
                                                                <Trash2 className="w-5 h-5" />
                                                            )}
                                                        </button>
                                                    </div>

                                                    {/* Quantity and Price */}
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                        {/* Quantity Controls */}
                                                        <div className="flex items-center">
                                                            <span className="text-sm text-gray-600 mr-4">Quantity:</span>
                                                            <div className="flex items-center border rounded-lg" style={{ borderColor: solarTheme.primary[300] }}>
                                                                <button
                                                                    onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity - 1)}
                                                                    disabled={item.quantity <= 1 || updatingCartItem}
                                                                    className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                                                >
                                                                    <Minus className="w-4 h-4" />
                                                                </button>
                                                                <span className="px-4 py-2 font-semibold">{item.quantity}</span>
                                                                <button
                                                                    onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity + 1)}
                                                                    disabled={updatingCartItem || item.quantity >= item.product.quantity_available}
                                                                    className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                                                >
                                                                    <Plus className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Price */}
                                                        <div className="text-right">
                                                            <div className="text-lg font-bold" style={{ color: solarTheme.primary[600] }}>
                                                                LKR {formatPrice(itemTotal)}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                LKR {formatPrice(item.product.sale_price)} each
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8" style={{ border: '1px solid', borderColor: solarTheme.primary[200] }}>
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            {/* Selected Items Info */}
                            <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: solarTheme.primary[50] }}>
                                <div className="text-sm" style={{ color: solarTheme.primary[700] }}>
                                    {selectedItems.size} of {cart?.items?.length || 0} items selected for checkout
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            {selectedItems.size > 0 ? (
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span className="font-semibold">LKR {formatPrice(selectedSubtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax (8%):</span>
                                        <span className="font-semibold">LKR {formatPrice(tax)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping:</span>
                                        <span className="font-semibold">
                                            {shipping === 0 ? (
                                                <span style={{ color: solarTheme.primary[600] }}>FREE</span>
                                            ) : (
                                                `LKR ${formatPrice(shipping)}`
                                            )}
                                        </span>
                                    </div>
                                    <div className="border-t pt-3" style={{ borderColor: solarTheme.primary[200] }}>
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total:</span>
                                            <span style={{ color: solarTheme.primary[600] }}>
                                                LKR {formatPrice(total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-6 p-4 rounded-lg bg-gray-50 text-center">
                                    <div className="text-gray-500 text-sm">
                                        Select items to see pricing
                                    </div>
                                </div>
                            )}

                            {/* Benefits */}
                            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: solarTheme.primary[50] }}>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4" style={{ color: solarTheme.primary[600] }} />
                                        <span>2-year warranty included</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Truck className="w-4 h-4" style={{ color: solarTheme.primary[600] }} />
                                        <span>{selectedSubtotal > 300000 ? 'Free shipping' : 'Fast delivery'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4" style={{ color: solarTheme.primary[600] }} />
                                        <span>Professional installation available</span>
                                    </div>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button
                                onClick={handleCheckout}
                                disabled={checkoutLoading || selectedItems.size === 0 || selectedCartItems.some(item => !item.product.is_available || item.product.quantity_available < item.quantity)}
                                className="w-full py-4 px-6 rounded-lg font-bold text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                                style={{
                                    background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[500]})`
                                }}
                            >
                                {checkoutLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5 mr-2" />
                                        Proceed to Checkout ({selectedItems.size})
                                    </>
                                )}
                            </button>

                            {/* Checkout warnings */}
                            {selectedItems.size === 0 ? (
                                <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                                    <div className="flex items-center gap-2 text-yellow-700 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>Please select items to proceed to checkout.</span>
                                    </div>
                                </div>
                            ) : selectedCartItems.some(item => !item.product.is_available) ? (
                                <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
                                    <div className="flex items-center gap-2 text-red-700 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>Some selected items are unavailable. Please remove them to continue.</span>
                                    </div>
                                </div>
                            ) : selectedCartItems.some(item => item.product.quantity_available < item.quantity) ? (
                                <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
                                    <div className="flex items-center gap-2 text-red-700 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>Some items exceed available stock. Please adjust quantities.</span>
                                    </div>
                                </div>
                            ) : null}

                            {/* Security Note */}
                            <div className="mt-4 text-xs text-gray-500 text-center">
                                <Shield className="w-4 h-4 inline mr-1" />
                                Secure 256-bit SSL encryption
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommended Products */}
                {recommendedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
                        {productsLoading && products.length === 0 ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin" style={{ color: solarTheme.primary[600] }} />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                {recommendedProducts.map((product) => (
                                    <ProductCard
                                        key={product.product_id}
                                        product={product}
                                        onProductClick={handleProductClick}
                                        onAddToCart={handleAddToCart}
                                        onBuyNow={handleBuyNow}
                                        isAdding={addingProductId === product.product_id}
                                        renderStars={renderStars}
                                        formatPrice={formatPrice}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// Product Card Component
function ProductCard({ product, onProductClick, onAddToCart, onBuyNow, isAdding, renderStars, formatPrice }: any) {
    const isInStock = product.is_available && !product.is_deleted && product.quantity_available > 0;

    // Calculate average rating (mock - you may want to add this to your product data)
    const mockRating = 4.5;
    const mockRatingCount = 150;

    return (
        <div
            className="group cursor-pointer bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border"
            style={{ borderColor: solarTheme.primary[100] }}
            onClick={() => onProductClick(product.product_id)}
        >
            {/* Product Image */}
            <div className="relative h-40 overflow-hidden" style={{
                background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, ${solarTheme.primary[100]})`
            }}>
                <img
                    src={product.image_urls?.[0] || '/packages/product_placeholder.png'}
                    alt={product.title}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/packages/product_placeholder.png";
                    }}
                />
                {!isInStock && (
                    <div className="absolute inset-0 bg-gray-900/20 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Out of Stock
                        </span>
                    </div>
                )}
                {product.is_featured && (
                    <div className="absolute top-2 right-2">
                        <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                            Featured
                        </span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-4">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                    {renderStars(mockRating)}
                    <span className="text-xs text-gray-600 ml-1">({mockRatingCount})</span>
                </div>

                {/* Product Title */}
                <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors leading-tight">
                    {product.title}
                </h3>

                {/* Model Name */}
                <p className="text-xs text-gray-600 mb-2">Model: {product.product_code}</p>

                {/* Category */}
                {product.categories.length > 0 && (
                    <div className="mb-3">
                        <span className="text-xs px-2 py-1 rounded-full" style={{
                            backgroundColor: solarTheme.secondary[100],
                            color: solarTheme.secondary[700]
                        }}>
                            {product.categories[0].category_name}
                        </span>
                    </div>
                )}

                {/* Price */}
                <div className="mb-3">
                    <div className="text-lg font-bold" style={{ color: solarTheme.primary[600] }}>
                        LKR {formatPrice(product.sale_price)}
                    </div>
                    {parseFloat(product.original_price) > parseFloat(product.sale_price) && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 line-through">
                                LKR {formatPrice(product.original_price)}
                            </span>
                            <span className="text-xs font-semibold text-green-600">
                                Save {Math.round(((parseFloat(product.original_price) - parseFloat(product.sale_price)) / parseFloat(product.original_price)) * 100)}%
                            </span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                    <button
                        onClick={(e) => onAddToCart(product.product_id, e)}
                        disabled={!isInStock || isAdding}
                        className="w-full flex cursor-pointer items-center justify-center gap-2 border-2 font-medium py-2 px-3 rounded-lg transition-all duration-200 text-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            borderColor: solarTheme.primary[300],
                            color: solarTheme.primary[600],
                            backgroundColor: 'white'
                        }}
                    >
                        {isAdding ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <ShoppingCart className="w-4 h-4" />
                        )}
                        <span className="truncate">
                            {isAdding ? 'Adding...' : 'Add to Cart'}
                        </span>
                    </button>

                    <button
                        onClick={(e) => onBuyNow(product.product_id, e)}
                        disabled={!isInStock}
                        className="w-full text-white font-bold cursor-pointer py-2 px-3 rounded-lg transition-all duration-200 text-sm hover:shadow-md transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        style={{
                            background: `linear-gradient(to right, ${solarTheme.primary[500]}, ${solarTheme.primary[600]})`
                        }}
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}