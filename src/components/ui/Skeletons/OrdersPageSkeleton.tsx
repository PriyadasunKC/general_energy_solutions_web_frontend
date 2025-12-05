import React from 'react';
import { solarTheme } from '@/theme/theme';
import { OrderCardSkeletonList } from './OrderCardSkeleton';
import { PaginationSkeleton } from '../Pagination';

export default function OrdersPageSkeleton() {
    return (
        <div className="min-h-screen" style={{
            background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white, ${solarTheme.secondary[50]})`
        }}>
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                {/* Header Skeleton */}
                <div className="mb-4 sm:mb-6 lg:mb-8 animate-pulse">
                    <div className="h-8 sm:h-9 bg-gray-200 rounded w-40 sm:w-48 mb-1 sm:mb-2" />
                    <div className="h-4 sm:h-5 bg-gray-200 rounded w-48 sm:w-64" />
                </div>

                {/* Status Filters Skeleton */}
                <div className="mb-4 sm:mb-6 bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-5 border relative overflow-hidden" style={{ borderColor: solarTheme.primary[200] }}>
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />

                    <div className="animate-pulse">
                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-200 rounded flex-shrink-0" />
                            <div className="h-4 sm:h-5 bg-gray-200 rounded w-28 sm:w-32" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <div className="h-11 bg-gray-200 rounded-lg w-24 sm:w-28" />
                            <div className="h-11 bg-gray-200 rounded-lg w-20 sm:w-24" />
                            <div className="h-11 bg-gray-200 rounded-lg w-28 sm:w-32" />
                            <div className="h-11 bg-gray-200 rounded-lg w-24 sm:w-28" />
                            <div className="h-11 bg-gray-200 rounded-lg w-24 sm:w-28" />
                        </div>
                    </div>

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

                {/* Order Cards Skeleton */}
                <OrderCardSkeletonList count={5} />

                {/* Pagination Skeleton */}
                <PaginationSkeleton />
            </div>
        </div>
    );
}

// Export for use
export { OrdersPageSkeleton };
