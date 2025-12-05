import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Zap,
  Battery,
  Sun,
  Package,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Star,
  AlertCircle
} from 'lucide-react';
import { useCategoriesOnly, useProducts } from '@/hooks/productHook';
import { CategoryCardSkeletonGrid } from '@/components/ui/Skeletons/CategoryCardSkeleton';
import { Category } from '@/types/productTypes';
import { solarTheme } from '@/theme/theme';

// Floating background elements component
const FloatingElements = () => {
  const elements = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 15 + Math.random() * 10,
    size: 15 + Math.random() * 30,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((element) => (
        <div
          key={element.id}
          className="absolute rounded-full opacity-8"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.size}px`,
            height: `${element.size}px`,
            background: `radial-gradient(circle, ${solarTheme.primary[200]}, ${solarTheme.primary[300]})`,
            animation: `float ${element.duration}s ease-in-out infinite`,
            animationDelay: `${element.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// Icon mapping for different category types
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('panel')) return Sun;
  if (name.includes('inverter')) return Zap;
  if (name.includes('battery') || name.includes('batteries')) return Battery;
  if (name.includes('controller') || name.includes('regulator')) return Package;
  return Package; // Default icon
};

// Map category data to UI format
const mapCategoryToUI = (category: Category, index: number) => {
  // Cycle through colors for variety
  const colors = [
    solarTheme.primary[600],
    solarTheme.secondary[600],
    solarTheme.accent[600],
    solarTheme.primary[700],
  ];

  const color = colors[index % colors.length];

  return {
    id: category.category_id,
    name: category.category_name,
    categoryName: category.category_name,
    description: category.category_description || 'Quality solar products',
    image: category.image_url || '/packages/product_placeholder.png',
    icon: getCategoryIcon(category.category_name),
    color: color,
    gradient: `linear-gradient(135deg, ${color}, ${color}dd)`,
    bgGradient: `linear-gradient(135deg, ${color}15, ${color}25)`,
    count: '10+', // This could be dynamic if you track product counts per category
    type: 'Products'
  };
};

export default function PopularCategoriesSection() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const router = useRouter();

  // Use Redux hooks
  const {
    enabledCategories,
    categoriesLoading,
    categoriesError
  } = useCategoriesOnly();

  const { fetchCategories, isInitialized } = useProducts();

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        if (!isInitialized) {
          await fetchCategories({ isEnabled: true, limit: 8 });
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    loadCategories();
  }, [isInitialized, fetchCategories]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation handler
  const handleCategoryClick = (categoryName: string) => {
    router.push(`/products?categoryName=${encodeURIComponent(categoryName)}`);
  };

  // Map categories to UI format - limit to 4 for popular section
  const displayCategories = enabledCategories
    .slice(0, 4)
    .map((cat, idx) => mapCategoryToUI(cat, idx));

  // Show skeleton while loading
  const showSkeleton = categoriesLoading && displayCategories.length === 0;

  // Error state
  if (categoriesError && !categoriesLoading && displayCategories.length === 0) {
    return (
      <section
        className="relative py-16 lg:py-24 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${solarTheme.primary[50]} 0%, ${solarTheme.primary[100]} 50%, ${solarTheme.primary[50]} 100%)`
        }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-lg text-gray-900 font-semibold mb-2">Unable to load categories</p>
            <p className="text-sm text-gray-600 mb-4">{categoriesError}</p>
            <button
              onClick={() => fetchCategories({ isEnabled: true, limit: 8 })}
              className="px-6 py-2 rounded-lg text-white font-semibold"
              style={{ backgroundColor: solarTheme.primary[600] }}
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state (only show if not loading)
  if (!categoriesLoading && displayCategories.length === 0) {
    return (
      <section
        className="relative py-16 lg:py-24 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${solarTheme.primary[50]} 0%, ${solarTheme.primary[100]} 50%, ${solarTheme.primary[50]} 100%)`
        }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Package className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-lg text-gray-600">No categories available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative py-16 lg:py-24 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${solarTheme.primary[50]} 0%, ${solarTheme.primary[100]} 50%, ${solarTheme.primary[50]} 100%)`
      }}
    >
      {/* Background Elements */}
      <FloatingElements />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${solarTheme.primary[400]} 1px, transparent 0)`,
          backgroundSize: '50px 50px',
          transform: `translateY(${scrollY * 0.03}px)`
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
              Categories
            </span>
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: solarTheme.primary[500] }}
            />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Popular{' '}
            <span
              className="bg-gradient-to-r bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${solarTheme.primary[600]}, ${solarTheme.primary[700]})`
              }}
            >
              Categories
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive range of solar energy solutions.
            Find the perfect products for your renewable energy needs.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {showSkeleton ? (
            <CategoryCardSkeletonGrid count={4} />
          ) : (
            displayCategories.map((category, index) => (
              <div
                key={category.id}
                className="group relative animate-fadeInUp"
                onMouseEnter={() => setHoveredCard(category.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Card Container */}
                <div
                  onClick={() => handleCategoryClick(category.categoryName)}
                  className={`
                    relative overflow-hidden rounded-2xl lg:rounded-3xl
                    bg-white/10 backdrop-blur-md border border-white/20
                    transition-all duration-500 hover:scale-105 cursor-pointer
                    ${hoveredCard === category.id ? 'shadow-2xl bg-white/20' : 'shadow-lg'}
                    active:scale-95
                  `}
                  style={{
                    boxShadow: hoveredCard === category.id
                      ? `0 25px 50px ${category.color}20`
                      : '0 10px 30px rgba(0,0,0,0.1)'
                  }}
                >
                  {/* Image */}
                  <div className="relative h-40 sm:h-48 lg:h-40 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/packages/product_placeholder.png";
                      }}
                    />

                    {/* Hover overlay with icon */}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-md rounded-full p-3 transform scale-110">
                        <ArrowRight className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Category icon in corner */}
                    <div
                      className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30"
                      style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                    >
                      <category.icon className="w-5 h-5 text-white" />
                    </div>

                    {/* Count badge */}
                    <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md rounded-full px-3 py-1">
                      <span className="text-white text-xs font-bold">{category.count} {category.type}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 lg:p-8">
                    {/* Title */}
                    <div className="mb-4">
                      <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 group-hover:scale-105 transition-transform duration-300">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                        {category.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <TrendingUp
                          className="w-4 h-4"
                          style={{ color: category.color }}
                        />
                        <span
                          className="text-sm font-semibold"
                          style={{ color: category.color }}
                        >
                          {category.count} {category.type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-gray-500">Popular</span>
                      </div>
                    </div>

                    {/* Explore Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryClick(category.categoryName);
                      }}
                      className={`
                        w-full py-3 lg:py-4 px-6 rounded-xl lg:rounded-2xl 
                        font-semibold text-sm lg:text-base text-white
                        transition-all duration-300 hover:scale-105 hover:shadow-2xl
                        relative overflow-hidden group/btn active:scale-95
                      `}
                      style={{
                        background: category.gradient,
                        boxShadow: `0 10px 25px ${category.color}30`
                      }}
                    >
                      <span className="relative z-10 flex items-center justify-center whitespace-nowrap">
                        Explore {category.name}
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                    </button>
                  </div>

                  {/* Sparkle effect for hovered card */}
                  {hoveredCard === category.id && (
                    <div className="absolute top-6 right-6">
                      <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                    </div>
                  )}

                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 lg:mt-16">
          <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-6 lg:p-8 rounded-2xl lg:rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
            <div className="text-center sm:text-left">
              <h4 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                Can&apos;t Find What You Need?
              </h4>
              <p className="text-sm lg:text-base text-gray-600">
                Browse our complete catalog or contact us for custom solutions
              </p>
            </div>
            <button
              onClick={() => router.push('/products')}
              className={`
                flex-shrink-0 py-3 lg:py-4 px-6 lg:px-8 rounded-xl lg:rounded-2xl 
                font-semibold text-sm lg:text-base text-white
                transition-all duration-300 hover:scale-105 hover:shadow-2xl
                relative overflow-hidden group cursor-pointer
              `}
              style={{
                background: `linear-gradient(135deg, ${solarTheme.primary[500]}, ${solarTheme.primary[600]})`,
                boxShadow: `0 15px 30px ${solarTheme.primary[500]}40`
              }}
            >
              <span className="relative z-10 flex items-center whitespace-nowrap">
                View All Products
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
          33% { transform: translateY(-8px) rotate(1deg); }
          66% { transform: translateY(4px) rotate(-1deg); }
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
      `}</style>
    </section>
  );
}