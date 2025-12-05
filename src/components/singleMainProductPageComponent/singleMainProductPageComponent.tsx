import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useCurrentPackage, usePackageItems } from '@/hooks/packageHook';
import SingleProductPageSkeleton from '@/components/ui/Skeletons/SingleProductPageSkeleton';
import { solarTheme } from '@/theme/theme';


export default function SingleMainProductPageComponent() {
  const [selectedCapacityIndex, setSelectedCapacityIndex] = useState<number>(0);
  const [packageId, setPackageId] = useState<string>('');

  // Use Redux hooks
  const {
    currentPackage,
    packageLoading,
    packageError,
    fetchPackage,
    clearPackage
  } = useCurrentPackage();

  const {
    packageItems,
    packageItemsLoading,
    packageItemsError,
    fetchItems,
    clearItems
  } = usePackageItems();

  // Get package ID from URL
  useEffect(() => {
    const urlPath = window.location.pathname;
    const id = urlPath.split('/').pop() || '';
    setPackageId(id);
  }, []);

  // Fetch package and items when ID changes
  useEffect(() => {
    const loadData = async () => {
      if (packageId) {
        try {
          await fetchPackage(packageId);
          await fetchItems(packageId);
        } catch (error) {
          console.error('Failed to load package data:', error);
        }
      }
    };

    loadData();

    // Cleanup on unmount
    return () => {
      clearPackage();
      clearItems();
    };
  }, [packageId]);

  // Navigation handlers
  const handleBackClick = () => {
    window.location.href = '/main-products';
  };

  const handleCapacitySelect = (index: number) => {
    setSelectedCapacityIndex(index);
  };

  const handleItemClick = (itemId: string) => {
    window.location.href = `/products/${itemId}`;
  };

  // Show skeleton while loading
  if (packageLoading || packageItemsLoading) {
    return <SingleProductPageSkeleton />;
  }

  // Error state
  if (packageError || packageItemsError) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white)`
      }}>
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Product</h2>
          <p className="text-gray-600 mb-4">{packageError || packageItemsError}</p>
          <button
            onClick={handleBackClick}
            className="px-6 py-2 rounded-lg text-white font-semibold"
            style={{ backgroundColor: solarTheme.primary[600] }}
          >
            Back to Products
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={handleBackClick}
            className="px-6 py-2 rounded-lg text-white font-semibold"
            style={{ backgroundColor: solarTheme.primary[600] }}
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  // Extract package data
  const primaryImage = currentPackage.image_urls?.[0] || '/packages/product_placeholder.png';
  const salePrice = parseFloat(currentPackage.sale_price);
  const originalPrice = parseFloat(currentPackage.original_price);
  const savings = originalPrice - salePrice;

  // Format prices
  const formattedSalePrice = `LKR ${salePrice.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
  const formattedOriginalPrice = `LKR ${originalPrice.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

  // Extract specifications
  const powerOutput = currentPackage.specification.power_output || 'N/A';
  const warranty = currentPackage.specification.warranty || '25 years';
  const efficiency = currentPackage.specification.efficiency || '20.5%';
  const panelType = currentPackage.specification.panel_type || 'Monocrystalline';

  // Create capacity options (can be expanded based on your needs)
  // For now, showing the current package as the main option
  const capacities = [
    {
      power: powerOutput,
      price: formattedSalePrice,
      battery: 'Included',
      panels: panelType,
      runtime: 'All Day',
      homes: currentPackage.subtitle || 'All homes',
      isSelected: true
    }
  ];

  // Features from description or default
  const features = [
    `${efficiency} efficiency`,
    `${warranty} warranty`,
    `${powerOutput} power output`,
    'Smart energy management',
    'Remote monitoring',
    'Professional installation',
    'Weather resistant',
    'Grid-tie ready'
  ];

  // What's included items
  const includedItems = packageItems.length > 0
    ? packageItems.map(item => `${item.title} (${item.quantity}x)`)
    : [
      'High-efficiency solar panels',
      'Inverter system',
      'Battery storage',
      'Mounting hardware',
      'Monitoring system',
      'Installation kit',
      'Warranty documentation'
    ];

  const selectedCapacity = capacities[selectedCapacityIndex];

  return (
    <div className="min-h-screen" style={{
      background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white)`
    }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* Back Button */}
        <div className="mb-3 sm:mb-4 flex justify-end">
          <button
            onClick={handleBackClick}
            className="flex items-center space-x-2 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg text-sm"
            style={{ backgroundColor: solarTheme.primary[600] }}
          >
            <span>← Back to Products</span>
          </button>
        </div>

        {/* Product Hero */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4 sm:mb-6">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] flex items-center justify-center" style={{
              background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, ${solarTheme.primary[100]})`
            }}>
              <img
                src={primaryImage}
                alt={currentPackage.title}
                className="w-full h-full object-contain p-4 sm:p-6 lg:p-8"
                style={{ maxHeight: '100%', maxWidth: '100%' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/packages/product_placeholder.png";
                }}
              />
              {currentPackage.is_featured && (
                <div className="absolute top-4 left-4 px-3 py-2 rounded-full text-xs sm:text-sm font-semibold text-white"
                  style={{ backgroundColor: solarTheme.primary[600] }}
                >
                  Featured Package
                </div>
              )}
              {!currentPackage.is_available && (
                <div className="absolute top-4 right-4 px-3 py-2 rounded-full text-xs sm:text-sm font-semibold text-white bg-red-500">
                  Limited Stock
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-4 sm:p-6">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                {currentPackage.title}
              </h1>
              <p className="text-sm sm:text-base mb-3" style={{ color: solarTheme.primary[600] }}>
                {currentPackage.subtitle}
              </p>
              <p className="text-gray-700 text-xs sm:text-sm mb-4 leading-relaxed">
                {currentPackage.description}
              </p>

              {/* Pricing */}
              <div className="mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-1 sm:space-y-0">
                  <span className="text-xl sm:text-2xl font-bold text-green-600">
                    {formattedSalePrice}
                  </span>
                  {savings > 0 && (
                    <>
                      <span className="text-sm text-gray-400 line-through">
                        {formattedOriginalPrice}
                      </span>
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                        Save LKR {savings.toFixed(2)}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-gray-500 mt-1 text-xs">
                  {currentPackage.is_available ? 'In Stock' : 'Limited Availability'} • Installation included
                </p>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
                <div className="p-2 sm:p-3 rounded-lg border" style={{
                  background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, ${solarTheme.primary[100]})`,
                  borderColor: solarTheme.primary[200]
                }}>
                  <p className="font-semibold text-xs sm:text-sm" style={{ color: solarTheme.primary[800] }}>
                    Power Output
                  </p>
                  <p className="text-gray-700 text-xs sm:text-sm">{powerOutput}</p>
                </div>
                <div className="p-2 sm:p-3 rounded-lg border" style={{
                  background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, ${solarTheme.primary[100]})`,
                  borderColor: solarTheme.primary[200]
                }}>
                  <p className="font-semibold text-xs sm:text-sm" style={{ color: solarTheme.primary[800] }}>
                    Efficiency
                  </p>
                  <p className="text-gray-700 text-xs sm:text-sm">{efficiency}</p>
                </div>
              </div>

              {/* Place Order Button - Top */}
              <button
                onClick={() => window.location.href = `/package-checkout/${packageId}`}
                className="w-full py-3 px-6 rounded-lg font-bold text-white transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
                style={{
                  background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[500]})`
                }}
              >
                <span>Place Order - {formattedSalePrice}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Package Code Display */}
        {currentPackage.package_code && (
          <div className="bg-white rounded-xl shadow-lg p-4 mb-4 sm:mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Package Code:</span>
              <span className="text-sm font-semibold" style={{ color: solarTheme.primary[600] }}>
                {currentPackage.package_code}
              </span>
            </div>
          </div>
        )}

        {/* What's Included & Features */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
              What&apos;s Included
            </h2>
            <div className="space-y-2">
              {includedItems.map((item, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center mt-0.5"
                    style={{ backgroundColor: solarTheme.primary[100] }}
                  >
                    <div className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: solarTheme.primary[500] }}
                    />
                  </div>
                  <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
              Key Features
            </h2>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center mt-0.5"
                    style={{ backgroundColor: solarTheme.secondary[100] }}
                  >
                    <div className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: solarTheme.secondary[500] }}
                    />
                  </div>
                  <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Package Items as DIY Components */}
        {packageItems.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 text-center">
              Package Components
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {packageItems.map((item, index) => {
                const itemPrice = parseFloat(item.price);
                const formattedPrice = `LKR ${itemPrice.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}`;
                const itemImage = item.image_urls?.[0] || '/packages/product_placeholder.png';

                return (
                  <div
                    key={item.package_item_id}
                    className="group relative bg-white rounded-2xl border-2 hover:shadow-xl transition-all duration-300 transform hover:scale-105 h-full flex flex-col overflow-hidden cursor-pointer"
                    style={{
                      borderColor: solarTheme.primary[200],
                      minHeight: '300px'
                    }}
                    onClick={() => handleItemClick(item.package_item_id)}
                  >
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden rounded-t-2xl">
                      <img
                        src={itemImage}
                        alt={item.title}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                        style={{ background: `linear-gradient(135deg, ${solarTheme.primary[100]}, ${solarTheme.primary[200]})` }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/packages/product_placeholder.png";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                      {/* Quantity Badge */}
                      <div
                        className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: solarTheme.primary[500],
                          color: 'white'
                        }}
                      >
                        Qty: {item.quantity}
                      </div>

                      {/* Click to View Badge */}
                      <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs font-semibold bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Click to View
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-3 flex flex-col flex-1">
                      {/* Item Name */}
                      <div className="text-center mb-2">
                        <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-primary-600 transition-colors duration-300"
                          style={{ color: solarTheme.primary[700] }}
                        >
                          {item.title}
                        </h3>
                      </div>

                      {/* Price */}
                      <div className="text-center mb-2">
                        <div
                          className="text-lg font-bold leading-tight"
                          style={{ color: solarTheme.primary[600] }}
                        >
                          {formattedPrice}
                        </div>
                        <div className="text-xs text-gray-500">Individual Component</div>
                      </div>

                      {/* Subtitle */}
                      {item.subtitle && (
                        <div className="flex-1 mb-2">
                          <p className="text-gray-600 text-xs text-center leading-tight line-clamp-2">
                            {item.subtitle}
                          </p>
                        </div>
                      )}

                      {/* View Details Button */}
                      <button
                        className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-300 hover:shadow-md"
                        style={{
                          backgroundColor: solarTheme.primary[100],
                          color: solarTheme.primary[700]
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemClick(item.package_item_id);
                        }}
                        onMouseEnter={(e) => {
                          const target = e.target as HTMLButtonElement;
                          target.style.backgroundColor = solarTheme.primary[500];
                          target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          const target = e.target as HTMLButtonElement;
                          target.style.backgroundColor = solarTheme.primary[100];
                          target.style.color = solarTheme.primary[700];
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="rounded-xl p-4 sm:p-6 text-center" style={{
          background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[700]})`
        }}>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
            Ready to Get Started?
          </h3>
          <p className="text-sm text-white/90 mb-4 max-w-2xl mx-auto">
            Order this {powerOutput} solar package and start saving on energy costs today!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              className="bg-white cursor-pointer text-gray-900 font-bold py-2.5 px-4 sm:px-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 text-sm"
              onClick={() => window.location.href = `/package-checkout/${packageId}`}
            >
              Place Order - {formattedSalePrice}
            </button>
            <button
              className="border-2 border-white cursor-pointer text-white font-bold py-2.5 px-4 sm:px-6 rounded-lg hover:bg-white/10 transition-colors duration-300 text-sm"
              onClick={() => window.location.href = '/contact-us'}
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}