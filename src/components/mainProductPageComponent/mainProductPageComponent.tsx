import React, { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { usePackages } from '@/hooks/packageHook';
import MainProductsPageSkeleton from '@/components/ui/Skeletons/MainProductsPageSkeleton';
import { Package } from '@/types/packageTypes';
import { solarTheme } from '@/theme/theme';
import { BackEndBaseURL } from "@/config/BackEndBaseURL";
import { FrontEndBaseURL } from "@/config/FrontEndBaseURL";

interface OfferItem {
  text: string;
}

export default function MainProductPageComponent() {
  // Use Redux hooks
  const {
    packages,
    packagesLoading,
    packagesError,
    fetchPackages,
    isInitialized
  } = usePackages();

  // Fetch packages on mount
  useEffect(() => {
    const loadPackages = async () => {
      try {
        if (!isInitialized) {
          // Fetch featured packages or all packages
          await fetchPackages({ isFeatured: true, limit: 10 });
        }
      } catch (error) {
        console.error('Failed to load packages:', error);
      }
    };

    loadPackages();
  }, [isInitialized, fetchPackages]);

  const handleProductClick = (packageId: string): void => {
    window.location.href = `${FrontEndBaseURL}/main-products/${packageId}`;
  };

  // Filter packages for Offgrid and Hybrid solutions
  // You can customize this logic based on your package naming convention
  const offgridPackage = packages.find(pkg =>
    pkg.title.toLowerCase().includes('offgrid') ||
    pkg.package_code.toLowerCase().includes('off')
  ) || packages[0]; // Fallback to first package

  const hybridPackage = packages.find(pkg =>
    pkg.title.toLowerCase().includes('hybrid') ||
    pkg.package_code.toLowerCase().includes('hyb')
  ) || packages[1]; // Fallback to second package

  // Extract features from package data or use defaults
  const getOfferItems = (pkg: Package): OfferItem[] => {
    if (!pkg) return [];

    // Try to extract from description or use specifications
    const items: OfferItem[] = [];

    if (pkg.specification.power_output) {
      items.push({ text: `Power Output: ${pkg.specification.power_output}` });
    }
    if (pkg.specification.warranty) {
      items.push({ text: `Warranty: ${pkg.specification.warranty}` });
    }
    if (pkg.specification.efficiency) {
      items.push({ text: `Efficiency: ${pkg.specification.efficiency}` });
    }

    // Add default items if we don't have enough
    if (items.length < 3) {
      items.push({ text: "Scalable storage capacities" });
      items.push({ text: "Professional installation included" });
    }

    return items.slice(0, 3);
  };

  const getDIYItems = (pkg: Package): string[] => {
    if (!pkg || !pkg.packageItems) return ["Inverter", "Solar Panels", "Battery & Installation Kit"];

    // Extract unique item types
    const items = pkg.packageItems.slice(0, 3).map(item => item.title);
    return items.length > 0 ? items : ["Inverter", "Solar Panels", "Battery & Installation Kit"];
  };

  // Show skeleton while loading
  if (packagesLoading && packages.length === 0) {
    return <MainProductsPageSkeleton />;
  }

  // Error state
  if (packagesError && packages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white, ${solarTheme.secondary[50]})`
      }}>
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Products</h2>
          <p className="text-gray-600 mb-4">{packagesError}</p>
          <button
            onClick={() => fetchPackages({ isFeatured: true, limit: 10 })}
            className="px-6 py-2 rounded-lg text-white font-semibold"
            style={{ backgroundColor: solarTheme.primary[600] }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (packages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white, ${solarTheme.secondary[50]})`
      }}>
        <div className="text-center max-w-md mx-auto p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Products Available</h2>
          <p className="text-gray-600">Please check back later for our solar energy solutions.</p>
        </div>
      </div>
    );
  }

  // Prepare data for each product
  const offgridOfferItems = offgridPackage ? getOfferItems(offgridPackage) : [];
  const offgridDIYItems = offgridPackage ? getDIYItems(offgridPackage) : [];

  const hybridOfferItems = hybridPackage ? getOfferItems(hybridPackage) : [];
  const hybridFeatures = hybridPackage ? getDIYItems(hybridPackage) : [];

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white, ${solarTheme.secondary[50]})` }}>
      {/* Hero Section */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-2 sm:pb-4">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
            Solar Energy
            <span className="block text-transparent bg-clip-text" style={{
              backgroundImage: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.secondary[500]}, ${solarTheme.primary[500]})`
            }}>
              Solutions
            </span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform your energy independence with our cutting-edge solar solutions
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">

            {/* OFFGRID SOLUTIONS */}
            {offgridPackage && (
              <div
                className="group cursor-pointer"
                onClick={() => handleProductClick(offgridPackage.package_id)}
              >
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.01] hover:shadow-xl border h-full flex flex-col" style={{ borderColor: solarTheme.primary[100] }}>
                  {/* Header */}
                  <div className="px-4 sm:px-6 py-3 sm:py-4" style={{ background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[700]})` }}>
                    <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-1">
                      {offgridPackage.title.toUpperCase()}
                    </h2>
                    <p className="text-xs sm:text-sm" style={{ color: solarTheme.primary[100] }}>
                      {offgridPackage.subtitle || 'Complete independence from the grid'}
                    </p>
                  </div>

                  {/* Large Image */}
                  <div className="relative h-48 sm:h-64 lg:h-80 xl:h-96 overflow-hidden" style={{ background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, ${solarTheme.primary[100]})` }}>
                    <img
                      src={offgridPackage.image_urls?.[0] || "/packages/product_placeholder.png"}
                      alt={offgridPackage.title}
                      className="w-full h-full object-contain p-3 sm:p-4 transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/packages/product_placeholder.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Featured Badge */}
                    {offgridPackage.is_featured && (
                      <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 sm:p-5 flex flex-col">
                    <div className="flex-1 space-y-3">
                      {/* Our Offer */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                          <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: solarTheme.primary[500] }}></span>
                          Our Offer
                        </h3>
                        <ul className="text-xs text-gray-700 space-y-1 ml-4">
                          {offgridOfferItems.map((item: OfferItem, index: number) => (
                            <li key={index} className="list-disc">{item.text}</li>
                          ))}
                        </ul>
                      </div>

                      {/* DIY Offer */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                          <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: solarTheme.primary[500] }}></span>
                          Package Includes
                        </h3>
                        <ul className="text-xs text-gray-700 space-y-1 ml-4">
                          {offgridDIYItems.map((item: string, index: number) => (
                            <li key={index} className="list-disc">{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Price */}
                      {offgridPackage.sale_price && (
                        <div className="pt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-green-600">
                              LKR {parseFloat(offgridPackage.sale_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                            {parseFloat(offgridPackage.original_price) > parseFloat(offgridPackage.sale_price) && (
                              <span className="text-xs text-gray-400 line-through">
                                LKR {parseFloat(offgridPackage.original_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Reserve Button */}
                    <div className="mt-4">
                      <button
                        className="w-full text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:ring-2 focus:outline-none text-xs sm:text-sm"
                        style={{
                          background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[700]})`,
                          boxShadow: `0 0 0 0 ${solarTheme.primary[300]}`,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(offgridPackage.package_id);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HYBRID SOLUTIONS */}
            {hybridPackage && (
              <div
                className="group cursor-pointer"
                onClick={() => handleProductClick(hybridPackage.package_id)}
              >
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.01] hover:shadow-xl border h-full flex flex-col" style={{ borderColor: solarTheme.primary[100] }}>
                  {/* Header */}
                  <div className="px-4 sm:px-6 py-3 sm:py-4" style={{ background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[700]})` }}>
                    <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-1">
                      {hybridPackage.title.toUpperCase()}
                    </h2>
                    <p className="text-xs sm:text-sm" style={{ color: solarTheme.primary[100] }}>
                      {hybridPackage.subtitle || 'Best of both grid and solar power'}
                    </p>
                  </div>

                  {/* Large Image */}
                  <div className="relative h-48 sm:h-64 lg:h-80 xl:h-96 overflow-hidden" style={{ background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, ${solarTheme.primary[100]})` }}>
                    <img
                      src={hybridPackage.image_urls?.[0] || "/packages/product_placeholder.png"}
                      alt={hybridPackage.title}
                      className="w-full h-full object-contain p-3 sm:p-4 transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/packages/product_placeholder.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Featured Badge */}
                    {hybridPackage.is_featured && (
                      <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 sm:p-5 flex flex-col">
                    <div className="flex-1 space-y-3">
                      {/* Our Offer */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                          <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: solarTheme.primary[500] }}></span>
                          Our Offer
                        </h3>
                        <ul className="text-xs text-gray-700 space-y-1 ml-4">
                          {hybridOfferItems.map((item: OfferItem, index: number) => (
                            <li key={index} className="list-disc">{item.text}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Key Features */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                          <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: solarTheme.primary[500] }}></span>
                          Package Includes
                        </h3>
                        <ul className="text-xs text-gray-700 space-y-1 ml-4">
                          {hybridFeatures.map((feature: string, index: number) => (
                            <li key={index} className="list-disc">{feature}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Price */}
                      {hybridPackage.sale_price && (
                        <div className="pt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-green-600">
                              LKR {parseFloat(hybridPackage.sale_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                            {parseFloat(hybridPackage.original_price) > parseFloat(hybridPackage.sale_price) && (
                              <span className="text-xs text-gray-400 line-through">
                                LKR {parseFloat(hybridPackage.original_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Reserve Button */}
                    <div className="mt-4">
                      <button
                        className="w-full text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:ring-2 focus:outline-none text-xs sm:text-sm"
                        style={{
                          background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[700]})`,
                          boxShadow: `0 0 0 0 ${solarTheme.primary[300]}`,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(hybridPackage.package_id);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 text-center" style={{
            background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[500]}, ${solarTheme.primary[600]})`
          }}>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2">
              Ready to Go Solar?
            </h3>
            <p className="text-xs sm:text-sm text-white/90 mb-3 sm:mb-4">
              Join thousands of satisfied customers who have made the switch to clean, renewable energy.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
              <button
                onClick={() => window.location.href = '/contact-us'}
                className="bg-white font-bold py-2 px-4 sm:px-6 rounded-lg transition-colors duration-300 text-xs sm:text-sm cursor-pointer"
                style={{ color: solarTheme.primary[700] }}
              >
                Get Quote
              </button>
              <button
                onClick={() => window.location.href = '/about'}
                className="border-2 border-white text-white font-bold py-2 px-4 sm:px-6 rounded-lg hover:bg-white transition-all duration-300 text-xs sm:text-sm cursor-pointer"
                onMouseEnter={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.color = solarTheme.primary[700];
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.color = 'white';
                }}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}