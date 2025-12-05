import React, { useState, useEffect, JSX } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Star, ShoppingCart, Eye, Zap, Filter, Loader, Check } from 'lucide-react';
import { FrontEndBaseURL } from "@/config/FrontEndBaseURL";
import { BackEndBaseURL } from "@/config/BackEndBaseURL";
import { solarTheme } from '@/theme/theme';
import { useProducts } from '@/hooks/productHook';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/userHook';
import { Product } from '@/types/productTypes';
import Pagination, { PaginationSkeleton } from '@/components/ui/Pagination';

type FilterCategory = "All" | string;

// Skeleton Card Component
const SkeletonCard = (): JSX.Element => (
    <div className="group bg-white rounded-xl shadow-lg overflow-hidden border" style={{ borderColor: solarTheme.primary[100] }}>
        <div className="relative h-40 sm:h-48 bg-gray-200 animate-pulse" style={{
            background: `linear-gradient(90deg, ${solarTheme.primary[100]}, ${solarTheme.primary[50]}, ${solarTheme.primary[100]})`
        }}>
            <div className="w-full h-full" />
        </div>
        <div className="p-3 sm:p-4 space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex gap-1">
                    {Array(5).fill(0).map((_, i) => (
                        <div key={i} className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded-full animate-pulse" />
                    ))}
                </div>
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            </div>
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-2 pt-2">
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
            </div>
        </div>
    </div>
);

