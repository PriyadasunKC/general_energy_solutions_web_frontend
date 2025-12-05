import React from 'react';
import { solarTheme } from '@/theme/theme';

export default function SingleProductPageSkeleton() {
    return (
        <div className="min-h-screen" style={{ background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white)` }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                {/* Back Button Skeleton */}
                <div className="mb-3 sm:mb-4 flex justify-end">
                    <div className="w-40 h-10 bg-gray-200 rounded-lg animate-pulse" />
                </div>

                {/* Product Hero Skeleton */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4 sm:mb-6 animate-pulse">
                    <div className="grid lg:grid-cols-2 gap-0">
                        {/* Image Section */}
                        <div className="relative min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] bg-gray-200">
                            <div className="absolute top-4 left-4 w-32 h-8 bg-gray-300 rounded-full" />
                        </div>

                        {/* Content Section */}
                        <div className="p-4 sm:p-6">
                            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
                            <div className="h-6 bg-gray-200 rounded w-1/2 mb-3" />
                            <div className="space-y-2 mb-4">
                                <div className="h-4 bg-gray-200 rounded w-full" />
                                <div className="h-4 bg-gray-200 rounded w-full" />
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                            </div>

                            {/* Price Skeleton */}
                            <div className="mb-4">
                                <div className="h-8 bg-gray-200 rounded w-48 mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-40" />
                            </div>

                            {/* Quick Specs Skeleton */}
                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                <div className="p-2 sm:p-3 rounded-lg bg-gray-100">
                                    <div className="h-4 bg-gray-200 rounded w-24 mb-1" />
                                    <div className="h-4 bg-gray-200 rounded w-16" />
                                </div>
                                <div className="p-2 sm:p-3 rounded-lg bg-gray-100">
                                    <div className="h-4 bg-gray-200 rounded w-24 mb-1" />
                                    <div className="h-4 bg-gray-200 rounded w-16" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Capacity Selection Skeleton */}
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 animate-pulse">
                    <div className="h-7 bg-gray-200 rounded w-48 mx-auto mb-6" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="p-5 rounded-2xl border-2 border-gray-200 bg-white">
                                <div className="h-6 bg-gray-200 rounded-full w-16 mb-3" />
                                <div className="text-center mb-4">
                                    <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-1" />
                                    <div className="h-3 bg-gray-200 rounded w-24 mx-auto" />
                                </div>
                                <div className="space-y-2">
                                    {[1, 2, 3, 4].map((spec) => (
                                        <div key={spec} className="flex justify-between items-center py-1">
                                            <div className="h-3 bg-gray-200 rounded w-16" />
                                            <div className="h-3 bg-gray-200 rounded w-20" />
                                        </div>
                                    ))}
                                </div>
                                <div className="w-full h-8 bg-gray-200 rounded-lg mt-4" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* What's Included & Features Skeleton */}
                <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    {[1, 2].map((section) => (
                        <div key={section} className="bg-white rounded-xl shadow-lg p-4 sm:p-6 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-40 mb-4" />
                            <div className="space-y-2">
                                {[1, 2, 3, 4, 5, 6].map((item) => (
                                    <div key={item} className="flex items-start space-x-2">
                                        <div className="w-4 h-4 rounded-full bg-gray-200 mt-0.5" />
                                        <div className="h-4 bg-gray-200 rounded flex-1" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Section Skeleton */}
                <div className="rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 animate-pulse" style={{
                    background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[700]})`
                }}>
                    <div className="h-6 bg-white/20 rounded w-48 mx-auto mb-2" />
                    <div className="h-4 bg-white/20 rounded w-96 mx-auto mb-4" />
                    <div className="flex justify-center">
                        <div className="h-10 bg-white/20 rounded-lg w-64" />
                    </div>
                </div>

                {/* DIY Components Skeleton */}
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-56 mx-auto mb-6" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
                                <div className="h-48 bg-gray-200" />
                                <div className="p-3">
                                    <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-2" />
                                    <div className="h-6 bg-gray-200 rounded w-24 mx-auto mb-2" />
                                    <div className="h-3 bg-gray-200 rounded w-full mb-1" />
                                    <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                                    <div className="h-8 bg-gray-200 rounded-lg w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
        </div>
    );
}