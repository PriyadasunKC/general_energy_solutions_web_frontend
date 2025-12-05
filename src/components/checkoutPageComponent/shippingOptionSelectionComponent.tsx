import React, { useState } from 'react';
import {
    Truck,
    Clock,
    Zap,
    Package,
    Shield,
    Calendar,
    CheckCircle,
    AlertCircle,
    Info,
    Star,
    Plane
} from 'lucide-react';
import { solarTheme } from '@/theme/theme';

interface ShippingOption {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    deliveryTime: string;
    deliveryDays: number;
    icon: React.ReactNode;
    features: string[];
    recommended?: boolean;
    available: boolean;
    freeThreshold?: number;
}

interface ShippingOptionSelectionComponentProps {
    selectedOption?: string;
    onOptionChange: (optionId: string) => void;
    orderValue?: number;
    deliveryLocation?: {
        city: string;
        state: string;
    };
    className?: string;
}

// Mock shipping options
const shippingOptions: ShippingOption[] = [
    // {
    //     id: 'standard',
    //     name: 'Standard Delivery',
    //     description: 'Regular delivery with professional installation appointment',
    //     price: 15000,
    //     originalPrice: 15000,
    //     deliveryTime: '5-7 business days',
    //     deliveryDays: 7,
    //     icon: <Truck className="w-6 h-6" />,
    //     features: [
    //         'Door-to-door delivery',
    //         'Installation appointment scheduling',
    //         'SMS & email tracking',
    //         'Weekday delivery (9 AM - 6 PM)'
    //     ],
    //     available: true,
    //     freeThreshold: 300000
    // },
    // {
    //     id: 'express',
    //     name: 'Express Delivery',
    //     description: 'Faster delivery with priority installation scheduling',
    //     price: 25000,
    //     originalPrice: 25000,
    //     deliveryTime: '2-3 business days',
    //     deliveryDays: 3,
    //     icon: <Zap className="w-6 h-6" />,
    //     features: [
    //         'Priority handling',
    //         'Express installation scheduling',
    //         'Real-time tracking',
    //         'Flexible delivery time slots',
    //         'Weekend delivery available'
    //     ],
    //     recommended: true,
    //     available: true
    // },
    // {
    //     id: 'overnight',
    //     name: 'Overnight Express',
    //     description: 'Next business day delivery for urgent installations',
    //     price: 45000,
    //     originalPrice: 45000,
    //     deliveryTime: '1 business day',
    //     deliveryDays: 1,
    //     icon: <Plane className="w-6 h-6" />,
    //     features: [
    //         'Next day delivery guaranteed',
    //         'Same-day installation booking',
    //         'Premium tracking & support',
    //         'Priority customer service',
    //         'Weekend & holiday delivery'
    //     ],
    //     available: true
    // },
    // {
    //     id: 'scheduled',
    //     name: 'Scheduled Delivery',
    //     description: 'Choose your preferred delivery date and time',
    //     price: 20000,
    //     originalPrice: 20000,
    //     deliveryTime: 'Choose your date',
    //     deliveryDays: 14,
    //     icon: <Calendar className="w-6 h-6" />,
    //     features: [
    //         'Pick your delivery date',
    //         '2-hour time window',
    //         'Up to 2 weeks advance booking',
    //         'Free rescheduling once',
    //         'Installation coordination'
    //     ],
    //     available: true
    // },
    {
        id: 'pickup',
        name: 'Free Standard Delivery',
        description: 'We ship your order from our warehouse to your door step',
        price: 0,
        originalPrice: 0,
        deliveryTime: 'Ready in 2-4 hours',
        deliveryDays: 0,
        icon: <Package className="w-6 h-6" />,
        features: [
            'No delivery charge',
            'Ready for pickup quickly',
            'Quality check before pickup',
            'Loading assistance provided',
            'Extended pickup hours'
        ],
        available: true
    }
];

