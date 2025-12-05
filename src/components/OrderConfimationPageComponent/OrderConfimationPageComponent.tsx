import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    CheckCircle,
    Package,
    Truck,
    Calendar,
    MapPin,
    CreditCard,
    Phone,
    Mail,
    Download,
    Share2,
    ArrowLeft,
    Home,
    Star,
    Clock,
    Shield,
    User,
    Copy,
    Check
} from 'lucide-react';
import { solarTheme } from '@/theme/theme';

interface OrderItem {
    id: number;
    name: string;
    modelName: string;
    category: string;
    price: number;
    image: string;
    quantity: number;
    rating: number;
}

interface OrderDetails {
    orderId: string;
    orderDate: string;
    estimatedDelivery: string;
    status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
    items: OrderItem[];
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    shippingAddress: {
        name: string;
        phone: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    paymentMethod: {
        type: string;
        name: string;
        details: string;
    };
}

// Mock order data
const mockOrderDetails: OrderDetails = {
    orderId: 'ORD-2024-001234',
    orderDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }),
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }),
    status: 'confirmed',
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
    subtotal: 1006800,
    tax: 80544,
    shipping: 0,
    total: 1087344,
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
    }
};

export default function OrderConfirmComponent() {
    const router = useRouter();
    const [orderDetails] = useState<OrderDetails>(mockOrderDetails);
    const [copied, setCopied] = useState(false);
    const [showThankYou, setShowThankYou] = useState(true);

    useEffect(() => {
        // Hide thank you message after 5 seconds
        const timer = setTimeout(() => {
            setShowThankYou(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const copyOrderId = () => {
        navigator.clipboard.writeText(orderDetails.orderId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadInvoice = () => {
        // Mock download functionality
        console.log('Downloading invoice for order:', orderDetails.orderId);
    };

    const handleShareOrder = () => {
        // Mock share functionality
        if (navigator.share) {
            navigator.share({
                title: 'Solar Energy Order Confirmation',
                text: `My solar energy order ${orderDetails.orderId} has been confirmed!`,
                url: window.location.href,
            });
        } else {
            // Fallback for browsers that don't support native sharing
            copyOrderId();
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return solarTheme.primary[600];
            case 'processing': return solarTheme.secondary[600];
            case 'shipped': return solarTheme.accent[600];
            case 'delivered': return solarTheme.success[600];
            default: return solarTheme.primary[600];
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'confirmed': return 'Order Confirmed';
            case 'processing': return 'Processing';
            case 'shipped': return 'Shipped';
            case 'delivered': return 'Delivered';
            default: return 'Confirmed';
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

    return (
        <div className="min-h-screen" style={{
            background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white, ${solarTheme.secondary[50]})`
        }}>
            {/* Thank You Banner */}
            {showThankYou && (
                <div className="w-full py-4 text-center text-white animate-pulse" style={{
                    background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[500]})`
                }}>
                    <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">Thank you for your order! We&apos;re processing it now.</span>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/products')}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Continue Shopping
                    </button>

                    <div className="text-center mb-8">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{
                            backgroundColor: solarTheme.primary[100]
                        }}>
                            <CheckCircle className="w-10 h-10 text-white" style={{ backgroundColor: solarTheme.primary[600] }} />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                        <p className="text-gray-600">Your solar energy system is on its way</p>
                    </div>
                </div>

                {/* Order Summary Card */}
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border" style={{ borderColor: solarTheme.primary[200] }}>
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-6 border-b" style={{ borderColor: solarTheme.primary[200] }}>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                                <span className="px-3 py-1 rounded-full text-sm font-semibold text-white" style={{
                                    backgroundColor: getStatusColor(orderDetails.status)
                                }}>
                                    {getStatusText(orderDetails.status)}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-lg font-bold" style={{ color: solarTheme.primary[600] }}>
                                    {orderDetails.orderId}
                                </span>
                                <button
                                    onClick={copyOrderId}
                                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Copy Order ID"
                                >
                                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Placed on {orderDetails.orderDate}</p>
                        </div>
                        <div className="flex gap-2 mt-4 sm:mt-0">
                            <button
                                onClick={handleDownloadInvoice}
                                className="flex items-center cursor-pointer gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors hover:bg-gray-50"
                                style={{ borderColor: solarTheme.primary[300], color: solarTheme.primary[600] }}
                            >
                                <Download className="w-4 h-4" />
                                Invoice
                            </button>
                            
                        </div>
                    </div>

                    {/* Delivery Timeline */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <Truck className="w-5 h-5 mr-2" style={{ color: solarTheme.primary[600] }} />
                            Delivery Timeline
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: solarTheme.primary[50] }}>
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: solarTheme.primary[600] }}>
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">Order Confirmed</div>
                                    <div className="text-sm text-gray-600">Today</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: solarTheme.secondary[50] }}>
                                <div className="w-8 h-8 rounded-full flex items-center justify-center border-2" style={{ borderColor: solarTheme.secondary[300] }}>
                                    <Package className="w-5 h-5" style={{ color: solarTheme.secondary[600] }} />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">Processing</div>
                                    <div className="text-sm text-gray-600">1-2 days</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: solarTheme.accent[50] }}>
                                <div className="w-8 h-8 rounded-full flex items-center justify-center border-2" style={{ borderColor: solarTheme.accent[300] }}>
                                    <Truck className="w-5 h-5" style={{ color: solarTheme.accent[600] }} />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">Delivered</div>
                                    <div className="text-sm text-gray-600">{orderDetails.estimatedDelivery}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
                        <div className="space-y-4">
                            {orderDetails.items.map((item) => (
                                <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border" style={{ borderColor: solarTheme.primary[200] }}>
                                    <div className="w-full sm:w-20 h-20 flex-shrink-0 mx-auto sm:mx-0">
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
                                    <div className="flex-1 text-center sm:text-left">
                                        <h4 className="font-bold text-gray-900 mb-1">{item.name}</h4>
                                        <p className="text-sm text-gray-600 mb-2">Model: {item.modelName}</p>
                                        <div className="flex items-center justify-center sm:justify-start gap-1 mb-2">
                                            {renderStars(item.rating)}
                                            <span className="text-xs text-gray-500 ml-1">({item.rating})</span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                            <span className="text-sm text-gray-600">Quantity: {item.quantity}</span>
                                            <div className="font-bold" style={{ color: solarTheme.primary[600] }}>
                                                LKR {(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Total */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: solarTheme.primary[50] }}>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal:</span>
                                <span>LKR {orderDetails.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Tax (8%):</span>
                                <span>LKR {orderDetails.tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Shipping:</span>
                                <span style={{ color: solarTheme.primary[600] }}>
                                    {orderDetails.shipping === 0 ? 'FREE' : `LKR ${orderDetails.shipping.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                </span>
                            </div>
                            <div className="border-t pt-2 flex justify-between text-lg font-bold" style={{ borderColor: solarTheme.primary[200] }}>
                                <span>Total:</span>
                                <span style={{ color: solarTheme.primary[600] }}>
                                    LKR {orderDetails.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shipping & Payment Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Shipping Address */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border" style={{ borderColor: solarTheme.primary[200] }}>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <MapPin className="w-5 h-5 mr-2" style={{ color: solarTheme.primary[600] }} />
                            Shipping Address
                        </h3>
                        <div className="space-y-2 text-sm text-gray-700">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span className="font-semibold">{orderDetails.shippingAddress.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>{orderDetails.shippingAddress.phone}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <div>
                                    <div>{orderDetails.shippingAddress.addressLine1}</div>
                                    {orderDetails.shippingAddress.addressLine2 && <div>{orderDetails.shippingAddress.addressLine2}</div>}
                                    <div>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.postalCode}</div>
                                    <div>{orderDetails.shippingAddress.country}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border" style={{ borderColor: solarTheme.primary[200] }}>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <CreditCard className="w-5 h-5 mr-2" style={{ color: solarTheme.primary[600] }} />
                            Payment Method
                        </h3>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-6 rounded border flex items-center justify-center text-xs font-bold text-white" style={{
                                backgroundColor: solarTheme.primary[600]
                            }}>
                                CARD
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">{orderDetails.paymentMethod.name}</div>
                                <div className="text-sm text-gray-600">{orderDetails.paymentMethod.details}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Support Information */}
                <div className="bg-white rounded-xl shadow-lg p-6 border" style={{ borderColor: solarTheme.primary[200] }}>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                <Phone className="w-4 h-4 mr-2" style={{ color: solarTheme.primary[600] }} />
                                Customer Support
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">Call us for immediate assistance</p>
                            <p className="text-lg font-semibold" style={{ color: solarTheme.primary[600] }}>+94 11 234 5678</p>
                            <p className="text-xs text-gray-500">Mon-Fri: 8:00 AM - 6:00 PM</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                <Mail className="w-4 h-4 mr-2" style={{ color: solarTheme.primary[600] }} />
                                Email Support
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">Send us your questions</p>
                            <p className="text-lg font-semibold" style={{ color: solarTheme.primary[600] }}>support@solarenergy.lk</p>
                            <p className="text-xs text-gray-500">We&apos;ll respond within 24 hours</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
                    <button
                        onClick={() => router.push('/orders')}
                        className="px-8 py-3 border cursor-pointer rounded-lg font-semibold transition-colors hover:bg-gray-50"
                        style={{ borderColor: solarTheme.primary[300], color: solarTheme.primary[600] }}
                    >
                        View All Orders
                    </button>
                    <button
                        onClick={() => router.push('/products')}
                        className="px-8 py-3 rounded-lg cursor-pointer font-bold text-white transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                        style={{
                            background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[500]})`
                        }}
                    >
                        <Home className="w-4 h-4" />
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
}