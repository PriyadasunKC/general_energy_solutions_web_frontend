import React from 'react';
import {
    Star,
    Zap,
    Home,
    ArrowRight,
    CheckCircle,
    Battery,
    Shield,
    TrendingUp,
} from 'lucide-react';
import { Package } from '@/types/packageTypes';

interface SolarPackageCardProps {
    package: Package;
    badge?: {
        text: string;
        color: string;
    };
    rating?: number;
    onCardClick?: (packageId: string) => void;
}

export default function SolarPackageCard({
    package: pkg,
    badge,
    rating = 4.8,
    onCardClick
}: SolarPackageCardProps) {
    // Calculate values
    const salePrice = parseFloat(pkg.sale_price);
    const originalPrice = parseFloat(pkg.original_price);
    const savings = originalPrice - salePrice;
    const hasDiscount = savings > 0;

    // Format prices
    const formattedSalePrice = salePrice.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    const formattedOriginalPrice = originalPrice.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    const formattedSavings = savings.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    // Get primary image
    const image = pkg.image_urls?.[0] || "/packages/product_placeholder.png";

    // Extract specifications
    const powerOutput = pkg.specification.power_output || '2kW';
    const warranty = pkg.specification.warranty || '25 years';
    const efficiency = pkg.specification.efficiency || '20.5%';

    // Format rating to 1 decimal place
    const formattedRating = rating.toFixed(1);

    // Determine badge color (default to orange if not provided)
    const badgeColor = badge?.color || '#FF8C00';
    const badgeText = badge?.text || (pkg.is_featured ? 'Featured' : 'Available');

    // Features to display
    const features = [
        { icon: Home, text: pkg.subtitle || 'Perfect for small homes', color: '#FF8C00' },
        { icon: Zap, text: `${powerOutput} Power Output`, color: '#FFB800' },
        { icon: Battery, text: 'Smart energy storage', color: '#00C853' },
        { icon: Shield, text: warranty, color: '#2196F3' },
    ];

    // Highlights
    const highlights = [
        `${efficiency} efficient`,
        pkg.is_available ? 'In Stock' : 'Limited Stock',
        pkg.is_featured ? 'Featured Package' : 'Quality Guaranteed',
    ];

    const handleClick = () => {
        if (onCardClick) {
            onCardClick(pkg.package_id);
        }
    };

    return (
        <div
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-2"
            onClick={handleClick}
        >
            {/* Image Section - Larger */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={image}
                    alt={pkg.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/packages/product_placeholder.png";
                    }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Badge - Top Left */}
                <div
                    className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-sm"
                    style={{ backgroundColor: badgeColor }}
                >
                    {badgeText}
                </div>

                {/* Rating - Top Right */}
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-bold text-gray-900">{formattedRating}</span>
                </div>

                {/* Hover Effect - View Details Indicator */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-md rounded-full p-4">
                        <ArrowRight className="w-8 h-8 text-white" />
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                {/* Title & Power Output */}
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {pkg.title}
                    </h3>
                    <p className="text-sm font-semibold" style={{ color: badgeColor }}>
                        {powerOutput}
                    </p>
                </div>

                {/* Pricing */}
                <div className="mb-5">
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-bold text-green-600">
                            LKR {formattedSalePrice}
                        </span>
                        {hasDiscount && (
                            <span className="text-sm text-gray-400 line-through">
                                LKR {formattedOriginalPrice}
                            </span>
                        )}
                    </div>
                    {hasDiscount && (
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 border border-green-200">
                            <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-xs font-semibold text-green-700">
                                Save LKR {formattedSavings}
                            </span>
                        </div>
                    )}
                </div>

                {/* Features Grid */}
                <div className="mb-5">
                    <div className="grid grid-cols-2 gap-3">
                        {features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                                <div
                                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: `${feature.color}15` }}
                                >
                                    <feature.icon
                                        className="w-4 h-4"
                                        style={{ color: feature.color }}
                                    />
                                </div>
                                <span className="text-xs text-gray-700 leading-tight font-medium mt-1">
                                    {feature.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Highlights with Checkmarks */}
                <div className="mb-6 space-y-2">
                    {highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{highlight}</span>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                    }}
                    className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden group/btn shadow-lg"
                    style={{
                        background: `linear-gradient(135deg, ${badgeColor}, ${badgeColor}dd)`,
                    }}
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        View Details
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </span>
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                </button>
            </div>

            {/* Card Border Glow on Hover */}
            <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                    boxShadow: `0 0 30px ${badgeColor}40`
                }}
            />
        </div>
    );
}