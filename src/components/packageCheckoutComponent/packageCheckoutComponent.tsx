import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    CreditCard,
    Banknote,
    MapPin,
    Package,
    FileText,
    AlertCircle,
    Loader2,
    CheckCircle,
} from 'lucide-react';
import { solarTheme } from '@/theme/theme';
import { AppDispatch } from '@/store/store';
import { createPackageOrder } from '@/store/slices/packageOrderSlice';
import { selectOrderLoading, selectOrderError } from '@/store/slices/packageOrderSlice';
import AddressManageComponent from '@/components/checkoutPageComponent/addressManageComponent';
import { ToastAlert } from '@/components/ui/toast-alert';
import { PaymentMethod } from '@/types/packageOrderTypes';
import { Package as PackageType } from '@/types/packageTypes';
import type { Address } from '@/types/addressTypes';
import { useAuth } from '@/hooks';

interface PackageCheckoutComponentProps {
    packageData: PackageType;
    quantity?: number;
}

interface CustomAlert {
    type: 'error' | 'warning' | 'info';
    message: string;
}

export default function PackageCheckoutComponent({
    packageData,
    quantity = 1,
}: PackageCheckoutComponentProps) {
    const dispatch = useDispatch<AppDispatch>();
    const orderLoading = useSelector(selectOrderLoading);
    const orderError = useSelector(selectOrderError);
    const { user } = useAuth();

    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
    const [notes, setNotes] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [customAlert, setCustomAlert] = useState<CustomAlert | null>(null);

    // Calculate totals
    const salePrice = parseFloat(packageData.sale_price);
    const originalPrice = parseFloat(packageData.original_price);
    const totalAmount = salePrice * quantity;
    const savings = (originalPrice - salePrice) * quantity;

    // Format address for API
    const formatAddress = (address: Address): string => {
        const parts = [
            address.addressLine1,
            address.addressLine2,
            address.city,
            address.state,
            address.postalCode,
            address.country,
        ].filter(Boolean);
        return parts.join(', ');
    };

    // Handle order placement
    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            setCustomAlert({
                type: 'warning',
                message: 'Please select a delivery address'
            });
            return;
        }

        if (!paymentMethod) {
            setCustomAlert({
                type: 'warning',
                message: 'Please select a payment method'
            });
            return;
        }

        setIsProcessing(true);
        setCustomAlert(null);

        try {
            const result = await dispatch(
                createPackageOrder({
                    package_id: packageData.package_id,
                    quantity,
                    delivery_address: formatAddress(selectedAddress),
                    payment_method: paymentMethod,
                    notes: notes.trim() || undefined,
                })
            ).unwrap();

            // Redirect to order confirmation page
            window.location.href = `/order-confirmation/${result.package_order_id}`;
        } catch (error) {
            console.error('Order placement failed:', error);
            setCustomAlert({
                type: 'error',
                message: 'Failed to place order. Please try again.'
            });
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen py-6 px-4" style={{
            background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white)`
        }}>
            {/* Custom Alert */}
            {customAlert && (
                <ToastAlert
                    type={customAlert.type}
                    message={customAlert.message}
                    onClose={() => setCustomAlert(null)}
                />
            )}

            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                    Package Checkout
                </h1>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Checkout Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Delivery Address Section */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="w-5 h-5" style={{ color: solarTheme.primary[600] }} />
                                <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
                            </div>

                            {selectedAddress ? (
                                <div className="border rounded-lg p-4" style={{ borderColor: solarTheme.primary[200] }}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">{user ? `${user.firstName} ${user.lastName}` : 'User'}</p>
                                            {user?.phone && <p className="text-sm text-gray-600">{user.phone}</p>}
                                            <p className="text-sm text-gray-700 mt-2">
                                                {selectedAddress.addressLine1}
                                                {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}
                                            </p>
                                            <p className="text-sm text-gray-700">{selectedAddress.country}</p>
                                        </div>
                                        <button
                                            onClick={() => setShowAddressModal(true)}
                                            className="text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                                            style={{
                                                color: solarTheme.primary[600],
                                                backgroundColor: solarTheme.primary[50],
                                            }}
                                        >
                                            Change
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowAddressModal(true)}
                                    className="w-full py-3 px-4 border-2 border-dashed rounded-lg font-semibold transition-colors"
                                    style={{
                                        borderColor: solarTheme.primary[300],
                                        color: solarTheme.primary[600],
                                    }}
                                >
                                    + Select Delivery Address
                                </button>
                            )}
                        </div>

                        {/* Payment Method Section */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <CreditCard className="w-5 h-5" style={{ color: solarTheme.primary[600] }} />
                                <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Cash Payment */}
                                <button
                                    onClick={() => setPaymentMethod('cash')}
                                    className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                                        paymentMethod === 'cash' ? 'shadow-md' : ''
                                    }`}
                                    style={{
                                        borderColor: paymentMethod === 'cash' ? solarTheme.primary[600] : solarTheme.primary[200],
                                        backgroundColor: paymentMethod === 'cash' ? solarTheme.primary[50] : 'white',
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <Banknote className="w-6 h-6" style={{
                                            color: paymentMethod === 'cash' ? solarTheme.primary[600] : solarTheme.neutral[500]
                                        }} />
                                        <div className="text-left">
                                            <p className="font-semibold text-gray-900">Cash on Delivery</p>
                                            <p className="text-xs text-gray-600">Pay when you receive</p>
                                        </div>
                                        {paymentMethod === 'cash' && (
                                            <CheckCircle className="w-5 h-5 ml-auto" style={{ color: solarTheme.primary[600] }} />
                                        )}
                                    </div>
                                </button>

                                {/* Card Payment */}
                                <button
                                    onClick={() => setPaymentMethod('card')}
                                    className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                                        paymentMethod === 'card' ? 'shadow-md' : ''
                                    }`}
                                    style={{
                                        borderColor: paymentMethod === 'card' ? solarTheme.primary[600] : solarTheme.primary[200],
                                        backgroundColor: paymentMethod === 'card' ? solarTheme.primary[50] : 'white',
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="w-6 h-6" style={{
                                            color: paymentMethod === 'card' ? solarTheme.primary[600] : solarTheme.neutral[500]
                                        }} />
                                        <div className="text-left">
                                            <p className="font-semibold text-gray-900">Card Payment</p>
                                            <p className="text-xs text-gray-600">Credit/Debit card</p>
                                        </div>
                                        {paymentMethod === 'card' && (
                                            <CheckCircle className="w-5 h-5 ml-auto" style={{ color: solarTheme.primary[600] }} />
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Notes Section */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FileText className="w-5 h-5" style={{ color: solarTheme.primary[600] }} />
                                <h2 className="text-xl font-bold text-gray-900">Additional Notes (Optional)</h2>
                            </div>

                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add any special instructions for delivery..."
                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none"
                                style={{
                                    borderColor: solarTheme.primary[300],
                                    minHeight: '100px',
                                }}
                                onFocus={(e) => {
                                    e.target.style.boxShadow = `0 0 0 2px ${solarTheme.primary[500]}`;
                                }}
                                onBlur={(e) => {
                                    e.target.style.boxShadow = '';
                                }}
                            />
                        </div>

                        {/* Error Display */}
                        {orderError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                    <p className="text-red-800 font-semibold">Error placing order</p>
                                </div>
                                <p className="text-red-600 text-sm mt-1">{orderError}</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Package className="w-5 h-5" style={{ color: solarTheme.primary[600] }} />
                                <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                            </div>

                            {/* Package Image */}
                            <div className="mb-4 rounded-lg overflow-hidden" style={{
                                background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, ${solarTheme.primary[100]})`
                            }}>
                                <img
                                    src={packageData.image_urls?.[0] || '/packages/product_placeholder.png'}
                                    alt={packageData.title}
                                    className="w-full h-48 object-contain p-4"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/packages/product_placeholder.png';
                                    }}
                                />
                            </div>

                            {/* Package Details */}
                            <div className="space-y-3">
                                <div>
                                    <h3 className="font-bold text-gray-900">{packageData.title}</h3>
                                    <p className="text-sm" style={{ color: solarTheme.primary[600] }}>
                                        {packageData.subtitle}
                                    </p>
                                </div>

                                <div className="border-t pt-3" style={{ borderColor: solarTheme.primary[100] }}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Package Price:</span>
                                        <span className="font-semibold">
                                            LKR {salePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Quantity:</span>
                                        <span className="font-semibold">{quantity}</span>
                                    </div>
                                    {savings > 0 && (
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-600">Savings:</span>
                                            <span className="font-semibold text-green-600">
                                                - LKR {savings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t pt-3" style={{ borderColor: solarTheme.primary[100] }}>
                                    <div className="flex justify-between">
                                        <span className="font-bold text-gray-900">Total Amount:</span>
                                        <span className="font-bold text-xl" style={{ color: solarTheme.primary[600] }}>
                                            LKR {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={!selectedAddress || isProcessing || orderLoading}
                                className="w-full mt-6 py-3 px-6 rounded-lg font-bold text-white transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                                style={{
                                    background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[500]})`,
                                }}
                            >
                                {isProcessing || orderLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Place Order'
                                )}
                            </button>

                            {!selectedAddress && (
                                <p className="text-xs text-center mt-2 text-gray-500">
                                    Please select a delivery address to continue
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Address Modal */}
            {showAddressModal && (
                <AddressManageComponent
                    onClose={() => setShowAddressModal(false)}
                    onAddressSelect={(address) => {
                        setSelectedAddress(address);
                        setShowAddressModal(false);
                    }}
                />
            )}
        </div>
    );
}
