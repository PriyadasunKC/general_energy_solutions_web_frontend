import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    ArrowLeft,
    MapPin,
    CreditCard,
    Truck,
    Shield,
    Star,
    Edit3,
    Plus,
    Check,
    AlertCircle,
    Package,
    Clock,
    User,
    Phone,
    Mail,
    Loader2
} from 'lucide-react';
import { solarTheme } from '@/theme/theme';
import { useCart } from '@/hooks/userHook';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/orderHook';
import { CartItem } from '@/types/userTypes';
import type { Address } from '@/types/addressTypes';
import { CreateOrderPayload } from '@/types/orderTypes';
import { webXPayService } from '@/services/webxpayService';

// Import all the components
import AddressManageComponent from './addressManageComponent';
import OrderSummaryModalComponent from './orderSummeryModalComponent';
import ShippingOptionSelectionComponent from './shippingOptionSelectionComponent';

interface CheckoutItem {
    id: number;
    name: string;
    modelName: string;
    category: string;
    price: number;
    image: string;
    quantity: number;
    rating: number;
    inStock: boolean;
}

// Mock addresses are no longer needed - AddressManageComponent uses Redux
const mockAddresses: Address[] = [];

export default function CheckoutPageComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Redux hooks
    const { cart, cartLoading, initializeCart } = useCart();
    const { user, isAuthenticated, requireAuth } = useAuth();
    const { placeOrder, orderLoading, orderError } = useOrders();

    const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
    const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [selectedShippingOption, setSelectedShippingOption] = useState<string>('standard');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showOrderSummary, setShowOrderSummary] = useState(false);

    // Initialize cart on mount
    useEffect(() => {
        if (isAuthenticated) {
            initializeCart();
        }
    }, [isAuthenticated, initializeCart]);

    // Parse URL parameters to get selected cart items
    useEffect(() => {
        const itemIdsParam = searchParams?.get('items');

        if (itemIdsParam && cart?.items) {
            // Split the comma-separated cart_item_ids
            const cartItemIds = itemIdsParam.split(',');

            // Filter cart items based on the IDs from URL
            const filteredItems = cart.items.filter(item =>
                cartItemIds.includes(item.cart_item_id)
            );

            setCheckoutItems(filteredItems);
        } else if (cart?.items) {
            // If no specific items selected, use all cart items
            setCheckoutItems(cart.items);
        }

        // Set default address
        setSelectedAddress(addresses.find(addr => addr.isDefault) || addresses[0]);
    }, [searchParams, cart]);

    // Handle address selection from modal
    const handleAddressSelect = (address: Address) => {
        setSelectedAddress(address);
        setShowAddressModal(false);
    };

    // Calculate totals
    const subtotal = checkoutItems.reduce((sum, item) => {
        const price = parseFloat(item.product.sale_price);
        return sum + (price * item.quantity);
    }, 0);
    const tax = subtotal * 0.08; // 8% tax

    // Shipping costs based on selected option
    const getShippingCost = (option: string): number => {
        const costs = {
            'standard': subtotal > 300000 ? 0 : 15000,
            'express': 25000,
            'overnight': 45000,
            'scheduled': 20000,
            'pickup': 0
        };
        return costs[option as keyof typeof costs] || 0;
    };

    const shipping = getShippingCost(selectedShippingOption);
    const total = subtotal + tax + shipping;

    // Function to save WebXPay data as JSON file
    const saveWebXPayDataToFile = (endpoint: string, data: Record<string, unknown>) => {
        const logData = {
            timestamp: new Date().toISOString(),
            endpoint: endpoint,
            data: data,
            orderId: data.payment ? 'Check encrypted payment field' : 'N/A'
        };

        const jsonString = JSON.stringify(logData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `webxpay-request-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log('💾 WebXPay request data saved to file:', link.download);
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress || !user) {
            return;
        }

        setIsProcessing(true);

        try {
            // Prepare order payload
            const orderPayload: CreateOrderPayload = {
                products: checkoutItems.map(item => ({
                    product_id: item.product.product_id,
                    quantity: item.quantity,
                })),
                address: `${selectedAddress.addressLine1}, ${selectedAddress.addressLine2 ? selectedAddress.addressLine2 + ', ' : ''}${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.postalCode}, ${selectedAddress.country}`,
                type: 'product',
                payment_type: 'card', // WebXPay handles all payment types
                customer_info: {
                    first_name: user.firstName,
                    last_name: user.lastName,
                    email: user.email,
                    phone: user.phone || '',
                    city: selectedAddress.city,
                    country: selectedAddress.country,
                },
            };

            // Create order and get checkout data
            const { order, checkout } = await placeOrder(orderPayload);

            // Submit to WebXPay payment gateway
            // The checkout data contains the WebXPay request parameters
            if (checkout && checkout.data) {
                // Log WebXPay endpoint and data for debugging
                console.log('═══════════════════════════════════════════════════════');
                console.log('🚀 SUBMITTING TO WEBXPAY');
                console.log('═══════════════════════════════════════════════════════');
                console.log('📍 WebXPay Endpoint:', checkout.url);
                console.log('📦 WebXPay Data:', JSON.stringify(checkout.data, null, 2));
                console.log('═══════════════════════════════════════════════════════');

                // Also log individual fields for easier inspection
                console.group('🔍 WebXPay Request Details');
                Object.entries(checkout.data).forEach(([key, value]) => {
                    console.log(`${key}:`, value);
                });
                console.groupEnd();
                console.log('═══════════════════════════════════════════════════════');

                // Save WebXPay data to JSON file for debugging
                saveWebXPayDataToFile(checkout.url, checkout.data);

                // Log detailed submission info
                console.log('✅ Submitting to WebXPay using webXPayService...');
                console.log('⚠️ NOTE: Enable "Preserve log" in browser DevTools to see logs after redirect');

                // Use webXPayService to handle the submission
                // This ensures proper handling of Base64 encoded data
                webXPayService.submitPaymentRequest(checkout.url, checkout.data);

                // Note: The page will redirect to WebXPay, so no need to update state
            } else {
                throw new Error('Invalid checkout data received');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            setIsProcessing(false);

            // Show error to user
            alert(
                error instanceof Error
                    ? error.message
                    : 'Failed to process order. Please try again.'
            );
        }
    };

    const handleShowOrderSummary = () => {
        setShowOrderSummary(true);
    };

    const handleOrderConfirm = () => {
        setShowOrderSummary(false);
        handlePlaceOrder();
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ));
    };

    const getAddressTypeIcon = (type: string) => {
        switch (type) {
            case 'home': return '🏠';
            case 'office': return '🏢';
            default: return '📍';
        }
    };

    const getShippingOptionName = (option: string): string => {
        const names = {
            'standard': 'Standard Delivery',
            'express': 'Express Delivery',
            'overnight': 'Overnight Express',
            'scheduled': 'Scheduled Delivery',
            'pickup': 'Store Pickup'
        };
        return names[option as keyof typeof names] || 'Standard Delivery';
    };

    const getShippingTime = (option: string): string => {
        const times = {
            'standard': '5-7 business days',
            'express': '2-3 business days',
            'overnight': '1 business day',
            'scheduled': 'Choose your date',
            'pickup': 'Ready in 2-4 hours'
        };
        return times[option as keyof typeof times] || '5-7 business days';
    };

    // Prepare order data for summary modal
    const orderSummaryData = {
        items: checkoutItems.map(item => ({
            id: item.cart_item_id,
            name: item.product.title,
            modelName: item.product.product_code,
            category: item.product.categories[0]?.category_name || 'General',
            price: parseFloat(item.product.sale_price),
            image: item.product.image_urls?.[0] || '/packages/product_placeholder.png',
            quantity: item.quantity,
            rating: 4.5 // You might want to add rating to your product model
        })),
        shippingAddress: selectedAddress ? {
            name: user ? `${user.firstName} ${user.lastName}` : '',
            phone: user?.phone || '',
            addressLine1: selectedAddress.addressLine1,
            addressLine2: selectedAddress.addressLine2 || undefined,
            city: selectedAddress.city,
            state: selectedAddress.state,
            postalCode: selectedAddress.postalCode,
            country: selectedAddress.country
        } : {
            name: '',
            phone: '',
            addressLine1: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
        },
        subtotal,
        tax,
        shipping,
        total,
        estimatedDelivery: "March 15, 2024",
        promoCode: "",
        promoDiscount: 0
    };

    // Loading state
    if (cartLoading && checkoutItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{
                background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white, ${solarTheme.secondary[50]})`
            }}>
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: solarTheme.primary[600] }} />
                    <p className="text-gray-600">Loading checkout...</p>
                </div>
            </div>
        );
    }

    // Empty checkout state
    if (!cartLoading && checkoutItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{
                background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white, ${solarTheme.secondary[50]})`
            }}>
                <div className="text-center">
                    <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">No items to checkout</h2>
                    <p className="text-gray-600 mb-8">Please add items to your cart first.</p>
                    <button
                        onClick={() => router.push('/products')}
                        className="inline-flex items-center px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105"
                        style={{
                            background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[500]})`
                        }}
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{
            background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white, ${solarTheme.secondary[50]})`
        }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Cart
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Checkout</h1>
                    <p className="text-gray-600 mt-2">Review your order and complete your purchase</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                    {/* Main Checkout Form */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Order Items */}
                        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border" style={{ borderColor: solarTheme.primary[200] }}>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <Package className="w-5 h-5 mr-2" style={{ color: solarTheme.primary[600] }} />
                                Order Items ({checkoutItems.length})
                            </h2>
                            <div className="space-y-4">
                                {checkoutItems.map((item) => {
                                    const itemPrice = parseFloat(item.product.sale_price);
                                    const itemTotal = itemPrice * item.quantity;
                                    const itemRating = 4.5; // You might want to add rating to your product model

                                    return (
                                        <div key={item.cart_item_id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border" style={{ borderColor: solarTheme.primary[100], backgroundColor: solarTheme.primary[50] }}>
                                            {/* Product Image */}
                                            <div className="w-full sm:w-20 h-20 flex-shrink-0 mx-auto sm:mx-0">
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
                                            <div className="flex-1 text-center sm:text-left">
                                                <h3 className="font-bold text-gray-900 text-sm mb-1">{item.product.title}</h3>
                                                <p className="text-xs text-gray-600 mb-1">Model: {item.product.product_code}</p>
                                                {item.product.categories.length > 0 && (
                                                    <span className="inline-block text-xs px-2 py-1 rounded-full mb-2" style={{
                                                        backgroundColor: solarTheme.secondary[100],
                                                        color: solarTheme.secondary[700]
                                                    }}>
                                                        {item.product.categories[0].category_name}
                                                    </span>
                                                )}
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                    <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                                                    <div className="text-right">
                                                        <div className="font-bold" style={{ color: solarTheme.primary[600] }}>
                                                            LKR {itemTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            LKR {itemPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} each
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border" style={{ borderColor: solarTheme.primary[200] }}>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center mb-2 sm:mb-0">
                                    <MapPin className="w-5 h-5 mr-2" style={{ color: solarTheme.primary[600] }} />
                                    Shipping Address
                                </h2>
                                <button
                                    onClick={() => setShowAddressModal(true)}
                                    className="inline-flex items-center text-sm font-medium transition-colors self-start sm:self-auto"
                                    style={{ color: solarTheme.primary[600] }}
                                >
                                    <Edit3 className="w-4 h-4 mr-1" />
                                    Change
                                </button>
                            </div>

                            {selectedAddress ? (
                                <div className="p-4 rounded-lg border" style={{ borderColor: solarTheme.primary[200], backgroundColor: solarTheme.primary[50] }}>
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-sm">{getAddressTypeIcon(selectedAddress.label)}</span>
                                                <span className="font-bold text-gray-900">{user ? `${user.firstName} ${user.lastName}` : 'User'}</span>
                                                {selectedAddress.isDefault && (
                                                    <span className="text-xs px-2 py-1 rounded-full text-white" style={{ backgroundColor: solarTheme.primary[600] }}>
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-700 space-y-1">
                                                {user?.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-3 h-3" />
                                                        {user.phone}
                                                    </div>
                                                )}
                                                <div className="flex items-start gap-2">
                                                    <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <div>{selectedAddress.addressLine1}</div>
                                                        {selectedAddress.addressLine2 && <div>{selectedAddress.addressLine2}</div>}
                                                        <div>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}</div>
                                                        <div>{selectedAddress.country}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 rounded-lg border border-dashed" style={{ borderColor: solarTheme.primary[300] }}>
                                    <p className="text-gray-600 text-center">No address selected</p>
                                </div>
                            )}
                        </div>

                        {/* Payment Information */}
                        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border" style={{ borderColor: solarTheme.primary[200] }}>
                            <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4">
                                <CreditCard className="w-5 h-5 mr-2" style={{ color: solarTheme.primary[600] }} />
                                Payment
                            </h2>
                            <div className="p-4 rounded-lg border" style={{ borderColor: solarTheme.primary[200], backgroundColor: solarTheme.primary[50] }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-8 rounded border flex items-center justify-center text-xs font-bold text-white" style={{
                                        backgroundColor: solarTheme.primary[600]
                                    }}>
                                        SECURE
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">WebXPay Payment Gateway</div>
                                        <div className="text-sm text-gray-600">Secure payment processing</div>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t" style={{ borderColor: solarTheme.primary[200] }}>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Shield className="w-4 h-4" style={{ color: solarTheme.primary[600] }} />
                                        <span>You will enter payment details securely on the WebXPay platform</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Options */}
                        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border" style={{ borderColor: solarTheme.primary[200] }}>
                            <ShippingOptionSelectionComponent
                                selectedOption={selectedShippingOption}
                                onOptionChange={setSelectedShippingOption}
                                orderValue={subtotal}
                                deliveryLocation={selectedAddress ? { city: selectedAddress.city, state: selectedAddress.state } : { city: 'Colombo', state: 'Western Province' }}
                            />
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="xl:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 sticky top-4 sm:top-8 border" style={{ borderColor: solarTheme.primary[200] }}>
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal ({checkoutItems.length} items):</span>
                                    <span className="font-semibold">LKR {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax (8%):</span>
                                    <span className="font-semibold">LKR {tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping ({getShippingOptionName(selectedShippingOption)}):</span>
                                    <span className="font-semibold">
                                        {shipping === 0 ? (
                                            <span style={{ color: solarTheme.primary[600] }}>FREE</span>
                                        ) : (
                                            `LKR ${shipping.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                        )}
                                    </span>
                                </div>
                                <div className="border-t pt-3" style={{ borderColor: solarTheme.primary[200] }}>
                                    <div className="flex justify-between text-xl font-bold">
                                        <span>Total:</span>
                                        <span style={{ color: solarTheme.primary[600] }}>LKR {total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Benefits */}
                            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: solarTheme.primary[50] }}>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4" style={{ color: solarTheme.primary[600] }} />
                                        <span>2-year warranty included</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Truck className="w-4 h-4" style={{ color: solarTheme.primary[600] }} />
                                        <span>Professional installation available</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4" style={{ color: solarTheme.primary[600] }} />
                                        <span>Free returns within 30 days</span>
                                    </div>
                                </div>
                            </div>

                            {/* Review Order Button */}
                            <button
                                onClick={handleShowOrderSummary}
                                disabled={!selectedAddress}
                                className="w-full mb-3 py-3 px-6 rounded-lg font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center border-2"
                                style={{
                                    borderColor: solarTheme.primary[300],
                                    color: solarTheme.primary[600],
                                    backgroundColor: 'white'
                                }}
                            >
                                <Check className="w-5 h-5 mr-2" />
                                Review Order
                            </button>

                            {/* Place Order Button */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={isProcessing || !selectedAddress}
                                className="w-full py-3 sm:py-4 px-6 rounded-lg font-bold text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                                style={{
                                    background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[500]})`
                                }}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Shield className="w-5 h-5 mr-2" />
                                        Proceed to Payment
                                    </>
                                )}
                            </button>

                            {/* Validation Messages */}
                            {!selectedAddress && (
                                <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                                    <div className="flex items-center gap-2 text-yellow-700 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>Please select a shipping address</span>
                                    </div>
                                </div>
                            )}

                            {/* Security Note */}
                            <div className="mt-4 text-xs text-gray-500 text-center">
                                <Shield className="w-4 h-4 inline mr-1" />
                                Secure 256-bit SSL encryption
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showAddressModal && (
                <AddressManageComponent
                    onClose={() => setShowAddressModal(false)}
                    onAddressSelect={handleAddressSelect}
                />
            )}

            {showOrderSummary && (
                <OrderSummaryModalComponent
                    orderData={orderSummaryData}
                    onClose={() => setShowOrderSummary(false)}
                    onConfirm={handleOrderConfirm}
                    isProcessing={isProcessing}
                    showPromoCode={true}
                />
            )}
        </div>
    );
}