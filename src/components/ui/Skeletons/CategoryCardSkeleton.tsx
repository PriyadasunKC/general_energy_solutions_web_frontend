import React from 'react';
import { solarTheme } from '@/theme/theme';

export default function CategoryCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl lg:rounded-3xl shadow-lg overflow-hidden relative">
            {/* Shimmer Effect Overlay */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />

            <div className="animate-pulse">
                {/* Image Section */}
                <div className="relative h-40 sm:h-48 lg:h-40 bg-gray-200">
                    {/* Icon skeleton - top left */}
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-gray-300" />

                    {/* Count badge skeleton - top right */}
                    <div className="absolute top-4 right-4 w-24 h-6 bg-gray-300 rounded-full" />
                </div>

                {/* Content Section */}
                <div className="p-6 lg:p-8">
                    {/* Title Skeleton */}
                    <div className="mb-4">
                        <div className="h-7 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                    </div>

                    {/* Stats Skeleton */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-gray-200 rounded" />
                            <div className="h-4 bg-gray-200 rounded w-20" />
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-gray-200 rounded" />
                            <div className="h-3 bg-gray-200 rounded w-12" />
                        </div>
                    </div>

                    {/* Button Skeleton */}
                    <div className="w-full h-12 lg:h-14 bg-gray-200 rounded-xl lg:rounded-2xl" />
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
export function CategoryCardSkeletonGrid({ count = 4 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="animate-fadeInUp"
                    style={{ animationDelay: `${index * 150}ms` }}
                >
                    <CategoryCardSkeleton />
                </div>
            ))}
        </>
    );
}

// Export for use in Skeletons folder
export { CategoryCardSkeleton as CategorySkeleton };