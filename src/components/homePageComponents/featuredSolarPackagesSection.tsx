import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { usePackages } from '@/hooks/packageHook';
import SolarPackageCard from '@/components/ui/SolarPackageCard';
import { SolarPackageCardSkeletonGrid } from '@/components/ui/Skeletons/SolarPackageCardSkeleton';

// Define a solar-themed color palette
import { solarTheme } from '@/theme/theme';

// Floating background elements component
const FloatingElements = () => {
  const elements = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 20 + Math.random() * 10,
    size: 20 + Math.random() * 40,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((element) => (
        <div
          key={element.id}
          className="absolute rounded-full opacity-10"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.size}px`,
            height: `${element.size}px`,
            background: `radial-gradient(circle, ${solarTheme.primary[200]}, ${solarTheme.secondary[200]})`,
            animation: `float ${element.duration}s ease-in-out infinite`,
            animationDelay: `${element.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default function FeaturedSolarPackagesSection() {
  const [scrollY, setScrollY] = useState(0);

  // Use the packages hook to get Redux state and actions
  const {
    packages: allPackages,
    packagesLoading,
    packagesError,
    getFeaturedPackages,
    fetchPackages,
    isInitialized
  } = usePackages();

  // Fetch packages on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        if (!isInitialized) {
          // Fetch featured packages
          await fetchPackages({ isFeatured: true, limit: 3 });
        }
      } catch (error) {
        console.error('Failed to fetch featured packages:', error);
      }
    };

    initializeData();
  }, [isInitialized, fetchPackages]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation handler
  const handleCardClick = (packageId: string) => {
    // Navigate to the product details page
    window.location.href = `/main-products/${packageId}`;
  };

  // Get featured packages from Redux store
  const featuredPackages = getFeaturedPackages();

  // Limit to 3 packages for featured section
  const displayPackages = featuredPackages.slice(0, 3);

  // Badge configurations for each package
  const badges = [
    { text: 'Most Popular', color: solarTheme.secondary[500] },
    { text: 'Best Value', color: solarTheme.primary[500] },
    { text: 'Premium', color: solarTheme.accent[500] }
  ];

  // Generate ratings (you can add this to your API later)
  const ratings = [4.9, 4.8, 4.9];

  // Show skeleton while loading
  const showSkeleton = packagesLoading && displayPackages.length === 0;

  // Error state (only show if not loading)
  if (packagesError && !packagesLoading && displayPackages.length === 0) {
    return (
      <section
        className="relative py-8 lg:py-12 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${solarTheme.primary[50]} 0%, ${solarTheme.secondary[50]} 50%, ${solarTheme.accent[50]} 100%)`
        }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-red-500 mb-4">
              <AlertCircle className="w-12 h-12" />
            </div>
            <p className="text-lg text-gray-900 font-semibold mb-2">Unable to load packages</p>
            <p className="text-sm text-gray-600 mb-4">{packagesError}</p>
            <button
              onClick={() => fetchPackages({ isFeatured: true, limit: 3 })}
              className="px-6 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: solarTheme.primary[500] }}
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state (only show if not loading)
  if (!packagesLoading && displayPackages.length === 0) {
    return (
      <section
        className="relative py-8 lg:py-12 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${solarTheme.primary[50]} 0%, ${solarTheme.secondary[50]} 50%, ${solarTheme.accent[50]} 100%)`
        }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <p className="text-lg text-gray-600">No featured packages available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative py-12 lg:py-20 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${solarTheme.primary[50]} 0%, ${solarTheme.secondary[50]} 50%, ${solarTheme.accent[50]} 100%)`
      }}
    >
      {/* Background Elements */}
      <FloatingElements />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${solarTheme.primary[400]} 1px, transparent 0)`,
          backgroundSize: '60px 60px',
          transform: `translateY(${scrollY * 0.05}px)`
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: solarTheme.primary[500] }}
            />
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: solarTheme.primary[600] }}
            >
              Solar Packages
            </span>
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: solarTheme.secondary[500] }}
            />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Featured{' '}
            <span
              className="bg-gradient-to-r bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${solarTheme.primary[600]}, ${solarTheme.secondary[600]})`
              }}
            >
              Solar Packages
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our most popular solar solutions designed for maximum efficiency and savings.
            Choose the perfect system for your home&apos;s energy needs.
          </p>
        </div>

        {/* Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {showSkeleton ? (
            <SolarPackageCardSkeletonGrid count={3} />
          ) : (
            displayPackages.map((pkg, index) => (
              <div
                key={pkg.package_id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <SolarPackageCard
                  package={pkg}
                  badge={badges[index % badges.length]}
                  rating={ratings[index % ratings.length]}
                  onCardClick={handleCardClick}
                />
              </div>
            ))
          )}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 lg:mt-16">
          <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-6 lg:p-8 rounded-2xl lg:rounded-3xl bg-white/80 backdrop-blur-md border border-white/40 shadow-xl">
            <div className="text-center sm:text-left">
              <h4 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                Need a Custom Solution?
              </h4>
              <p className="text-sm lg:text-base text-gray-600">
                Get a personalized quote tailored to your specific energy needs
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/contact-us'}
              className={`
                flex-shrink-0 py-3 lg:py-4 px-6 lg:px-8 rounded-xl lg:rounded-2xl 
                font-semibold text-sm lg:text-base text-white
                transition-all duration-300 hover:scale-105 hover:shadow-2xl
                relative overflow-hidden group
                cursor-pointer
              `}
              style={{
                background: `linear-gradient(135deg, ${solarTheme.primary[500]}, ${solarTheme.primary[600]})`,
                boxShadow: `0 15px 30px ${solarTheme.primary[500]}40`
              }}
            >
              <span className="relative z-10 flex items-center">
                Get Custom Quote
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

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
    </section>
  );
}