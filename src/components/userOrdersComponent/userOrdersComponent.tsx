/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Package,
    ShoppingBag,
    Calendar,
    MapPin,
    CreditCard,
    Check,
    X,
    Loader2,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Eye,
    XCircle,
    Clock,
    CheckCircle,
    XOctagon,
    Truck,
    Filter,
    RefreshCw,
    ChevronRight,
} from 'lucide-react';
import { useOrders } from '@/hooks/orderHook';
import { useAuth } from '@/hooks/useAuth';
import { solarTheme } from '@/theme/theme';
import { Order, OrderStatus } from '@/types/orderTypes';
import { OrderService } from '@/services/orderService';
import OrdersPageSkeleton from '@/components/ui/Skeletons/OrdersPageSkeleton';
import { OrderCardSkeletonList } from '@/components/ui/Skeletons/OrderCardSkeleton';
import Pagination from '@/components/ui/Pagination';

export default function UserOrdersComponent() {
    const router = useRouter();
    const { isAuthenticated, requireAuth } = useAuth();

    const {
        orders,
        ordersLoading,
        ordersError,
        pagination,
        isInitialized,
        filters,
        cancellingOrder,
        cancelOrderError,
        fetchAllOrders,
        cancelOrder,
        setFilters,
        clearErrors,
        formatOrderTotal,
        getOrderStatusColor,
        canCancelOrder,
    } = useOrders();

    // Local state
    const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
    const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
    const [selectedOrderForSheet, setSelectedOrderForSheet] = useState<Order | null>(null);
    const [showBottomSheet, setShowBottomSheet] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Initialize orders
    useEffect(() => {
        if (isAuthenticated && !isInitialized) {
            fetchAllOrders({ page: 1, limit: 10 });
        }
    }, [isAuthenticated, isInitialized, fetchAllOrders]);

    // Pull to refresh functionality
    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        const params: any = { page: pagination.page || 1, limit: 10 };
        if (selectedStatus !== 'all') {
            params.status = selectedStatus;
        }
        await fetchAllOrders(params);
        setTimeout(() => setIsRefreshing(false), 500);
    }, [fetchAllOrders, selectedStatus, pagination.page]);

    // Touch handlers for pull-to-refresh
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientY);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isUpSwipe = distance > 50;
        const isDownSwipe = distance < -50;

        // Pull down to refresh when at top of page
        if (isDownSwipe && window.scrollY === 0) {
            handleRefresh();
        }
    };

    // Open order details in bottom sheet (mobile) or expand (desktop)
    const handleOrderClick = (order: Order) => {
        if (window.innerWidth < 768) {
            setSelectedOrderForSheet(order);
            setShowBottomSheet(true);
        } else {
            toggleOrderExpansion(order.order_id);
        }
    };

    // Close bottom sheet
    const closeBottomSheet = () => {
        setShowBottomSheet(false);
        setTimeout(() => setSelectedOrderForSheet(null), 300);
    };

    // Handle status filter change
    const handleStatusFilter = (status: OrderStatus | 'all') => {
        setSelectedStatus(status);
        if (status === 'all') {
            setFilters({ status: undefined, page: 1 });
            fetchAllOrders({ page: 1, limit: 10 });
        } else {
            setFilters({ status, page: 1 });
            fetchAllOrders({ page: 1, limit: 10, status });
        }
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        const params: any = { page, limit: 10 };
        if (selectedStatus !== 'all') {
            params.status = selectedStatus;
        }
        setFilters({ ...filters, page });
        fetchAllOrders(params);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Toggle order expansion
    const toggleOrderExpansion = (orderId: string) => {
        setExpandedOrders(prev => {
            const newExpanded = new Set(prev);
            if (newExpanded.has(orderId)) {
                newExpanded.delete(orderId);
            } else {
                newExpanded.add(orderId);
            }
            return newExpanded;
        });
    };

    // Handle cancel order
    const handleCancelOrder = (order: Order) => {
        setOrderToCancel(order);
        setShowCancelDialog(true);
    };

    const confirmCancelOrder = async () => {
        if (!orderToCancel) return;

        setCancellingOrderId(orderToCancel.order_id);
        try {
            await cancelOrder(orderToCancel.order_id);
            setShowCancelDialog(false);
            setOrderToCancel(null);
        } catch (error) {
            console.error('Failed to cancel order:', error);
        } finally {
            setCancellingOrderId(null);
        }
    };

    // Handle view order details
    const handleViewOrder = (orderId: string) => {
        router.push(`/orders/${orderId}`);
    };

    // Get status icon
    const getStatusIcon = (status: OrderStatus) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-5 h-5" />;
            case 'confirmed':
                return <CheckCircle className="w-5 h-5" />;
            case 'completed':
                return <Check className="w-5 h-5" />;
            case 'cancelled':
                return <XOctagon className="w-5 h-5" />;
            default:
                return <Package className="w-5 h-5" />;
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        return OrderService.formatOrderDateShort(dateString);
    };

    const formatPrice = (price: string | number) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return numPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Filter buttons
    const statusFilters: Array<{ value: OrderStatus | 'all'; label: string }> = [
        { value: 'all', label: 'All Orders' },
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    // Loading state
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{
                background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white, ${solarTheme.secondary[50]})`
            }}>
                <div className="text-center">
                    <p className="text-gray-600">Please sign in to view your orders</p>
                </div>
            </div>
        );
    }

    if (ordersLoading && !isInitialized) {
        return <OrdersPageSkeleton />;
    }

    // Empty state
    if (!ordersLoading && orders.length === 0 && selectedStatus === 'all') {
        return (
            <div className="min-h-screen" style={{
                background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white, ${solarTheme.secondary[50]})`
            }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center" style={{
                            backgroundColor: solarTheme.primary[100]
                        }}>
                            <Package className="w-12 h-12" style={{ color: solarTheme.primary[600] }} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            You haven&apos;t placed any orders yet. Start shopping to see your orders here.
                        </p>
                        <button
                            onClick={() => router.push('/products')}
                            className="inline-flex items-center px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105"
                            style={{
                                background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[500]})`
                            }}
                        >
                            <ShoppingBag className="w-5 h-5 mr-2" />
                            Start Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen"
            style={{
                background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white, ${solarTheme.secondary[50]})`
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                {/* Header with Refresh - Mobile App Style */}
                <div className="mb-4 sm:mb-6 lg:mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">My Orders</h1>
                            <p className="text-sm sm:text-base text-gray-600">
                                Track and manage your orders
                            </p>
                        </div>
                        {/* Refresh Button - Mobile Friendly */}
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="md:hidden p-3 rounded-full transition-all duration-200 active:scale-95"
                            style={{
                                backgroundColor: isRefreshing ? solarTheme.primary[100] : solarTheme.primary[50],
                            }}
                            aria-label="Refresh orders"
                        >
                            <RefreshCw
                                className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`}
                                style={{ color: solarTheme.primary[600] }}
                            />
                        </button>
                    </div>
                    {/* Pull to refresh hint - only on mobile */}
                    {isRefreshing && (
                        <div className="md:hidden mt-2 text-xs text-center" style={{ color: solarTheme.primary[600] }}>
                            Refreshing orders...
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {(ordersError || cancelOrderError) && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-red-700 flex-1 min-w-0">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm sm:text-base truncate">{ordersError || cancelOrderError}</span>
                        </div>
                        <button
                            onClick={clearErrors}
                            className="text-red-700 hover:text-red-900 p-1 flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-label="Close error message"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Status Filters - Mobile Optimized */}
                <div className="mb-4 sm:mb-6">
                    {/* Mobile: Collapsible Filter */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="w-full bg-white rounded-xl shadow-lg p-4 border flex items-center justify-between active:scale-[0.99] transition-transform"
                            style={{ borderColor: solarTheme.primary[200] }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg" style={{ backgroundColor: solarTheme.primary[100] }}>
                                    <Filter className="w-5 h-5" style={{ color: solarTheme.primary[600] }} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-900 text-base">Filter Orders</h3>
                                    <p className="text-sm text-gray-600">
                                        {selectedStatus === 'all' ? 'All Orders' : statusFilters.find(f => f.value === selectedStatus)?.label}
                                    </p>
                                </div>
                            </div>
                            <ChevronDown
                                className={`w-5 h-5 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}
                                style={{ color: solarTheme.primary[600] }}
                            />
                        </button>

                        {/* Mobile Filter Dropdown */}
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                showFilters ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                            }`}
                        >
                            <div className="bg-white rounded-xl shadow-lg border p-3 space-y-2" style={{ borderColor: solarTheme.primary[200] }}>
                                {statusFilters.map((filter) => (
                                    <button
                                        key={filter.value}
                                        onClick={() => {
                                            handleStatusFilter(filter.value);
                                            setShowFilters(false);
                                        }}
                                        className={`w-full px-4 py-3.5 rounded-lg font-medium transition-all duration-200 text-left flex items-center justify-between active:scale-[0.98] ${
                                            selectedStatus === filter.value
                                                ? 'text-white shadow-md'
                                                : 'text-gray-700 bg-gray-50 active:bg-gray-200'
                                        }`}
                                        style={
                                            selectedStatus === filter.value
                                                ? {
                                                    background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[500]})`
                                                }
                                                : {}
                                        }
                                    >
                                        <span>{filter.label}</span>
                                        {selectedStatus === filter.value && <Check className="w-5 h-5" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Desktop: Horizontal Filters */}
                    <div className="hidden md:block bg-white rounded-xl shadow-lg p-5 border" style={{ borderColor: solarTheme.primary[200] }}>
                        <div className="flex items-center gap-2 mb-4">
                            <Filter className="w-5 h-5 flex-shrink-0" style={{ color: solarTheme.primary[600] }} />
                            <h3 className="font-semibold text-gray-900">Filter by Status</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {statusFilters.map((filter) => (
                                <button
                                    key={filter.value}
                                    onClick={() => handleStatusFilter(filter.value)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                        selectedStatus === filter.value
                                            ? 'text-white shadow-md'
                                            : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                                    }`}
                                    style={
                                        selectedStatus === filter.value
                                            ? {
                                                background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[500]})`
                                            }
                                            : {}
                                    }
                                >
                                    {filter.label}
                                    {filter.value === 'all' && ` (${pagination.total})`}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                {ordersLoading && orders.length === 0 ? (
                    <OrderCardSkeletonList count={5} />
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center border" style={{ borderColor: solarTheme.primary[200] }}>
                        <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">No {selectedStatus !== 'all' ? selectedStatus : ''} orders found</p>
                    </div>
                ) : (
                    <div className="space-y-3 md:space-y-4">
                        {orders.map((order) => {
                            const isExpanded = expandedOrders.has(order.order_id);
                            const statusColor = getOrderStatusColor(order.status);
                            const isCancelling = cancellingOrderId === order.order_id;

                            return (
                                <div
                                    key={order.order_id}
                                    className="bg-white rounded-2xl md:rounded-xl shadow-lg overflow-hidden border transition-all duration-200 hover:shadow-xl active:scale-[0.99] md:active:scale-100"
                                    style={{ borderColor: solarTheme.primary[200] }}
                                >
                                    {/* Order Header - Mobile Optimized */}
                                    <div
                                        className="p-4 sm:p-6 cursor-pointer md:cursor-default"
                                        onClick={() => window.innerWidth < 768 && handleOrderClick(order)}
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                            {/* Order Info */}
                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                                                    <h3 className="text-lg font-bold text-gray-900">
                                                        Order #{order.order_id.slice(0, 8).toUpperCase()}
                                                    </h3>
                                                    <div
                                                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold w-fit"
                                                        style={{
                                                            backgroundColor: `${statusColor}20`,
                                                            color: statusColor,
                                                        }}
                                                    >
                                                        {getStatusIcon(order.status)}
                                                        {OrderService.getOrderStatusLabel(order.status)}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Calendar className="w-4 h-4" style={{ color: solarTheme.primary[600] }} />
                                                        <span>{formatDate(order.created_at)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Package className="w-4 h-4" style={{ color: solarTheme.primary[600] }} />
                                                        <span>{OrderService.getTotalItems(order)} items</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <CreditCard className="w-4 h-4" style={{ color: solarTheme.primary[600] }} />
                                                        <span>{OrderService.getPaymentMethodLabel(order.payment_type)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-600">Payment:</span>
                                                        <span
                                                            className={`font-semibold ${
                                                                order.is_payment_success ? 'text-green-600' : 'text-yellow-600'
                                                            }`}
                                                        >
                                                            {order.is_payment_success ? 'Paid' : 'Pending'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {order.address && (
                                                    <div className="flex items-start gap-2 text-sm text-gray-600 mt-2">
                                                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: solarTheme.primary[600] }} />
                                                        <span>{order.address}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Order Total and Actions */}
                                            <div className="flex flex-col items-start lg:items-end gap-3">
                                                <div className="flex items-center justify-between w-full lg:w-auto">
                                                    <div className="text-left lg:text-right">
                                                        <div className="text-sm text-gray-600 mb-1">Total Amount</div>
                                                        <div className="text-2xl font-bold" style={{ color: solarTheme.primary[600] }}>
                                                            {formatOrderTotal(order)}
                                                        </div>
                                                    </div>
                                                    {/* Mobile: Show arrow indicator */}
                                                    <ChevronRight
                                                        className="w-6 h-6 md:hidden"
                                                        style={{ color: solarTheme.primary[400] }}
                                                    />
                                                </div>

                                                {/* Desktop Actions */}
                                                <div className="hidden md:flex flex-wrap gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleOrderExpansion(order.order_id);
                                                        }}
                                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 hover:shadow-md"
                                                        style={{
                                                            borderColor: solarTheme.primary[300],
                                                            color: solarTheme.primary[600],
                                                        }}
                                                    >
                                                        {isExpanded ? (
                                                            <>
                                                                <ChevronUp className="w-4 h-4" />
                                                                Hide Details
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ChevronDown className="w-4 h-4" />
                                                                View Details
                                                            </>
                                                        )}
                                                    </button>

                                                    {canCancelOrder(order) && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleCancelOrder(order);
                                                            }}
                                                            disabled={isCancelling}
                                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-red-300 text-red-600 font-medium transition-all duration-200 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {isCancelling ? (
                                                                <>
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                    Cancelling...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <XCircle className="w-4 h-4" />
                                                                    Cancel Order
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Order Details - Desktop Only */}
                                    {isExpanded && (
                                        <div className="hidden md:block border-t px-3 sm:px-4 md:px-6 py-3 sm:py-4" style={{ borderColor: solarTheme.primary[100], backgroundColor: solarTheme.primary[50] }}>
                                            <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Order Items</h4>
                                            <div className="space-y-3 md:space-y-4">
                                                {order.orderProducts.map((item) => (
                                                    <div
                                                        key={item.order_product_id}
                                                        className="flex flex-row gap-4 md:gap-5 p-4 md:p-5 bg-white rounded-lg border hover:shadow-md transition-shadow duration-200"
                                                        style={{ borderColor: solarTheme.primary[200] }}
                                                    >
                                                        {/* Product Image - Square on Left */}
                                                        <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 flex-shrink-0">
                                                            <div
                                                                className="w-full h-full rounded-xl overflow-hidden border"
                                                                style={{
                                                                    background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, ${solarTheme.primary[100]})`,
                                                                    borderColor: solarTheme.primary[200]
                                                                }}
                                                            >
                                                                <img
                                                                    src={item.image_urls?.[0] || '/packages/product_placeholder.png'}
                                                                    alt={item.title}
                                                                    className="w-full h-full object-contain p-2"
                                                                    onError={(e) => {
                                                                        const target = e.target as HTMLImageElement;
                                                                        target.src = "/packages/product_placeholder.png";
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Product Details - Right Side */}
                                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                            <h5 className="font-semibold text-gray-900 mb-2 text-base md:text-lg">{item.title}</h5>
                                                            {item.subtitle && (
                                                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.subtitle}</p>
                                                            )}
                                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm md:text-base">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-gray-600">Quantity:</span>
                                                                    <span className="font-semibold text-gray-900">{item.quantity}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-gray-600">Unit Price:</span>
                                                                    <span className="font-semibold text-gray-900">LKR {formatPrice(item.price)}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-gray-600">Subtotal:</span>
                                                                    <span className="font-bold text-lg" style={{ color: solarTheme.primary[600] }}>
                                                                        LKR {formatPrice(parseFloat(item.price) * item.quantity)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Order Timeline */}
                                            {(order.confirmed_at || order.completed_at || order.cancelled_at) && (
                                                <div className="mt-4 sm:mt-6">
                                                    <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Order Timeline</h4>
                                                    <div className="space-y-2 sm:space-y-3">
                                                        <div className="flex items-center gap-2 sm:gap-3">
                                                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: solarTheme.primary[600] }} />
                                                            <span className="text-xs sm:text-sm text-gray-600">
                                                                Placed: {OrderService.formatOrderDate(order.created_at)}
                                                            </span>
                                                        </div>
                                                        {order.confirmed_at && (
                                                            <div className="flex items-center gap-2 sm:gap-3">
                                                                <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                                                                <span className="text-xs sm:text-sm text-gray-600">
                                                                    Confirmed: {OrderService.formatOrderDate(order.confirmed_at)}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {order.completed_at && (
                                                            <div className="flex items-center gap-2 sm:gap-3">
                                                                <div className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0" />
                                                                <span className="text-xs sm:text-sm text-gray-600">
                                                                    Completed: {OrderService.formatOrderDate(order.completed_at)}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {order.cancelled_at && (
                                                            <div className="flex items-center gap-2 sm:gap-3">
                                                                <div className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0" />
                                                                <span className="text-xs sm:text-sm text-gray-600">
                                                                    Cancelled: {OrderService.formatOrderDate(order.cancelled_at)}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {orders.length > 0 && (
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.pages}
                        totalItems={pagination.total}
                        itemsPerPage={pagination.limit}
                        onPageChange={handlePageChange}
                        showItemsInfo={true}
                        maxPageButtons={5}
                    />
                )}
            </div>

            {/* Mobile Bottom Sheet for Order Details */}
            {showBottomSheet && selectedOrderForSheet && (
                <>
                    {/* Backdrop */}
                    <div
                        className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
                        onClick={closeBottomSheet}
                    />
                    {/* Bottom Sheet */}
                    <div
                        className={`md:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out max-h-[85vh] overflow-hidden flex flex-col ${
                            showBottomSheet ? 'translate-y-0' : 'translate-y-full'
                        }`}
                    >
                        {/* Handle */}
                        <div className="flex justify-center pt-3 pb-2">
                            <div className="w-12 h-1.5 rounded-full bg-gray-300" />
                        </div>

                        {/* Header */}
                        <div className="px-5 py-4 border-b" style={{ borderColor: solarTheme.primary[100] }}>
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Order #{selectedOrderForSheet.order_id.slice(0, 8).toUpperCase()}
                                </h2>
                                <button
                                    onClick={closeBottomSheet}
                                    className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                                    aria-label="Close"
                                >
                                    <X className="w-6 h-6 text-gray-600" />
                                </button>
                            </div>
                            <div
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold"
                                style={{
                                    backgroundColor: `${getOrderStatusColor(selectedOrderForSheet.status)}20`,
                                    color: getOrderStatusColor(selectedOrderForSheet.status),
                                }}
                            >
                                {getStatusIcon(selectedOrderForSheet.status)}
                                {OrderService.getOrderStatusLabel(selectedOrderForSheet.status)}
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto px-5 py-4">
                            {/* Order Info */}
                            <div className="mb-6">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4" style={{ color: solarTheme.primary[600] }} />
                                        <span>{formatDate(selectedOrderForSheet.created_at)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Package className="w-4 h-4" style={{ color: solarTheme.primary[600] }} />
                                        <span>{OrderService.getTotalItems(selectedOrderForSheet)} items</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <CreditCard className="w-4 h-4" style={{ color: solarTheme.primary[600] }} />
                                        <span>{OrderService.getPaymentMethodLabel(selectedOrderForSheet.payment_type)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-gray-600">Payment:</span>
                                        <span
                                            className={`font-semibold ${
                                                selectedOrderForSheet.is_payment_success ? 'text-green-600' : 'text-yellow-600'
                                            }`}
                                        >
                                            {selectedOrderForSheet.is_payment_success ? 'Paid' : 'Pending'}
                                        </span>
                                    </div>
                                </div>

                                {selectedOrderForSheet.address && (
                                    <div className="flex items-start gap-2 text-sm text-gray-600 p-3 rounded-lg" style={{ backgroundColor: solarTheme.primary[50] }}>
                                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: solarTheme.primary[600] }} />
                                        <span>{selectedOrderForSheet.address}</span>
                                    </div>
                                )}
                            </div>

                            {/* Order Total */}
                            <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: solarTheme.primary[50] }}>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700 font-medium">Total Amount</span>
                                    <span className="text-2xl font-bold" style={{ color: solarTheme.primary[600] }}>
                                        {formatOrderTotal(selectedOrderForSheet)}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                                <div className="space-y-3">
                                    {selectedOrderForSheet.orderProducts.map((item) => (
                                        <div
                                            key={item.order_product_id}
                                            className="flex gap-3 p-3 bg-gray-50 rounded-xl"
                                        >
                                            <div className="w-16 h-16 flex-shrink-0">
                                                <div
                                                    className="w-full h-full rounded-lg overflow-hidden"
                                                    style={{
                                                        background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, ${solarTheme.primary[100]})`
                                                    }}
                                                >
                                                    <img
                                                        src={item.image_urls?.[0] || '/packages/product_placeholder.png'}
                                                        alt={item.title}
                                                        className="w-full h-full object-contain"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = "/packages/product_placeholder.png";
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 mb-1 text-sm truncate">{item.title}</h4>
                                                {item.subtitle && (
                                                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.subtitle}</p>
                                                )}
                                                <div className="flex flex-col gap-1 text-xs">
                                                    <span className="text-gray-600">
                                                        Qty: <span className="font-semibold">{item.quantity}</span>
                                                    </span>
                                                    <span className="text-gray-600">
                                                        Price: <span className="font-semibold">LKR {formatPrice(item.price)}</span>
                                                    </span>
                                                    <span className="font-semibold" style={{ color: solarTheme.primary[600] }}>
                                                        Total: LKR {formatPrice(parseFloat(item.price) * item.quantity)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Timeline */}
                            {(selectedOrderForSheet.confirmed_at || selectedOrderForSheet.completed_at || selectedOrderForSheet.cancelled_at) && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3">Order Timeline</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: solarTheme.primary[600] }} />
                                            <span className="text-sm text-gray-600">
                                                Placed: {OrderService.formatOrderDate(selectedOrderForSheet.created_at)}
                                            </span>
                                        </div>
                                        {selectedOrderForSheet.confirmed_at && (
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                                                <span className="text-sm text-gray-600">
                                                    Confirmed: {OrderService.formatOrderDate(selectedOrderForSheet.confirmed_at)}
                                                </span>
                                            </div>
                                        )}
                                        {selectedOrderForSheet.completed_at && (
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0" />
                                                <span className="text-sm text-gray-600">
                                                    Completed: {OrderService.formatOrderDate(selectedOrderForSheet.completed_at)}
                                                </span>
                                            </div>
                                        )}
                                        {selectedOrderForSheet.cancelled_at && (
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0" />
                                                <span className="text-sm text-gray-600">
                                                    Cancelled: {OrderService.formatOrderDate(selectedOrderForSheet.cancelled_at)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bottom Actions */}
                        {canCancelOrder(selectedOrderForSheet) && (
                            <div className="border-t p-4" style={{ borderColor: solarTheme.primary[100] }}>
                                <button
                                    onClick={() => {
                                        closeBottomSheet();
                                        handleCancelOrder(selectedOrderForSheet);
                                    }}
                                    disabled={cancellingOrderId === selectedOrderForSheet.order_id}
                                    className="w-full px-4 py-4 rounded-xl bg-red-600 text-white font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {cancellingOrderId === selectedOrderForSheet.order_id ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Cancelling...
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-5 h-5" />
                                            Cancel Order
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Cancel Order Confirmation Dialog - Mobile Optimized */}
            {showCancelDialog && orderToCancel && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl md:rounded-xl shadow-2xl max-w-md w-full p-5 md:p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="w-6 h-6 md:w-7 md:h-7 text-red-600" />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-gray-900">Cancel Order?</h3>
                        </div>

                        <p className="text-sm md:text-base text-gray-600 mb-6">
                            Are you sure you want to cancel order #{orderToCancel.order_id.slice(0, 8).toUpperCase()}?
                            This action cannot be undone.
                        </p>

                        <div className="flex flex-col-reverse sm:flex-row gap-3">
                            <button
                                onClick={() => {
                                    setShowCancelDialog(false);
                                    setOrderToCancel(null);
                                }}
                                disabled={cancellingOrder}
                                className="flex-1 px-4 py-3.5 md:py-3 rounded-xl md:rounded-lg border-2 font-semibold transition-all duration-200 hover:bg-gray-50 active:scale-[0.98] disabled:opacity-50"
                                style={{
                                    borderColor: solarTheme.primary[300],
                                    color: solarTheme.primary[600],
                                }}
                            >
                                Keep Order
                            </button>
                            <button
                                onClick={confirmCancelOrder}
                                disabled={cancellingOrder}
                                className="flex-1 px-4 py-3.5 md:py-3 rounded-xl md:rounded-lg bg-red-600 text-white font-semibold transition-all duration-200 hover:bg-red-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {cancellingOrder ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Cancelling...
                                    </>
                                ) : (
                                    'Yes, Cancel Order'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
