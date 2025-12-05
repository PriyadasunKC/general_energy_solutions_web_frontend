import React from 'react';

export default function SolarPackageCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative">
            {/* Shimmer Effect Overlay */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />

            <div className="animate-pulse">
                {/* Image Section Skeleton */}
                <div className="relative h-64 bg-gray-200">
                    {/* Badge Skeleton - Top Left */}
                    <div className="absolute top-4 left-4 w-24 h-7 bg-gray-300 rounded-full" />

                    {/* Rating Skeleton - Top Right */}
                    <div className="absolute top-4 right-4 w-16 h-7 bg-white/90 rounded-full" />
                </div>

                {/* Content Section Skeleton */}
                <div className="p-6">
                    {/* Title & Power Output Skeleton */}
                    <div className="mb-4">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                    </div>

                    {/* Pricing Skeleton */}
                    <div className="mb-5">
                        <div className="flex items-baseline gap-2 mb-2">
                            <div className="h-8 bg-gray-200 rounded w-40" />
                            <div className="h-4 bg-gray-200 rounded w-24" />
                        </div>
                        <div className="w-36 h-6 bg-gray-200 rounded-full" />
                    </div>

                    {/* Features Grid Skeleton */}
                    <div className="mb-5">
                        <div className="grid grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="flex items-start gap-2">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-200" />
                                    <div className="flex-1 space-y-1 mt-1">
                                        <div className="h-3 bg-gray-200 rounded w-full" />
                                        <div className="h-3 bg-gray-200 rounded w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Highlights Skeleton */}
                    <div className="mb-6 space-y-2">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-gray-200 flex-shrink-0" />
                                <div className="h-4 bg-gray-200 rounded flex-1" />
                            </div>
                        ))}
                    </div>

                    {/* CTA Button Skeleton */}
                    <div className="w-full h-12 bg-gray-200 rounded-xl" />
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

// Skeleton for multiple cards
export function SolarPackageCardSkeletonGrid({ count = 3 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="animate-fadeInUp"
                    style={{ animationDelay: `${index * 150}ms` }}
                >
                    <SolarPackageCardSkeleton />
                </div>
            ))}
        </>
    );
}