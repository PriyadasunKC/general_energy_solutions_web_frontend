import React from 'react';
import { solarTheme } from '@/theme/theme';
import { PaginationSkeleton } from '../Pagination';

function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden border h-full flex flex-col" style={{ borderColor: solarTheme.primary[100] }}>
            {/* Shimmer Effect Overlay */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent z-10" />

            <div className="animate-pulse">
                {/* Header Skeleton */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-200">
                    <div className="h-6 bg-gray-300 rounded w-2/3 mb-2" />
                    <div className="h-4 bg-gray-300 rounded w-1/2" />
                </div>

                {/* Image Section Skeleton */}
                <div className="relative h-48 sm:h-64 lg:h-80 xl:h-96 bg-gray-200" />

                {/* Content Section Skeleton */}
                <div className="flex-1 p-4 sm:p-5 flex flex-col">
                    <div className="flex-1 space-y-3">
                        {/* Our Offer Skeleton */}
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                            <div className="space-y-1 ml-4">
                                <div className="h-3 bg-gray-200 rounded w-full" />
                                <div className="h-3 bg-gray-200 rounded w-5/6" />
                                <div className="h-3 bg-gray-200 rounded w-4/5" />
                            </div>
                        </div>

                        {/* DIY/Features Skeleton */}
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                            <div className="space-y-1 ml-4">
                                <div className="h-3 bg-gray-200 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 rounded w-2/3" />
                                <div className="h-3 bg-gray-200 rounded w-3/4" />
                            </div>
                        </div>
                    </div>

                    {/* Button Skeleton */}
                    <div className="mt-4">
                        <div className="w-full h-10 sm:h-12 bg-gray-200 rounded-lg sm:rounded-xl" />
                    </div>
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
    );
}

export default function MainProductsPageSkeleton() {
    return (
        <div className="min-h-screen" style={{ background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white, ${solarTheme.secondary[50]})` }}>
            {/* Hero Section Skeleton */}
            <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-2 sm:pb-4">
                <div className="text-center max-w-5xl mx-auto animate-pulse">
                    <div className="h-8 sm:h-10 bg-gray-200 rounded w-64 mx-auto mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-96 mx-auto" />
                </div>
            </div>

            {/* Products Section Skeleton */}
            <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                    </div>

                    {/* Pagination Skeleton */}
                    <PaginationSkeleton />
                </div>
            </div>

            {/* Bottom CTA Skeleton */}
            <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 text-center bg-gray-200 animate-pulse">
                        <div className="h-6 bg-gray-300 rounded w-48 mx-auto mb-3" />
                        <div className="h-4 bg-gray-300 rounded w-96 mx-auto mb-4" />
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                            <div className="h-10 bg-gray-300 rounded-lg w-32" />
                            <div className="h-10 bg-gray-300 rounded-lg w-32" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}