export default function ShippingOptionSelectionComponent({
    selectedOption = 'standard',
    onOptionChange,
    orderValue = 0,
    deliveryLocation = { city: 'Colombo', state: 'Western Province' },
    className = ''
}: ShippingOptionSelectionComponentProps) {
    const [hoveredOption, setHoveredOption] = useState<string | null>(null);

    const getAdjustedPrice = (option: ShippingOption): number => {
        if (option.freeThreshold && orderValue >= option.freeThreshold) {
            return 0;
        }
        return option.price;
    };

    const isDiscounted = (option: ShippingOption): boolean => {
        return option.freeThreshold ? orderValue >= option.freeThreshold : false;
    };

    const getDeliveryDate = (days: number): string => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const selectedOptionData = shippingOptions.find(option => option.id === selectedOption);

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <Truck className="w-5 h-5 mr-2" style={{ color: solarTheme.primary[600] }} />
                        Shipping Options
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Delivering to {deliveryLocation.city}, {deliveryLocation.state}
                    </p>
                </div>
                {orderValue >= 300000 && (
                    <div className="text-right">
                        <div className="text-sm font-medium" style={{ color: solarTheme.primary[600] }}>
                            🎉 Free Standard Delivery!
                        </div>
                        <div className="text-xs text-gray-500">
                            Orders over LKR 300,000
                        </div>
                    </div>
                )}
            </div>

            {/* Shipping Options */}
            <div className="space-y-3">
                {shippingOptions.map((option) => {
                    const adjustedPrice = getAdjustedPrice(option);
                    const discounted = isDiscounted(option);
                    const isSelected = selectedOption === option.id;
                    const isHovered = hoveredOption === option.id;

                    return (
                        <div
                            key={option.id}
                            className={`relative border-2 rounded-xl transition-all duration-200 cursor-pointer ${!option.available ? 'opacity-50 cursor-not-allowed' : ''
                                }  : 'hover:shadow-lg'
                                }`}
                            style={{
                                borderColor: isSelected ? solarTheme.primary[500] : solarTheme.primary[200],
                                backgroundColor: isSelected ? solarTheme.primary[50] : 'white'
                            }}
                            onClick={() => option.available && onOptionChange(option.id)}
                            onMouseEnter={() => setHoveredOption(option.id)}
                            onMouseLeave={() => setHoveredOption(null)}
                        >
                            {/* Recommended Badge */}
                            {option.recommended && (
                                <div className="absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1" style={{
                                    backgroundColor: solarTheme.secondary[500]
                                }}>
                                    <Star className="w-3 h-3 fill-current" />
                                    Recommended
                                </div>
                            )}

                            <div className="p-4 sm:p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                    {/* Radio Button & Icon */}
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div
                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-transparent' : 'border-gray-300'
                                                    }`}
                                                style={{
                                                    backgroundColor: isSelected ? solarTheme.primary[600] : 'white'
                                                }}
                                            >
                                                {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-lg" style={{
                                            backgroundColor: isSelected ? solarTheme.primary[100] : solarTheme.primary[50],
                                            color: solarTheme.primary[600]
                                        }}>
                                            {option.icon}
                                        </div>
                                    </div>

                                    {/* Option Details */}
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-lg">{option.name}</h4>
                                                <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <div className="flex items-center justify-end gap-2">
                                                    {discounted && option.originalPrice && option.originalPrice > 0 && (
                                                        <span className="text-sm text-gray-400 line-through">
                                                            LKR {option.originalPrice.toLocaleString()}
                                                        </span>
                                                    )}
                                                    <div className="font-bold text-lg" style={{
                                                        color: adjustedPrice === 0 ? solarTheme.primary[600] : solarTheme.primary[700]
                                                    }}>
                                                        {adjustedPrice === 0 ? 'FREE' : `LKR ${adjustedPrice.toLocaleString()}`}
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-600 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {option.deliveryTime}
                                                </div>
                                                {option.deliveryDays > 0 && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        By {getDeliveryDate(option.deliveryDays)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Features (shown on hover or selection) */}
                                        {(isSelected || isHovered) && (
                                            <div className="mt-4 pt-4 border-t" style={{ borderColor: solarTheme.primary[200] }}>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {option.features.map((feature, index) => (
                                                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                                                            <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: solarTheme.primary[500] }} />
                                                            <span>{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Unavailable Message */}
                                        {!option.available && (
                                            <div className="mt-3 p-2 rounded bg-gray-100 flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4 text-gray-500" />
                                                <span className="text-sm text-gray-600">
                                                    Not available for your location
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Selected Option Summary */}
            {selectedOptionData && (
                <div className="p-4 rounded-xl" style={{ backgroundColor: solarTheme.primary[50] }}>
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5" style={{ color: solarTheme.primary[600] }} />
                        <span className="font-semibold text-gray-900">Selected: {selectedOptionData.name}</span>
                    </div>
                    <div className="text-sm text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" style={{ color: solarTheme.primary[600] }} />
                            <span>Delivery: {selectedOptionData.deliveryTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4" style={{ color: solarTheme.primary[600] }} />
                            <span>
                                Cost: {getAdjustedPrice(selectedOptionData) === 0 ? 'FREE' : `LKR ${getAdjustedPrice(selectedOptionData).toLocaleString()}`}
                            </span>
                        </div>
                        {selectedOptionData.deliveryDays > 0 && (
                            <div className="flex items-center gap-2 sm:col-span-2">
                                <Calendar className="w-4 h-4" style={{ color: solarTheme.primary[600] }} />
                                <span>Expected delivery: {getDeliveryDate(selectedOptionData.deliveryDays)}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Additional Information */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-green-50">
                <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: solarTheme.accent[600] }} />
                    <div className="text-sm text-gray-700">
                        <div className="font-semibold mb-2">Important Delivery Information:</div>
                        <ul className="space-y-1 text-xs">
                            <li>• All deliveries include professional quality check before handover</li>
                            <li>• Installation can be scheduled during checkout or after delivery</li>
                            <li>• Delivery times may vary during peak seasons and holidays</li>
                            <li>• Free delivery applies to standard shipping on orders over LKR 300,000</li>
                            <li>• Remote areas may have additional delivery charges</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Insurance Option */}
            <div className="p-4 border rounded-xl" style={{ borderColor: solarTheme.secondary[200] }}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5" style={{ color: solarTheme.secondary[600] }} />
                        <div>
                            <div className="font-semibold text-gray-900">Delivery Insurance</div>
                            <div className="text-sm text-gray-600">Protect your order during transit</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="font-bold text-gray-900">LKR 2,500</div>
                        <label className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <input type="checkbox" className="rounded" />
                            Add insurance
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}