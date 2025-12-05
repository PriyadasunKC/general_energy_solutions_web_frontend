/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
    X,
    CreditCard,
    Plus,
    Edit3,
    Trash2,
    Check,
    Star,
    Shield,
    AlertCircle,
    Smartphone,
    Building,
    Lock,
    Eye,
    EyeOff
} from 'lucide-react';

import { solarTheme } from '@/theme/theme';

interface PaymentMethod {
    id: number;
    type: 'card' | 'bank' | 'digital';
    name: string;
    details: string;
    isDefault: boolean;
    cardNumber?: string;
    expiryDate?: string;
    cardType?: 'visa' | 'mastercard' | 'amex' | 'discover';
    holderName?: string;
    bankName?: string;
    accountNumber?: string;
    digitalProvider?: string;
    digitalAccount?: string;
}

interface CardManageComponentProps {
    paymentMethods?: PaymentMethod[];
    onClose: () => void;
    onPaymentSelect?: (paymentMethod: PaymentMethod) => void;
    onPaymentUpdate?: (paymentMethods: PaymentMethod[]) => void;
}

// Mock payment methods
const initialPaymentMethods: PaymentMethod[] = [
    {
        id: 1,
        type: 'card',
        name: 'Visa ending in 4242',
        details: '**** **** **** 4242',
        isDefault: true,
        cardNumber: '4242424242424242',
        expiryDate: '12/25',
        cardType: 'visa',
        holderName: 'John Doe'
    },
    {
        id: 2,
        type: 'card',
        name: 'MasterCard ending in 5555',
        details: '**** **** **** 5555',
        isDefault: false,
        cardNumber: '5555555555554444',
        expiryDate: '08/26',
        cardType: 'mastercard',
        holderName: 'John Doe'
    },
    {
        id: 3,
        type: 'digital',
        name: 'PayPal',
        details: 'john.doe@email.com',
        isDefault: false,
        digitalProvider: 'PayPal',
        digitalAccount: 'john.doe@email.com'
    },
    {
        id: 4,
        type: 'bank',
        name: 'Commercial Bank',
        details: 'Account ending in 1234',
        isDefault: false,
        bankName: 'Commercial Bank of Ceylon',
        accountNumber: '1234567891234'
    }
];

const cardTypes = [
    { value: 'visa', label: 'Visa', color: '#1a1f71' },
    { value: 'mastercard', label: 'MasterCard', color: '#eb001b' },
    { value: 'amex', label: 'American Express', color: '#006fcf' },
    { value: 'discover', label: 'Discover', color: '#ff6000' }
];

const digitalProviders = [
    'PayPal',
    'Google Pay',
    'Apple Pay',
    'Samsung Pay',
    'eZCash',
    'mCash'
];

const sriLankanBanks = [
    'Commercial Bank of Ceylon',
    'People\'s Bank',
    'Bank of Ceylon',
    'Hatton National Bank',
    'Sampath Bank',
    'Nations Trust Bank',
    'DFCC Bank',
    'Pan Asia Banking Corporation',
    'Union Bank',
    'Cargills Bank'
];

