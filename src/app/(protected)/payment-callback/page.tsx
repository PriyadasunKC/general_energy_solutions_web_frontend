'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { solarTheme } from '@/theme/theme';
import { webXPayService } from '@/services/webxpayService';
import { useOrders } from '@/hooks/orderHook';

/**
 * Payment Callback Page
 * Handles the response from WebXPay payment gateway
 *
 * IMPORTANT: This page receives encrypted response from WebXPay and
 * sends it to the backend for verification and decryption.
 * Frontend does NOT decrypt or parse the response.
 */

interface PaymentCallbackData {
    success: boolean;
    orderId: string;
    orderReferenceNumber?: string;
    transactionDateTime?: string;
    statusCode?: string;
    comment?: string;
    paymentGatewayUsed?: string;
}

export default function PaymentCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { fetchPaymentStatus, fetchOrder } = useOrders();

    const [isProcessing, setIsProcessing] = useState(true);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paymentData, setPaymentData] = useState<PaymentCallbackData | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);

    useEffect(() => {
        // Process the payment callback
        const processCallback = async () => {
            try {
                // Get encrypted response from URL parameters
                const payment = searchParams?.get('payment');
                const signature = searchParams?.get('signature');
                const customFields = searchParams?.get('custom_fields');

                if (!payment || !signature) {
                    throw new Error('Invalid payment response - missing parameters');
                }

                console.log('═══════════════════════════════════════════════════════');
                console.log('📥 WEBXPAY CALLBACK RECEIVED');
                console.log('═══════════════════════════════════════════════════════');
                console.log('Payment (encrypted):', payment);
                console.log('Signature (encrypted):', signature);
                console.log('Custom Fields:', customFields);
                console.log('═══════════════════════════════════════════════════════');

                // Send encrypted response to backend for verification and decryption
                // The backend will decrypt, verify signature, and update order status
                const backendResponse = await fetch('/api/payment/verify-callback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        payment,
                        signature,
                        custom_fields: customFields,
                    }),
                });

                if (!backendResponse.ok) {
                    throw new Error('Failed to verify payment with backend');
                }

                const callbackData: PaymentCallbackData = await backendResponse.json();

                console.log('✅ Backend verification successful:', callbackData);

                // Update UI state based on backend response
                setPaymentSuccess(callbackData.success);
                setPaymentData(callbackData);
                setOrderId(callbackData.orderId);

                if (callbackData.success) {
                    // Fetch the updated order details from backend
                    try {
                        await fetchPaymentStatus(callbackData.orderId);
                        await fetchOrder(callbackData.orderId);
                    } catch (error) {
                        console.error('Error fetching order details:', error);
                        // Continue anyway since payment was successful
                    }
                } else {
                    setErrorMessage(
                        callbackData.comment ||
                        (callbackData.statusCode
                            ? webXPayService.getPaymentStatusMessage(callbackData.statusCode)
                            : 'Payment was declined')
                    );
                }
            } catch (error) {
                console.error('Error processing payment callback:', error);
                setPaymentSuccess(false);
                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : 'An error occurred while processing your payment'
                );
            } finally {
                setIsProcessing(false);
            }
        };

        processCallback();
    }, [searchParams, fetchPaymentStatus, fetchOrder]);

    const handleContinue = () => {
        if (paymentSuccess && orderId) {
            router.push(`/order-confirmation/${orderId}`);
        } else {
            router.push('/checkout');
        }
    };

    const handleViewOrders = () => {
        router.push('/orders');
    };

    const handleReturnHome = () => {
        router.push('/');
    };

    // Loading state
    if (isProcessing) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{
                    background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white, ${solarTheme.secondary[50]})`,
                }}
            >
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
                    <div className="text-center">
                        <Loader2
                            className="w-16 h-16 animate-spin mx-auto mb-6"
                            style={{ color: solarTheme.primary[600] }}
                        />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Processing Payment
                        </h2>
                        <p className="text-gray-600">
                            Please wait while we confirm your payment...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Success state
    if (paymentSuccess && paymentData) {
        return (
            <div
                className="min-h-screen flex items-center justify-center py-12 px-4"
                style={{
                    background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white, ${solarTheme.secondary[50]})`,
                }}
            >
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
                    {/* Success Icon */}
                    <div className="text-center mb-6">
                        <div
                            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                            style={{ backgroundColor: solarTheme.primary[100] }}
                        >
                            <CheckCircle
                                className="w-12 h-12"
                                style={{ color: solarTheme.primary[600] }}
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Payment Successful!
                        </h1>
                        <p className="text-gray-600">
                            Your payment has been processed successfully.
                        </p>
                    </div>

                    {/* Payment Details */}
                    <div
                        className="mb-6 p-6 rounded-lg"
                        style={{ backgroundColor: solarTheme.primary[50] }}
                    >
                        <h2 className="text-lg font-bold text-gray-900 mb-4">
                            Payment Details
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Order ID:</span>
                                <span className="font-semibold text-gray-900">
                                    {paymentData.orderId}
                                </span>
                            </div>
                            {paymentData.orderReferenceNumber && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Transaction Reference:</span>
                                    <span className="font-semibold text-gray-900">
                                        {paymentData.orderReferenceNumber}
                                    </span>
                                </div>
                            )}
                            {paymentData.transactionDateTime && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Transaction Date:</span>
                                    <span className="font-semibold text-gray-900">
                                        {new Date(paymentData.transactionDateTime).toLocaleString()}
                                    </span>
                                </div>
                            )}
                            {paymentData.paymentGatewayUsed && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Method:</span>
                                    <span className="font-semibold text-gray-900">
                                        {paymentData.paymentGatewayUsed}
                                    </span>
                                </div>
                            )}
                            {paymentData.statusCode && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span
                                        className="font-semibold"
                                        style={{ color: solarTheme.primary[600] }}
                                    >
                                        {webXPayService.getPaymentStatusMessage(paymentData.statusCode)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleContinue}
                            className="flex-1 py-3 px-6 rounded-lg font-bold text-white transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                            style={{
                                background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[500]})`,
                            }}
                        >
                            View Order Details
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleViewOrders}
                            className="flex-1 py-3 px-6 rounded-lg font-medium border-2 transition-all duration-300 hover:bg-gray-50"
                            style={{
                                borderColor: solarTheme.primary[300],
                                color: solarTheme.primary[600],
                            }}
                        >
                            View All Orders
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            onClick={handleReturnHome}
                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Return to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Error/Failure state
    return (
        <div
            className="min-h-screen flex items-center justify-center py-12 px-4"
            style={{
                background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white, ${solarTheme.secondary[50]})`,
            }}
        >
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
                {/* Error Icon */}
                <div className="text-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
                        <XCircle className="w-12 h-12 text-red-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Payment Failed
                    </h1>
                    <p className="text-gray-600">
                        We couldn&apos;t process your payment. Please try again.
                    </p>
                </div>

                {/* Error Details */}
                {errorMessage && (
                    <div className="mb-6 p-6 rounded-lg bg-red-50 border border-red-200">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-red-900 mb-1">Error Details</h3>
                                <p className="text-red-700 text-sm">{errorMessage}</p>
                            </div>
                        </div>
                    </div>
                )}

                {paymentData && (
                    <div className="mb-6 p-6 rounded-lg bg-gray-50">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">
                            Transaction Details
                        </h2>
                        <div className="space-y-3">
                            {paymentData.orderId && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Order ID:</span>
                                    <span className="font-semibold text-gray-900">
                                        {paymentData.orderId}
                                    </span>
                                </div>
                            )}
                            {paymentData.orderReferenceNumber && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Transaction Reference:</span>
                                    <span className="font-semibold text-gray-900">
                                        {paymentData.orderReferenceNumber}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className="font-semibold text-red-600">
                                    {paymentData.comment || 'Transaction declined'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleContinue}
                        className="flex-1 py-3 px-6 rounded-lg font-bold text-white transition-all duration-300 hover:scale-105"
                        style={{
                            background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[500]})`,
                        }}
                    >
                        Try Again
                    </button>
                    <button
                        onClick={handleReturnHome}
                        className="flex-1 py-3 px-6 rounded-lg font-medium border-2 transition-all duration-300 hover:bg-gray-50"
                        style={{
                            borderColor: solarTheme.primary[300],
                            color: solarTheme.primary[600],
                        }}
                    >
                        Return to Home
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 mb-2">
                        Need help? Contact our support team
                    </p>
                    <a
                        href="/contact-us"
                        className="text-sm font-medium hover:underline"
                        style={{ color: solarTheme.primary[600] }}
                    >
                        Get Support
                    </a>
                </div>
            </div>
        </div>
    );
}
