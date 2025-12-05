import React from 'react';
import { solarTheme } from '@/theme/theme';

export default function OrderCardSkeleton() {
    return (
        <div
            className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden border relative"
            style={{ borderColor: solarTheme.primary[200] }}
        >
            {/* Shimmer Effect Overlay */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />

            <div className="animate-pulse">
                {/* Order Header */}
                <div className="p-3 sm:p-4 md:p-5 lg:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        {/* Order Info */}
                        <div className="flex-1 min-w-0">
                            {/* Order number and status badge */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                                <div className="h-5 sm:h-6 bg-gray-200 rounded w-32 sm:w-40" />
                                <div className="h-6 sm:h-8 bg-gray-200 rounded-full w-24 sm:w-28" />
                            </div>

                            {/* Order details grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                                <div className="h-4 sm:h-5 bg-gray-200 rounded w-28 sm:w-32" />
                                <div className="h-4 sm:h-5 bg-gray-200 rounded w-24 sm:w-28" />
                                <div className="h-4 sm:h-5 bg-gray-200 rounded w-32 sm:w-36" />
                                <div className="h-4 sm:h-5 bg-gray-200 rounded w-28 sm:w-32" />
                            </div>

                            {/* Address */}
                            <div className="mt-2">
                                <div className="h-3.5 sm:h-4 bg-gray-200 rounded w-full max-w-xs sm:max-w-md" />
                            </div>
                        </div>

                        {/* Order Total and Actions */}
                        <div className="flex flex-col items-start lg:items-end gap-3 flex-shrink-0">
                            {/* Total amount */}
                            <div className="w-full lg:text-right">
                                <div className="h-3.5 sm:h-4 bg-gray-200 rounded w-20 sm:w-24 mb-1.5 sm:mb-2" />
                                <div className="h-7 sm:h-8 bg-gray-200 rounded w-28 sm:w-32" />
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                                <div className="h-11 bg-gray-200 rounded-lg flex-1 sm:flex-initial sm:w-28 md:w-32" />
                                <div className="h-11 bg-gray-200 rounded-lg flex-1 sm:flex-initial sm:w-28 md:w-32" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inline styles for shimmer animation */}
            <style jsx>{`
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }

                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    );
}

// Skeleton for multiple order cards
export function OrderCardSkeletonList({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-3 sm:space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="animate-fadeInUp"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <OrderCardSkeleton />
                </div>
            ))}
        </div>
    );
}

// Export for use in Skeletons folder
export { OrderCardSkeleton as OrderSkeleton };