export default function CardManageComponent({
    paymentMethods = initialPaymentMethods,
    onClose,
    onPaymentSelect,
    onPaymentUpdate
}: CardManageComponentProps) {
    const [paymentList, setPaymentList] = useState<PaymentMethod[]>(paymentMethods);
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);
    const [formData, setFormData] = useState<Partial<PaymentMethod>>({
        type: 'card',
        holderName: '',
        cardNumber: '',
        expiryDate: '',
        cardType: 'visa',
        bankName: '',
        accountNumber: '',
        digitalProvider: '',
        digitalAccount: ''
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [showCardNumber, setShowCardNumber] = useState(false);

    // Disable body scroll when modal is open
    useEffect(() => {
        // Save the current scroll position
        const scrollY = window.scrollY;

        // Disable body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';

        // Cleanup function to restore scroll when component unmounts
        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';

            // Restore scroll position
            window.scrollTo(0, scrollY);
        };
    }, []);

    // Handle close with scroll restoration
    const handleClose = () => {
        // Let the cleanup in useEffect handle scroll restoration
        onClose();
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (formData.type === 'card') {
            if (!formData.holderName?.trim()) errors.holderName = 'Cardholder name is required';
            if (!formData.cardNumber?.trim()) errors.cardNumber = 'Card number is required';
            if (!formData.expiryDate?.trim()) errors.expiryDate = 'Expiry date is required';

            // Card number validation
            if (formData.cardNumber) {
                const cleaned = formData.cardNumber.replace(/\s+/g, '');
                if (!/^\d{13,19}$/.test(cleaned)) {
                    errors.cardNumber = 'Please enter a valid card number';
                }
            }

            // Expiry date validation
            if (formData.expiryDate) {
                const [month, year] = formData.expiryDate.split('/');
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear() % 100;
                const currentMonth = currentDate.getMonth() + 1;

                if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
                    errors.expiryDate = 'Format: MM/YY';
                } else if (parseInt(month) < 1 || parseInt(month) > 12) {
                    errors.expiryDate = 'Invalid month';
                } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
                    errors.expiryDate = 'Card has expired';
                }
            }
        } else if (formData.type === 'bank') {
            if (!formData.holderName?.trim()) errors.holderName = 'Account holder name is required';
            if (!formData.bankName?.trim()) errors.bankName = 'Bank name is required';
            if (!formData.accountNumber?.trim()) errors.accountNumber = 'Account number is required';
        } else if (formData.type === 'digital') {
            if (!formData.digitalProvider?.trim()) errors.digitalProvider = 'Provider is required';
            if (!formData.digitalAccount?.trim()) errors.digitalAccount = 'Account is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const detectCardType = (cardNumber: string): string => {
        const cleaned = cardNumber.replace(/\s+/g, '');
        if (/^4/.test(cleaned)) return 'visa';
        if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard';
        if (/^3[47]/.test(cleaned)) return 'amex';
        if (/^6/.test(cleaned)) return 'discover';
        return 'visa';
    };

    const formatCardNumber = (value: string): string => {
        const cleaned = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
        return formatted.substr(0, 23); // Max 19 digits + 4 spaces
    };

    const handleInputChange = (field: keyof PaymentMethod, value: string) => {
        if (field === 'cardNumber') {
            const formatted = formatCardNumber(value);
            setFormData(prev => ({
                ...prev,
                [field]: formatted,
                cardType: detectCardType(formatted) as any
            }));
        } else if (field === 'expiryDate') {
            let formatted = value.replace(/\D/g, '');
            if (formatted.length >= 2) {
                formatted = formatted.substring(0, 2) + '/' + formatted.substring(2, 4);
            }
            setFormData(prev => ({ ...prev, [field]: formatted }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }

        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleAddPayment = () => {
        setFormData({
            type: 'card',
            holderName: '',
            cardNumber: '',
            expiryDate: '',
            cardType: 'visa',
            bankName: '',
            accountNumber: '',
            digitalProvider: '',
            digitalAccount: ''
        });
        setEditingPayment(null);
        setShowAddForm(true);
        setFormErrors({});
    };

    const handleEditPayment = (payment: PaymentMethod) => {
        setFormData({ ...payment });
        setEditingPayment(payment);
        setShowAddForm(true);
        setFormErrors({});
    };

    const generatePaymentDetails = (data: Partial<PaymentMethod>): { name: string; details: string } => {
        if (data.type === 'card') {
            const lastFour = data.cardNumber?.slice(-4) || '0000';
            const cardTypeName = cardTypes.find(ct => ct.value === data.cardType)?.label || 'Card';
            return {
                name: `${cardTypeName} ending in ${lastFour}`,
                details: `**** **** **** ${lastFour}`
            };
        } else if (data.type === 'bank') {
            const lastFour = data.accountNumber?.slice(-4) || '0000';
            return {
                name: `${data.bankName}`,
                details: `Account ending in ${lastFour}`
            };
        } else {
            return {
                name: `${data.digitalProvider}`,
                details: `${data.digitalAccount}`
            };
        }
    };

    const handleSavePayment = () => {
        if (!validateForm()) return;

        const { name, details } = generatePaymentDetails(formData);

        const newPayment: PaymentMethod = {
            id: editingPayment?.id || Date.now(),
            type: formData.type!,
            name,
            details,
            isDefault: editingPayment?.isDefault || (paymentList.length === 0),
            ...(formData.type === 'card' && {
                cardNumber: formData.cardNumber,
                expiryDate: formData.expiryDate,
                cardType: formData.cardType,
                holderName: formData.holderName
            }),
            ...(formData.type === 'bank' && {
                bankName: formData.bankName,
                accountNumber: formData.accountNumber,
                holderName: formData.holderName
            }),
            ...(formData.type === 'digital' && {
                digitalProvider: formData.digitalProvider,
                digitalAccount: formData.digitalAccount
            })
        };

        let updatedPayments: PaymentMethod[];
        if (editingPayment) {
            updatedPayments = paymentList.map(payment =>
                payment.id === editingPayment.id ? newPayment : payment
            );
        } else {
            updatedPayments = [...paymentList, newPayment];
        }

        setPaymentList(updatedPayments);
        onPaymentUpdate?.(updatedPayments);
        setShowAddForm(false);
        setEditingPayment(null);
    };

    const handleDeletePayment = (paymentId: number) => {
        const paymentToDelete = paymentList.find(payment => payment.id === paymentId);
        if (paymentToDelete?.isDefault && paymentList.length > 1) {
            const updatedPayments = paymentList
                .filter(payment => payment.id !== paymentId)
                .map((payment, index) => ({ ...payment, isDefault: index === 0 }));
            setPaymentList(updatedPayments);
            onPaymentUpdate?.(updatedPayments);
        } else if (paymentList.length > 1) {
            const updatedPayments = paymentList.filter(payment => payment.id !== paymentId);
            setPaymentList(updatedPayments);
            onPaymentUpdate?.(updatedPayments);
        }
    };

    const handleSetDefault = (paymentId: number) => {
        const updatedPayments = paymentList.map(payment => ({
            ...payment,
            isDefault: payment.id === paymentId
        }));
        setPaymentList(updatedPayments);
        onPaymentUpdate?.(updatedPayments);
    };

    const handleSelectPayment = (payment: PaymentMethod) => {
        setSelectedPayment(payment);
        onPaymentSelect?.(payment);
        handleClose();
    };

    const getPaymentIcon = (type: string) => {
        switch (type) {
            case 'card': return <CreditCard className="w-4 sm:w-5 h-4 sm:h-5" />;
            case 'bank': return <Building className="w-4 sm:w-5 h-4 sm:h-5" />;
            case 'digital': return <Smartphone className="w-4 sm:w-5 h-4 sm:h-5" />;
            default: return <CreditCard className="w-4 sm:w-5 h-4 sm:h-5" />;
        }
    };

    const getCardTypeColor = (cardType?: string) => {
        return cardTypes.find(ct => ct.value === cardType)?.color || solarTheme.primary[600];
    };

    // Handle backdrop click to close modal
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-transparent backdrop-blur-md bg-opacity-75 flex items-end sm:items-center justify-center p-0 sm:p-4 z-[60]"
            onClick={handleBackdropClick}
        >
            <div className="bg-white w-full h-full sm:h-auto sm:max-h-[85vh] sm:min-h-[60vh] sm:rounded-2xl sm:shadow-2xl sm:w-full sm:max-w-4xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-4 sm:p-6 border-b flex items-center justify-between flex-shrink-0 bg-white" style={{ borderColor: solarTheme.primary[200] }}>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                            {showAddForm ? (editingPayment ? 'Edit Payment Method' : 'Add Payment Method') : 'Payment Methods'}
                        </h2>
                        <p className="text-gray-600 text-xs sm:text-sm mt-1">
                            {showAddForm ? 'Add or update your payment information' : 'Select or manage your payment methods'}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors ml-2 flex-shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <div
                        className={`p-4 sm:p-6 space-y-4 sm:space-y-6 ${showAddForm ? 'pb-24 sm:pb-6' : 'pb-6'
                            }`}
                    >
                        {!showAddForm ? (
                            <>
                                {/* Add New Payment Button */}
                                <button
                                    onClick={handleAddPayment}
                                    className="w-full p-3 sm:p-4 border-2 border-dashed rounded-lg sm:rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:border-solid"
                                    style={{
                                        borderColor: solarTheme.primary[300],
                                        color: solarTheme.primary[600]
                                    }}
                                >
                                    <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
                                    <span className="font-semibold text-sm sm:text-base">Add Payment Method</span>
                                </button>

                                {/* Payment Methods List */}
                                <div className="space-y-3 sm:space-y-4">
                                    {paymentList.map((payment) => (
                                        <div
                                            key={payment.id}
                                            className="border rounded-lg sm:rounded-xl p-4 sm:p-6 transition-all duration-200 hover:shadow-lg cursor-pointer"
                                            style={{ borderColor: solarTheme.primary[200] }}
                                            onClick={() => handleSelectPayment(payment)}
                                        >
                                            <div className="flex flex-col gap-3 sm:gap-4">
                                                {/* Payment Info */}
                                                <div className="flex items-center gap-3 sm:gap-4 flex-1">
                                                    <div className="w-10 sm:w-12 h-6 sm:h-8 rounded border flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                                        style={{
                                                            backgroundColor: payment.type === 'card' ? getCardTypeColor(payment.cardType) :
                                                                payment.type === 'bank' ? solarTheme.accent[600] :
                                                                    solarTheme.secondary[600]
                                                        }}>
                                                        {payment.type === 'card' ? payment.cardType?.slice(0, 4).toUpperCase() :
                                                            payment.type === 'bank' ? 'BANK' : 'PAY'}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                            <span style={{ color: solarTheme.primary[600] }}>
                                                                {getPaymentIcon(payment.type)}
                                                            </span>
                                                            <span className="font-bold text-gray-900 text-sm sm:text-base truncate">{payment.name}</span>
                                                            {payment.isDefault && (
                                                                <span className="text-xs px-2 py-1 rounded-full text-white flex items-center gap-1 flex-shrink-0" style={{
                                                                    backgroundColor: solarTheme.primary[600]
                                                                }}>
                                                                    <Star className="w-2 sm:w-3 h-2 sm:h-3 fill-current" />
                                                                    <span className="hidden sm:inline">Default</span>
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs sm:text-sm text-gray-600 truncate">{payment.details}</div>
                                                        {payment.type === 'card' && payment.expiryDate && (
                                                            <div className="text-xs text-gray-500">Expires {payment.expiryDate}</div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2 pt-2 border-t" style={{ borderColor: solarTheme.primary[100] }}>
                                                    {!payment.isDefault && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleSetDefault(payment.id);
                                                            }}
                                                            className="flex items-center gap-1 px-3 py-2 text-xs sm:text-sm border rounded-lg transition-colors hover:bg-gray-50 flex-1 justify-center"
                                                            style={{ borderColor: solarTheme.primary[300], color: solarTheme.primary[600] }}
                                                        >
                                                            <Star className="w-3 sm:w-4 h-3 sm:h-4" />
                                                            <span>Set Default</span>
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditPayment(payment);
                                                        }}
                                                        className="flex items-center gap-1 px-3 py-2 text-xs sm:text-sm border rounded-lg transition-colors hover:bg-gray-50 flex-1 justify-center"
                                                        style={{ borderColor: solarTheme.secondary[300], color: solarTheme.secondary[600] }}
                                                    >
                                                        <Edit3 className="w-3 sm:w-4 h-3 sm:h-4" />
                                                        <span>Edit</span>
                                                    </button>

                                                    {paymentList.length > 1 && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeletePayment(payment.id);
                                                            }}
                                                            className="flex items-center gap-1 px-3 py-2 text-xs sm:text-sm border rounded-lg transition-colors hover:bg-red-50 flex-1 justify-center"
                                                            style={{ borderColor: '#fca5a5', color: '#dc2626' }}
                                                        >
                                                            <Trash2 className="w-3 sm:w-4 h-3 sm:h-4" />
                                                            <span>Delete</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            /* Add/Edit Form */
                            <div className="space-y-4 sm:space-y-6">
                                {/* Back Button - Mobile Only */}
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="sm:hidden flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
                                >
                                    <X className="w-4 h-4" />
                                    <span className="text-sm">Back to payment methods</span>
                                </button>

                                {/* Payment Type Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Payment Type
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {[
                                            { value: 'card', label: 'Credit/Debit Card', icon: <CreditCard className="w-5 h-5" /> },
                                            { value: 'bank', label: 'Bank Transfer', icon: <Building className="w-5 h-5" /> },
                                            { value: 'digital', label: 'Digital Wallet', icon: <Smartphone className="w-5 h-5" /> }
                                        ].map((type) => (
                                            <button
                                                key={type.value}
                                                type="button"
                                                onClick={() => handleInputChange('type', type.value)}
                                                className="p-3 sm:p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all"
                                                style={{
                                                    borderColor: formData.type === type.value ? solarTheme.primary[500] : solarTheme.primary[200],
                                                    backgroundColor: formData.type === type.value ? solarTheme.primary[50] : 'white',
                                                    color: formData.type === type.value ? solarTheme.primary[700] : solarTheme.primary[600]
                                                }}
                                            >
                                                {type.icon}
                                                <span className="text-xs sm:text-sm font-medium text-center">{type.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Card Form */}
                                {formData.type === 'card' && (
                                    <div className="space-y-4">
                                        {/* Cardholder Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Cardholder Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.holderName || ''}
                                                onChange={(e) => handleInputChange('holderName', e.target.value)}
                                                className="w-full px-3 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm sm:text-base"
                                                style={{
                                                    borderColor: formErrors.holderName ? '#dc2626' : solarTheme.primary[300]
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.boxShadow = `0 0 0 2px ${solarTheme.primary[500]}`;
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.boxShadow = '';
                                                }}
                                                placeholder="John Doe"
                                            />
                                            {formErrors.holderName && (
                                                <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {formErrors.holderName}
                                                </p>
                                            )}
                                        </div>

                                        {/* Card Number */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Card Number *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showCardNumber ? 'text' : 'password'}
                                                    value={formData.cardNumber || ''}
                                                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                                                    className="w-full px-3 sm:px-4 py-3 pr-20 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm sm:text-base"
                                                    style={{
                                                        borderColor: formErrors.cardNumber ? '#dc2626' : solarTheme.primary[300]
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.boxShadow = `0 0 0 2px ${solarTheme.primary[500]}`;
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.boxShadow = '';
                                                    }}
                                                    placeholder="1234 5678 9012 3456"
                                                />
                                                <div className="absolute right-2 top-2 sm:top-3 flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCardNumber(!showCardNumber)}
                                                        className="p-1 sm:p-2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showCardNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                    <div className="w-6 sm:w-8 h-4 sm:h-5 rounded border flex items-center justify-center text-xs font-bold text-white"
                                                        style={{ backgroundColor: getCardTypeColor(formData.cardType) }}>
                                                        {formData.cardType?.slice(0, 4).toUpperCase()}
                                                    </div>
                                                </div>
                                            </div>
                                            {formErrors.cardNumber && (
                                                <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {formErrors.cardNumber}
                                                </p>
                                            )}
                                        </div>

                                        {/* Expiry Date & CVV */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Expiry Date *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.expiryDate || ''}
                                                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                                                    className="w-full px-3 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm sm:text-base"
                                                    style={{
                                                        borderColor: formErrors.expiryDate ? '#dc2626' : solarTheme.primary[300]
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.boxShadow = `0 0 0 2px ${solarTheme.primary[500]}`;
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.boxShadow = '';
                                                    }}
                                                    placeholder="MM/YY"
                                                    maxLength={5}
                                                />
                                                {formErrors.expiryDate && (
                                                    <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        {formErrors.expiryDate}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    CVV
                                                </label>
                                                <input
                                                    type="password"
                                                    className="w-full px-3 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm sm:text-base"
                                                    style={{
                                                        borderColor: solarTheme.primary[300]
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.boxShadow = `0 0 0 2px ${solarTheme.primary[500]}`;
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.boxShadow = '';
                                                    }}
                                                    placeholder="123"
                                                    maxLength={4}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Bank Form */}
                                {formData.type === 'bank' && (
                                    <div className="space-y-4">
                                        {/* Account Holder Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Account Holder Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.holderName || ''}
                                                onChange={(e) => handleInputChange('holderName', e.target.value)}
                                                className="w-full px-3 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm sm:text-base"
                                                style={{
                                                    borderColor: formErrors.holderName ? '#dc2626' : solarTheme.primary[300]
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.boxShadow = `0 0 0 2px ${solarTheme.primary[500]}`;
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.boxShadow = '';
                                                }}
                                                placeholder="John Doe"
                                            />
                                            {formErrors.holderName && (
                                                <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {formErrors.holderName}
                                                </p>
                                            )}
                                        </div>

                                        {/* Bank Name & Account Number */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Bank Name *
                                                </label>
                                                <select
                                                    value={formData.bankName || ''}
                                                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                                                    className="w-full px-3 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm sm:text-base"
                                                    style={{
                                                        borderColor: formErrors.bankName ? '#dc2626' : solarTheme.primary[300]
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.boxShadow = `0 0 0 2px ${solarTheme.primary[500]}`;
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.boxShadow = '';
                                                    }}
                                                >
                                                    <option value="">Select Bank</option>
                                                    {sriLankanBanks.map((bank) => (
                                                        <option key={bank} value={bank}>{bank}</option>
                                                    ))}
                                                </select>
                                                {formErrors.bankName && (
                                                    <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        {formErrors.bankName}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Account Number *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.accountNumber || ''}
                                                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                                                    className="w-full px-3 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm sm:text-base"
                                                    style={{
                                                        borderColor: formErrors.accountNumber ? '#dc2626' : solarTheme.primary[300]
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.boxShadow = `0 0 0 2px ${solarTheme.primary[500]}`;
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.boxShadow = '';
                                                    }}
                                                    placeholder="1234567890123"
                                                />
                                                {formErrors.accountNumber && (
                                                    <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        {formErrors.accountNumber}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Digital Wallet Form */}
                                {formData.type === 'digital' && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* Provider */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Provider *
                                                </label>
                                                <select
                                                    value={formData.digitalProvider || ''}
                                                    onChange={(e) => handleInputChange('digitalProvider', e.target.value)}
                                                    className="w-full px-3 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm sm:text-base"
                                                    style={{
                                                        borderColor: formErrors.digitalProvider ? '#dc2626' : solarTheme.primary[300]
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.boxShadow = `0 0 0 2px ${solarTheme.primary[500]}`;
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.boxShadow = '';
                                                    }}
                                                >
                                                    <option value="">Select Provider</option>
                                                    {digitalProviders.map((provider) => (
                                                        <option key={provider} value={provider}>{provider}</option>
                                                    ))}
                                                </select>
                                                {formErrors.digitalProvider && (
                                                    <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        {formErrors.digitalProvider}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Account */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Account *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.digitalAccount || ''}
                                                    onChange={(e) => handleInputChange('digitalAccount', e.target.value)}
                                                    className="w-full px-3 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm sm:text-base"
                                                    style={{
                                                        borderColor: formErrors.digitalAccount ? '#dc2626' : solarTheme.primary[300]
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.boxShadow = `0 0 0 2px ${solarTheme.primary[500]}`;
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.boxShadow = '';
                                                    }}
                                                    placeholder="email@example.com or phone number"
                                                />
                                                {formErrors.digitalAccount && (
                                                    <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        {formErrors.digitalAccount}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Security Note */}
                                <div className="p-3 sm:p-4 rounded-lg" style={{ backgroundColor: solarTheme.primary[50] }}>
                                    <div className="flex items-start gap-2 text-sm" style={{ color: solarTheme.primary[700] }}>
                                        <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="font-medium mb-1">Your payment information is secure</div>
                                            <div className="text-xs">We use industry-standard encryption to protect your sensitive information. Your payment details are never stored on our servers.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions - Fixed on Mobile, Relative on Desktop */}
                {showAddForm && (
                    <div className="fixed bottom-0 left-0 right-0 sm:relative bg-white p-4 sm:p-6 border-t shadow-lg sm:shadow-none flex-shrink-0 z-10" style={{ borderColor: solarTheme.primary[200] }}>
                        <div className="flex gap-3 max-w-4xl mx-auto">
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="flex-1 px-4 py-3 border rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                                style={{ borderColor: solarTheme.primary[300] }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSavePayment}
                                className="flex-1 px-4 py-3 rounded-lg font-bold text-white transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
                                style={{
                                    background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[500]})`
                                }}
                            >
                                <Check className="w-4 h-4" />
                                {editingPayment ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}