'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCurrentPackage } from '@/hooks/packageHook';
import PackageCheckoutComponent from '@/components/packageCheckoutComponent/packageCheckoutComponent';
import SingleProductPageSkeleton from '@/components/ui/Skeletons/SingleProductPageSkeleton';
import { AlertCircle } from 'lucide-react';
import { solarTheme } from '@/theme/theme';

export default function PackageCheckoutPage() {
    const params = useParams();
    const packageId = params?.packageId as string;

    const {
        currentPackage,
        packageLoading,
        packageError,
        fetchPackage,
        clearPackage,
    } = useCurrentPackage();

    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        const loadPackageData = async () => {
            if (packageId) {
                try {
                    await fetchPackage(packageId);
                } catch (error) {
                    console.error('Failed to load package:', error);
                } finally {
                    setIsLoadingData(false);
                }
            }
        };

        loadPackageData();

        return () => {
            clearPackage();
        };
    }, [packageId, fetchPackage, clearPackage]);

    // Loading state
    if (packageLoading || isLoadingData) {
        return <SingleProductPageSkeleton />;
    }

    // Error state
    if (packageError) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{
                background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white)`
            }}>
                <div className="text-center max-w-md mx-auto p-8">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Package</h2>
                    <p className="text-gray-600 mb-4">{packageError}</p>
                    <button
                        onClick={() => window.location.href = '/main-products'}
                        className="px-6 py-2 rounded-lg text-white font-semibold"
                        style={{ backgroundColor: solarTheme.primary[600] }}
                    >
                        Back to Packages
                    </button>
                </div>
            </div>
        );
    }

    // No package found
    if (!currentPackage) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{
                background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white)`
            }}>
                <div className="text-center max-w-md mx-auto p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Package Not Found</h2>
                    <p className="text-gray-600 mb-4">The package you are looking for does not exist.</p>
                    <button
                        onClick={() => window.location.href = '/main-products'}
                        className="px-6 py-2 rounded-lg text-white font-semibold"
                        style={{ backgroundColor: solarTheme.primary[600] }}
                    >
                        Back to Packages
                    </button>
                </div>
            </div>
        );
    }

    return <PackageCheckoutComponent packageData={currentPackage} />;
}
