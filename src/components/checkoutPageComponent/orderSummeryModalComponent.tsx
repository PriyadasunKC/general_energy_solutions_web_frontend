import React, { useState } from 'react';
import {
    X,
    Package,
    MapPin,
    CreditCard,
    Star,
    Truck,
    Shield,
    Clock,
    Phone,
    User,
    AlertCircle,
    CheckCircle,
    Edit3,
    Calendar,
    Calculator
} from 'lucide-react';
import { solarTheme } from '@/theme/theme';

interface OrderItem {
    id: number | string; // Support both number and string IDs (for cart_item_id UUIDs)
    name: string;
    modelName: string;
    category: string;
    price: number;
    image: string;
    quantity: number;
    rating: number;
}

interface Address {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

interface PaymentMethod {
    type: string;
    name: string;
    details: string;
}

interface OrderSummaryData {
    items: OrderItem[];
    shippingAddress: Address;
    paymentMethod?: PaymentMethod; // Made optional since we're using WebXPay
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    estimatedDelivery: string;
    promoCode?: string;
    promoDiscount?: number;
}

interface OrderSummaryModalComponentProps {
    orderData: OrderSummaryData;
    onClose: () => void;
    onConfirm: () => void;
    onEdit?: (section: 'items' | 'address' | 'payment') => void;
    isProcessing?: boolean;
    showPromoCode?: boolean;
}

// Mock order data
const mockOrderData: OrderSummaryData = {
    items: [
        {
            id: 1,
            name: "SolarMax Pro 5kVA Inverter",
            modelName: "SM-5KVA-PRO",
            category: "Inverters",
            price: 780000,
            image: "https://images.ctfassets.net/ukubqezk5u71/5kUEC51eOvCvXZX422ilOX/26bc5b0bff7edba785af547a4eaf547e/solis-350.png?w=300",
            quantity: 1,
            rating: 4.8
        },
        {
            id: 2,
            name: "EcoPanel 450W Monocrystalline",
            modelName: "EP-450M",
            category: "Solar Panels",
            price: 56700,
            image: "https://images.ctfassets.net/ukubqezk5u71/58bbdhCEOelDNNXcEsDmJD/91d2cb1e3d2836775a4a139c1f15918a/DL5.0C.png?w=300",
            quantity: 4,
            rating: 4.9
        }
    ],
    shippingAddress: {
        name: "John Doe",
        phone: "+94 77 123 4567",
        addressLine1: "123 Galle Road",
        addressLine2: "Apartment 4B",
        city: "Colombo",
        state: "Western Province",
        postalCode: "00300",
        country: "Sri Lanka"
    },
    paymentMethod: {
        type: "card",
        name: "Visa ending in 4242",
        details: "**** **** **** 4242"
    },
    subtotal: 1006800,
    tax: 80544,
    shipping: 0,
    total: 1087344,
    estimatedDelivery: "March 15, 2024",
    promoCode: "",
    promoDiscount: 0
};

export default function OrderSummaryModalComponent({
    orderData = mockOrderData,
    onClose,
    onConfirm,
    onEdit,
    isProcessing = false,
    showPromoCode = true
}: OrderSummaryModalComponentProps) {
    const [promoCode, setPromoCode] = useState(orderData.promoCode || '');
    const [promoError, setPromoError] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);
    const [showPromoInput, setShowPromoInput] = useState(false);

