'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchPackageOrderById } from '@/store/slices/packageOrderSlice';
import { selectCurrentOrder, selectOrderLoading, selectOrderError } from '@/store/slices/packageOrderSlice';
import PDFQuotationComponent from '@/components/pdfQuotationComponent/pdfQuotationComponent';
import { CheckCircle, Package, MapPin, CreditCard, AlertCircle, Loader2, Home } from 'lucide-react';
import { solarTheme } from '@/theme/theme';

export default function OrderConfirmationPage() {
    const params = useParams();
    const orderId = params?.orderId as string;
    const dispatch = useDispatch<AppDispatch>();

    const currentOrder = useSelector((state: RootState) => selectCurrentOrder(state));
    const orderLoading = useSelector(selectOrderLoading);
    const orderError = useSelector(selectOrderError);

    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        const loadOrderData = async () => {
            if (orderId) {
                try {
                    await dispatch(fetchPackageOrderById(orderId)).unwrap();
                } catch (error) {
                    console.error('Failed to load order:', error);
                } finally {
                    setIsLoadingData(false);
                }
            }
        };

        loadOrderData();
    }, [orderId, dispatch]);

    // Loading state
    if (orderLoading || isLoadingData) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{
                background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white)`
            }}>
                <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4" style={{ color: solarTheme.primary[600] }} />
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (orderError) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{
                background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white)`
            }}>
                <div className="text-center max-w-md mx-auto p-8">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Order</h2>
                    <p className="text-gray-600 mb-4">{orderError}</p>
                    <button
                        onClick={() => window.location.href = '/main-products'}
                        className="px-6 py-2 rounded-lg text-white font-semibold"
                        style={{ backgroundColor: solarTheme.primary[600] }}
                    >
                        Back to Packages
                    </button>
                </div>
            </div>
        );
    }

    // No order found
    if (!currentOrder) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{
                background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white)`
            }}>
                <div className="text-center max-w-md mx-auto p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
                    <p className="text-gray-600 mb-4">The order you are looking for does not exist.</p>
                    <button
                        onClick={() => window.location.href = '/main-products'}
                        className="px-6 py-2 rounded-lg text-white font-semibold"
                        style={{ backgroundColor: solarTheme.primary[600] }}
                    >
                        Back to Packages
                    </button>
                </div>
            </div>
        );
    }

    const totalPrice = parseFloat(currentOrder.total_price);

    return (
        <div className="min-h-screen py-8 px-4" style={{
            background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white)`
        }}>
            <div className="max-w-5xl mx-auto">
                {/* Success Message */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
                        style={{ backgroundColor: solarTheme.primary[100] }}
                    >
                        <CheckCircle className="w-12 h-12" style={{ color: solarTheme.primary[600] }} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-gray-600 mb-4">
                        Thank you for your order. We will process it shortly.
                    </p>
                    <div className="inline-block px-6 py-3 rounded-lg" style={{
                        backgroundColor: solarTheme.primary[50],
                        color: solarTheme.primary[700]
                    }}>
                        <p className="text-sm font-semibold">Order ID</p>
                        <p className="text-lg font-bold">{currentOrder.package_order_id.slice(0, 8).toUpperCase()}</p>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {/* Package Info */}
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Package className="w-5 h-5 mt-1" style={{ color: solarTheme.primary[600] }} />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">Package Details</h3>
                                    <p className="text-sm text-gray-700 font-medium">{currentOrder.title}</p>
                                    <p className="text-xs text-gray-600">{currentOrder.subtitle}</p>
                                    <p className="text-sm text-gray-600 mt-2">
                                        Package Code: <span className="font-semibold">{currentOrder.package_code}</span>
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Quantity: <span className="font-semibold">{currentOrder.quantity}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CreditCard className="w-5 h-5 mt-1" style={{ color: solarTheme.primary[600] }} />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">Payment Information</h3>
                                    <p className="text-sm text-gray-700">
                                        Method: <span className="font-semibold capitalize">{currentOrder.payment_method}</span>
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        Status: <span className="font-semibold capitalize px-2 py-1 rounded text-xs"
                                            style={{
                                                backgroundColor: solarTheme.secondary[100],
                                                color: solarTheme.secondary[700]
                                            }}
                                        >
                                            {currentOrder.payment_status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Info */}
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 mt-1" style={{ color: solarTheme.primary[600] }} />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">Delivery Address</h3>
                                    <p className="text-sm text-gray-700">{currentOrder.delivery_address}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 mt-1" style={{ color: solarTheme.primary[600] }} />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">Order Status</h3>
                                    <p className="text-sm">
                                        <span className="font-semibold capitalize px-3 py-1 rounded"
                                            style={{
                                                backgroundColor: solarTheme.primary[100],
                                                color: solarTheme.primary[700]
                                            }}
                                        >
                                            {currentOrder.order_status}
                                        </span>
                                    </p>
                                    <p className="text-xs text-gray-600 mt-2">
                                        Order placed on {new Date(currentOrder.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Summary */}
                    <div className="border-t pt-6" style={{ borderColor: solarTheme.primary[200] }}>
                        <div className="bg-gray-50 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-gray-700">Package Price:</span>
                                <span className="font-semibold">
                                    LKR {parseFloat(currentOrder.sale_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-gray-700">Quantity:</span>
                                <span className="font-semibold">{currentOrder.quantity}</span>
                            </div>
                            {parseFloat(currentOrder.original_price) > parseFloat(currentOrder.sale_price) && (
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-700">Savings:</span>
                                    <span className="font-semibold text-green-600">
                                        - LKR {((parseFloat(currentOrder.original_price) - parseFloat(currentOrder.sale_price)) * currentOrder.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            )}
                            <div className="border-t pt-3 flex justify-between items-center" style={{ borderColor: solarTheme.primary[300] }}>
                                <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                                <span className="text-2xl font-bold" style={{ color: solarTheme.primary[600] }}>
                                    LKR {totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {currentOrder.notes && (
                        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: solarTheme.primary[50] }}>
                            <h3 className="font-semibold text-gray-900 mb-2">Additional Notes:</h3>
                            <p className="text-sm text-gray-700 italic">{currentOrder.notes}</p>
                        </div>
                    )}
                </div>

                {/* PDF Quotation */}
                <PDFQuotationComponent order={currentOrder} />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
                    <button
                        onClick={() => window.location.href = '/main-products'}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-all duration-200 hover:scale-105"
                        style={{
                            background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[500]})`,
                        }}
                    >
                        <Package className="w-5 h-5" />
                        Continue Shopping
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold border-2 transition-all duration-200 hover:bg-gray-50"
                        style={{
                            borderColor: solarTheme.primary[600],
                            color: solarTheme.primary[600],
                        }}
                    >
                        <Home className="w-5 h-5" />
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