// Skeleton Filter Component
const SkeletonFilter = (): JSX.Element => (
    <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 lg:p-6 mb-6 sm:mb-8 space-y-4">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="grid grid-cols-2 sm:flex gap-2">
                    {Array(4).fill(0).map((_, i) => (
                        <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse flex-1" />
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
            </div>
            <div className="flex gap-2">
                <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse" />
                <div className="w-24 h-12 bg-gray-200 rounded-lg animate-pulse" />
            </div>
        </div>
    </div>
);

export default function ProductsPageComponent(): JSX.Element {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Product hooks
    const {
        products,
        categories,
        productsLoading,
        categoriesLoading,
        productsError,
        productsPagination,
        advancedSearchProducts,
        fetchProducts,
        fetchMoreProducts,
        clearFilters,
        initializeProducts,
        isInitialized,
    } = useProducts();

    // Auth and Cart hooks
    const { isAuthenticated, redirectToLogin } = useAuth();
    const { addToCartSafe, isProductInCart, openCartSidebar } = useCart();

    // Local state
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [modelQuery, setModelQuery] = useState<string>("");
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [addingProductId, setAddingProductId] = useState<string | null>(null);

    // Initialize products and categories on mount
    useEffect(() => {
        if (!isInitialized) {
            initializeProducts();
        }
    }, [isInitialized, initializeProducts]);

    // Read URL parameters and automatically filter by category
    useEffect(() => {
        const initializeFromURL = async () => {
            // Only proceed if we have categories loaded and search params
            if (!searchParams || categories.length === 0 || isSearching) {
                return;
            }

            const categoryName = searchParams.get('categoryName');

            // If there's no category in URL, load all products if not already loaded
            if (!categoryName && products.length === 0 && !productsLoading) {
                await fetchProducts({ page: 1, limit: 20 });
                return;
            }

            // If there's a category in URL
            if (categoryName) {
                const decodedCategory = decodeURIComponent(categoryName);
                const category = categories.find(c => c.category_name === decodedCategory);

                if (category && selectedCategoryId !== category.category_id) {
                    // Set the selected category
                    setSelectedCategoryId(category.category_id);
                    setIsSearching(true);
                    setCurrentPage(1);

                    try {
                        // Perform the search for this category
                        await advancedSearchProducts({
                            category: category.category_name,
                            page: 1,
                            limit: 20
                        });
                    } catch (error) {
                        console.error('Failed to filter by category from URL:', error);
                    } finally {
                        setIsSearching(false);
                    }
                }
            }
        };

        initializeFromURL();
    }, [searchParams, categories, selectedCategoryId]);

    const handleProductClick = (productId: string): void => {
        window.location.href = `${FrontEndBaseURL}/products/${productId}`;
    };

    const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>, product: Product): Promise<void> => {
        e.stopPropagation();

        // Check if user is authenticated
        if (!isAuthenticated) {
            const currentUrl = window.location.pathname + window.location.search;
            sessionStorage.setItem('returnUrl', currentUrl);
            redirectToLogin('Please sign in to add items to cart');
            return;
        }

        // Check if already in cart
        if (isProductInCart(product.product_id)) {
            openCartSidebar();
            return;
        }

        // Add to cart
        setAddingProductId(product.product_id);
        const success = await addToCartSafe(product.product_id, 1);
        setAddingProductId(null);

        if (success) {
            openCartSidebar();
        }
    };

    const handleBuyNow = (e: React.MouseEvent<HTMLButtonElement>, productId: string): void => {
        e.stopPropagation();

        // Check if user is authenticated
        if (!isAuthenticated) {
            const currentUrl = window.location.pathname + window.location.search;
            sessionStorage.setItem('returnUrl', currentUrl);
            redirectToLogin('Please sign in to continue');
            return;
        }

        window.location.href = `${BackEndBaseURL}/checkout?productId=${productId}`;
    };

    const renderStars = (rating: number): JSX.Element[] => {
        return Array.from({ length: 5 }, (_, i: number): JSX.Element => (
            <Star
                key={i}
                className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ));
    };

    const handleCategoryClick = async (categoryId: string): Promise<void> => {
        setSelectedCategoryId(categoryId);
        setCurrentPage(1);
        setIsSearching(true);

        try {
            if (categoryId === "All") {
                await fetchProducts({ page: 1, limit: 20 });
                router.push('/products', { scroll: false });
            } else {
                const category = categories.find(c => c.category_id === categoryId);
                if (category) {
                    await advancedSearchProducts({
                        category: category.category_name,
                        name: searchQuery || undefined,
                        model: modelQuery || undefined,
                        page: 1,
                        limit: 20
                    });

                    const params = new URLSearchParams();
                    params.set('categoryName', category.category_name);
                    router.push(`?${params.toString()}`, { scroll: false });
                }
            }
        } catch (error) {
            console.error('Failed to filter by category:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchQuery(e.target.value);
    };

    const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setModelQuery(e.target.value);
    };

    const handleSearch = async (): Promise<void> => {
        setIsSearching(true);
        setCurrentPage(1);

        try {
            const categoryName = selectedCategoryId !== "All"
                ? categories.find(c => c.category_id === selectedCategoryId)?.category_name
                : undefined;

            await advancedSearchProducts({
                category: categoryName,
                name: searchQuery || undefined,
                model: modelQuery || undefined,
                page: 1,
                limit: 20
            });
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleClearFilters = async (): Promise<void> => {
        setSearchQuery("");
        setModelQuery("");
        setSelectedCategoryId("All");
        setCurrentPage(1);
        clearFilters();
        router.push('/products', { scroll: false });
        await fetchProducts({ page: 1, limit: 20 });
    };

    const handlePageClick = async (pageNum: number): Promise<void> => {
        if (pageNum === currentPage) return;

        setIsSearching(true);
        try {
            const categoryName = selectedCategoryId !== "All"
                ? categories.find(c => c.category_id === selectedCategoryId)?.category_name
                : undefined;

            if (searchQuery || modelQuery || selectedCategoryId !== "All") {
                await advancedSearchProducts({
                    category: categoryName,
                    name: searchQuery || undefined,
                    model: modelQuery || undefined,
                    page: pageNum,
                    limit: 20
                });
            } else {
                await fetchProducts({ page: pageNum, limit: 20 });
            }
            setCurrentPage(pageNum);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Failed to load page:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const displayCategories: { id: string; name: string }[] = [
        { id: "All", name: "All" },
        ...categories.map(c => ({ id: c.category_id, name: c.category_name }))
    ];

    const totalPages = productsPagination.total ? Math.ceil(productsPagination.total / productsPagination.limit) : 1;

    return (
        <div className="min-h-screen" style={{
            background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white, ${solarTheme.secondary[50]})`
        }}>
            <div className="px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-6 sm:mb-8">
                        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
                            Solar Energy
                            <span className="block text-transparent bg-clip-text mt-1" style={{
                                backgroundImage: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.secondary[500]}, ${solarTheme.primary[500]})`
                            }}>
                                Products
                                {selectedCategoryId !== "All" && (
                                    <span className="block text-sm font-medium text-gray-600 mt-2">
                                        Showing {categories.find(c => c.category_id === selectedCategoryId)?.category_name} products
                                    </span>
                                )}
                            </span>
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto px-2">
                            Discover our comprehensive range of high-quality solar energy solutions
                        </p>
                    </div>

                    {/* Filter Section */}
                    {categoriesLoading ? (
                        <SkeletonFilter />
                    ) : (
                        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 lg:p-6 mb-6 sm:mb-8" style={{ border: '1px solid', borderColor: solarTheme.primary[200] }}>
                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                <Filter className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: solarTheme.primary[600] }} />
                                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Filter Products</h2>
                            </div>

                            <div className="space-y-4">
                                {/* Category Filter */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                                        {displayCategories.map((category): JSX.Element => (
                                            <button
                                                key={category.id}
                                                onClick={() => handleCategoryClick(category.id)}
                                                disabled={isSearching || productsLoading}
                                                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 min-h-[44px] flex items-center justify-center ${selectedCategoryId === category.id
                                                    ? 'text-white shadow-md'
                                                    : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                style={{
                                                    background: selectedCategoryId === category.id
                                                        ? `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[500]})`
                                                        : undefined
                                                }}
                                            >
                                                {category.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Search Filters */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Search by Name</label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search by product name..."
                                                value={searchQuery}
                                                onChange={handleSearchChange}
                                                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-2.5 text-sm sm:text-base border rounded-lg focus:ring-2 focus:outline-none transition-colors duration-200"
                                                style={{
                                                    borderColor: searchQuery ? solarTheme.primary[300] : '#d1d5db',
                                                    '--tw-ring-color': solarTheme.primary[300],
                                                    minHeight: '44px'
                                                } as React.CSSProperties}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Search by Model</label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search by model code..."
                                                value={modelQuery}
                                                onChange={handleModelChange}
                                                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-2.5 text-sm sm:text-base border rounded-lg focus:ring-2 focus:outline-none transition-colors duration-200"
                                                style={{
                                                    borderColor: modelQuery ? solarTheme.primary[300] : '#d1d5db',
                                                    '--tw-ring-color': solarTheme.primary[300],
                                                    minHeight: '44px'
                                                } as React.CSSProperties}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSearch}
                                        disabled={isSearching || productsLoading}
                                        className="flex-1 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{
                                            background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[500]})`
                                        }}
                                    >
                                        {isSearching ? 'Searching...' : 'Search'}
                                    </button>
                                    <button
                                        onClick={handleClearFilters}
                                        disabled={isSearching || productsLoading}
                                        className="px-6 py-3 border-2 rounded-lg font-medium transition-all duration-200 min-h-[44px] disabled:opacity-50"
                                        style={{
                                            borderColor: solarTheme.primary[300],
                                            color: solarTheme.primary[600]
                                        }}
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {(productsLoading || isSearching) && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                {Array(8).fill(0).map((_, i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </div>

                            {/* Pagination Skeleton */}
                            <PaginationSkeleton />
                        </>
                    )}

                    {/* Error State */}
                    {productsError && !productsLoading && !isSearching && (
                        <div className="text-center py-12">
                            <div className="text-red-500 mb-4 font-medium text-lg">{productsError}</div>
                            <button
                                onClick={handleClearFilters}
                                className="text-white font-medium py-3 px-6 rounded-lg"
                                style={{
                                    background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[500]})`
                                }}
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Products Grid */}
                    {!productsLoading && !isSearching && products.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
                                {products.map((product: Product): JSX.Element => {
                                    const inCart = isProductInCart(product.product_id);
                                    const isAddingThis = addingProductId === product.product_id;
                                    const price = parseFloat(product.sale_price);
                                    const originalPrice = parseFloat(product.original_price);

                                    return (
                                        <div
                                            key={product.product_id}
                                            className="group cursor-pointer bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border"
                                            style={{ borderColor: solarTheme.primary[100] }}
                                            onClick={() => handleProductClick(product.product_id)}
                                        >
                                            <div className="relative h-40 sm:h-48 overflow-hidden" style={{
                                                background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, ${solarTheme.primary[100]})`
                                            }}>
                                                <img
                                                    src={product.image_urls[0] || "/packages/product_placeholder.png"}
                                                    alt={product.title}
                                                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = "/packages/product_placeholder.png";
                                                    }}
                                                />
                                                {product.is_featured && (
                                                    <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold text-white"
                                                        style={{ backgroundColor: solarTheme.secondary[500] }}>
                                                        Featured
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-3 sm:p-4">
                                                <div className="flex items-center justify-between mb-2 sm:mb-3">
                                                    <div className="flex items-center gap-1">
                                                        {renderStars(4.5)}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs" style={{ color: solarTheme.secondary[600] }}>
                                                        <Zap className="w-3 h-3" />
                                                        <span>{product.sold_quantity} sold</span>
                                                    </div>
                                                </div>

                                                <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors leading-tight">
                                                    {product.title}
                                                </h3>

                                                <p className="text-xs text-gray-600 mb-2 sm:mb-3">Model: {product.product_code}</p>

                                                <div className="text-lg sm:text-xl font-bold mb-3 sm:mb-4" style={{ color: solarTheme.primary[600] }}>
                                                    LKR {price.toFixed(2)}
                                                    {originalPrice > price && (
                                                        <span className="text-sm text-gray-500 line-through ml-2">${originalPrice.toFixed(2)}</span>
                                                    )}
                                                </div>

                                                <div className="space-y-2 sm:space-y-3">
                                                    <button
                                                        onClick={(e) => handleAddToCart(e, product)}
                                                        disabled={isAddingThis}
                                                        className="w-full flex cursor-pointer items-center justify-center gap-2 border-2 font-medium py-3 sm:py-2.5 px-4 rounded-lg transition-all duration-200 text-sm hover:shadow-md min-h-[44px] disabled:opacity-50"
                                                        style={{
                                                            borderColor: solarTheme.primary[300],
                                                            color: solarTheme.primary[600],
                                                            backgroundColor: inCart ? solarTheme.primary[50] : 'white'
                                                        }}
                                                    >
                                                        {isAddingThis ? (
                                                            <>
                                                                <Loader className="w-4 h-4 animate-spin" />
                                                                <span className="truncate">Adding...</span>
                                                            </>
                                                        ) : inCart ? (
                                                            <>
                                                                <Check className="w-4 h-4" />
                                                                <span className="truncate">In Cart</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ShoppingCart className="w-4 h-4" />
                                                                <span className="truncate">Add to Cart</span>
                                                            </>
                                                        )}
                                                    </button>

                                                    <button
                                                        onClick={(e) => handleBuyNow(e, product.product_id)}
                                                        className="w-full text-white cursor-pointer font-bold py-3 sm:py-2.5 px-4 rounded-lg transition-all duration-200 text-sm hover:shadow-md transform hover:scale-[1.02] min-h-[44px]"
                                                        style={{
                                                            background: `linear-gradient(to right, ${solarTheme.primary[500]}, ${solarTheme.primary[600]})`
                                                        }}
                                                    >
                                                        Buy Now
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pagination Section */}
                            {products.length > 0 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalItems={productsPagination.total || products.length}
                                    itemsPerPage={productsPagination.limit}
                                    onPageChange={handlePageClick}
                                    showItemsInfo={true}
                                    maxPageButtons={5}
                                />
                            )}
                        </>
                    )}

                    {/* No Products Found */}
                    {!productsLoading && !isSearching && products.length === 0 && (
                        <div className="text-center py-8 sm:py-12 px-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: solarTheme.primary[100] }}>
                                <Search className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: solarTheme.primary[600] }} />
                            </div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto leading-relaxed">
                                No products match your search criteria
                            </p>
                            <button
                                onClick={handleClearFilters}
                                className="text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 min-h-[44px] text-sm sm:text-base"
                                style={{
                                    background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[500]})`
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}