    const handleApplyPromo = () => {
        if (!promoCode.trim()) {
            setPromoError('Please enter a promo code');
            return;
        }

        // Mock promo code validation
        const validPromoCodes = ['SOLAR10', 'SAVE15', 'ECO20'];
        const isValidPromo = validPromoCodes.includes(promoCode.toUpperCase());

        if (isValidPromo) {
            setPromoApplied(true);
            setPromoError('');
            // In a real app, you would calculate the discount here
        } else {
            setPromoError('Invalid promo code');
            setPromoApplied(false);
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ));
    };

    const finalTotal = orderData.total - (orderData.promoDiscount || 0);

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-md bg-opacity-50  flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
            <div className="bg-white w-full h-full sm:h-auto sm:max-h-[85vh] sm:min-h-[60vh] sm:rounded-2xl sm:shadow-2xl sm:w-full sm:max-w-4xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-3 sm:p-6 border-b flex items-center justify-between flex-shrink-0 bg-white" style={{ borderColor: solarTheme.primary[200] }}>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">Order Summary</h2>
                        <p className="text-gray-600 text-xs sm:text-sm mt-1">Review your order before confirmation</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors ml-2 flex-shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 pb-20 sm:pb-6">
                        {/* Order Items */}
                        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-6">
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center">
                                    <Package className="w-4 sm:w-5 h-4 sm:h-5 mr-2" style={{ color: solarTheme.primary[600] }} />
                                    Items ({orderData.items.length})
                                </h3>
                                {onEdit && (
                                    <button
                                        onClick={() => onEdit('items')}
                                        className="text-xs sm:text-sm font-medium flex items-center gap-1 transition-colors"
                                        style={{ color: solarTheme.primary[600] }}
                                    >
                                        <Edit3 className="w-3 sm:w-4 h-3 sm:h-4" />
                                        <span className="hidden sm:inline">Edit</span>
                                    </button>
                                )}
                            </div>
                            <div className="space-y-2 sm:space-y-3">
                                {orderData.items.map((item) => (
                                    <div key={item.id} className="bg-white rounded-lg p-3 sm:p-4 flex gap-3 sm:gap-4">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                                            <div className="w-full h-full rounded-lg overflow-hidden" style={{
                                                background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, ${solarTheme.primary[100]})`
                                            }}>
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = "/packages/product_placeholder.png";
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1 leading-tight">{item.name}</h4>
                                            <p className="text-xs text-gray-600 mb-2">Model: {item.modelName}</p>
                                            <div className="flex items-center gap-1 mb-2">
                                                {renderStars(item.rating)}
                                                <span className="text-xs text-gray-500 ml-1">({item.rating})</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs sm:text-sm text-gray-600">Qty: {item.quantity}</span>
                                                <div className="font-bold text-sm sm:text-base" style={{ color: solarTheme.primary[600] }}>
                                                    LKR {(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-6">
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center">
                                    <MapPin className="w-4 sm:w-5 h-4 sm:h-5 mr-2" style={{ color: solarTheme.primary[600] }} />
                                    Address
                                </h3>
                                {onEdit && (
                                    <button
                                        onClick={() => onEdit('address')}
                                        className="text-xs sm:text-sm font-medium flex items-center gap-1 transition-colors"
                                        style={{ color: solarTheme.primary[600] }}
                                    >
                                        <Edit3 className="w-3 sm:w-4 h-3 sm:h-4" />
                                        <span className="hidden sm:inline">Edit</span>
                                    </button>
                                )}
                            </div>
                            <div className="bg-white rounded-lg p-3 sm:p-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <User className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" />
                                        <span className="font-semibold text-gray-900">{orderData.shippingAddress.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" />
                                        <span className="text-gray-700">{orderData.shippingAddress.phone}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-3 sm:w-4 h-3 sm:h-4 mt-0.5 flex-shrink-0" />
                                        <div className="text-gray-700 leading-relaxed">
                                            <div>{orderData.shippingAddress.addressLine1}</div>
                                            {orderData.shippingAddress.addressLine2 && <div>{orderData.shippingAddress.addressLine2}</div>}
                                            <div>{orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.postalCode}</div>
                                            <div>{orderData.shippingAddress.country}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-6">
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center">
                                    <CreditCard className="w-4 sm:w-5 h-4 sm:h-5 mr-2" style={{ color: solarTheme.primary[600] }} />
                                    Payment
                                </h3>
                            </div>
                            <div className="bg-white rounded-lg p-3 sm:p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-6 sm:w-12 sm:h-8 rounded border flex items-center justify-center text-xs font-bold text-white" style={{
                                        backgroundColor: solarTheme.primary[600]
                                    }}>
                                        SECURE
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-gray-900 text-sm sm:text-base">WebXPay Payment Gateway</div>
                                        <div className="text-xs sm:text-sm text-gray-600">Secure payment processing</div>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t flex items-center gap-2 text-xs sm:text-sm text-gray-600" style={{ borderColor: solarTheme.primary[200] }}>
                                    <Shield className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" style={{ color: solarTheme.primary[600] }} />
                                    <span>Payment details will be entered securely on WebXPay</span>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Information */}
                        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-6">
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                                <Truck className="w-4 sm:w-5 h-4 sm:h-5 mr-2" style={{ color: solarTheme.primary[600] }} />
                                Delivery
                            </h3>
                            <div className="bg-white rounded-lg p-3 sm:p-4">
                                <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" style={{ color: solarTheme.primary[600] }} />
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                                            <span className="text-xs sm:text-sm font-medium text-gray-700">Estimated:</span>
                                            <span className="text-xs sm:text-sm font-bold text-gray-900">{orderData.estimatedDelivery}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" style={{ color: solarTheme.primary[600] }} />
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                                            <span className="text-xs sm:text-sm font-medium text-gray-700">Time:</span>
                                            <span className="text-xs sm:text-sm font-bold text-gray-900">9 AM - 6 PM</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Promo Code */}
                        {showPromoCode && (
                            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-6">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                                    <Calculator className="w-4 sm:w-5 h-4 sm:h-5 mr-2" style={{ color: solarTheme.primary[600] }} />
                                    Promo Code
                                </h3>
                                {!showPromoInput ? (
                                    <button
                                        onClick={() => setShowPromoInput(true)}
                                        className="w-full p-3 border-2 border-dashed rounded-lg text-xs sm:text-sm font-medium transition-colors hover:border-solid"
                                        style={{
                                            borderColor: solarTheme.primary[300],
                                            color: solarTheme.primary[600]
                                        }}
                                    >
                                        Have a promo code? Click to apply
                                    </button>
                                ) : (
                                    <div className="bg-white rounded-lg p-3 sm:p-4">
                                        <div className="flex flex-col gap-2">
                                            <input
                                                type="text"
                                                value={promoCode}
                                                onChange={(e) => {
                                                    setPromoCode(e.target.value);
                                                    setPromoError('');
                                                    setPromoApplied(false);
                                                }}
                                                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                                                style={{
                                                    borderColor: promoError ? '#dc2626' : solarTheme.primary[300]
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.boxShadow = `0 0 0 2px ${solarTheme.primary[500]}`;
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.boxShadow = '';
                                                }}
                                                placeholder="Enter promo code"
                                            />
                                            <button
                                                onClick={handleApplyPromo}
                                                className="w-full py-2 px-4 rounded-lg text-sm font-medium text-white transition-colors"
                                                style={{
                                                    backgroundColor: solarTheme.primary[600]
                                                }}
                                            >
                                                Apply Code
                                            </button>
                                        </div>
                                        {promoError && (
                                            <p className="mt-2 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                                {promoError}
                                            </p>
                                        )}
                                        {promoApplied && (
                                            <p className="mt-2 text-xs sm:text-sm flex items-center gap-1" style={{ color: solarTheme.primary[600] }}>
                                                <CheckCircle className="w-3 h-3 flex-shrink-0" />
                                                Promo code applied successfully!
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Order Total */}
                        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 border-2" style={{ borderColor: solarTheme.primary[300] }}>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Order Total</h3>
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal ({orderData.items.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                                    <span className="font-semibold">LKR {orderData.subtotal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax (8%):</span>
                                    <span className="font-semibold">LKR {orderData.tax.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping:</span>
                                    <span className="font-semibold" style={{ color: orderData.shipping === 0 ? solarTheme.primary[600] : 'inherit' }}>
                                        {orderData.shipping === 0 ? 'FREE' : `LKR ${orderData.shipping.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                                    </span>
                                </div>
                                {orderData.promoDiscount && orderData.promoDiscount > 0 && (
                                    <div className="flex justify-between text-sm" style={{ color: solarTheme.primary[600] }}>
                                        <span>Promo Discount:</span>
                                        <span className="font-semibold">-LKR {orderData.promoDiscount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                                    </div>
                                )}
                                <div className="border-t pt-2 sm:pt-3 flex justify-between text-lg sm:text-xl font-bold" style={{ borderColor: solarTheme.primary[200] }}>
                                    <span>Total:</span>
                                    <span style={{ color: solarTheme.primary[600] }}>
                                        LKR {finalTotal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Security & Benefits */}
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-6">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 text-xs sm:text-sm">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" style={{ color: solarTheme.primary[600] }} />
                                    <span className="text-gray-700">Secure Payment</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Truck className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" style={{ color: solarTheme.primary[600] }} />
                                    <span className="text-gray-700">Free Installation</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" style={{ color: solarTheme.primary[600] }} />
                                    <span className="text-gray-700">2-Year Warranty</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions - Fixed on Mobile */}
                <div className="fixed bottom-0 left-0 right-0 sm:relative bg-white p-3 sm:p-6 border-t shadow-lg sm:shadow-none" style={{ borderColor: solarTheme.primary[200] }}>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                            style={{ borderColor: solarTheme.primary[300] }}
                        >
                            <span className="sm:hidden">Back</span>
                            <span className="hidden sm:inline">Continue Shopping</span>
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isProcessing}
                            className="flex-1 px-4 py-3 rounded-lg font-bold text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-sm sm:text-base"
                            style={{
                                background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[500]})`
                            }}
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span className="hidden sm:inline">Processing...</span>
                                    <span className="sm:hidden">Wait...</span>
                                </>
                            ) : (
                                <>
                                    <Shield className="w-4 h-4" />
                                    <span className="hidden sm:inline">Confirm & Place Order</span>
                                    <span className="sm:hidden">Confirm Order</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}