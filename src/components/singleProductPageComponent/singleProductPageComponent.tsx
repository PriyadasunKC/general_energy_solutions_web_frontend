import React, { useState, useEffect, JSX } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { solarTheme } from '@/theme/theme';
import { ChevronLeft, ChevronRight, Loader, AlertCircle, Check } from 'lucide-react';
import { useCurrentProduct } from '@/hooks/productHook';
import { useAuth } from '@/hooks/useAuth';
import { useCart, useProductCartStatus } from '@/hooks/userHook';
import { Product, ProductSpecifications } from '@/types/productTypes';
import { PackageItem } from '@/types/packageTypes';
import { PackageService } from '@/services/packageService';

interface ProductSpec {
    label: string;
    value: string;
}

// Helper function to transform PackageItem to Product format
const transformPackageItemToProduct = (packageItem: PackageItem, packageInfo?: { title: string; package_id: string }): Product => {
    return {
        product_id: packageItem.package_item_id,
        product_code: packageInfo?.package_id || packageItem.package_id,
        title: packageItem.title,
        subtitle: packageItem.subtitle || '',
        description: packageItem.description,
        specifications: packageItem.specification as unknown as ProductSpecifications,
        image_urls: packageItem.image_urls.length > 0 ? packageItem.image_urls : ['/packages/product_placeholder.png'],
        quantity_available: packageItem.quantity,
        sale_price: packageItem.price,
        original_price: packageItem.price,
        is_featured: false,
        is_available: !packageItem.is_deleted && packageItem.quantity > 0,
        is_deleted: packageItem.is_deleted,
        sold_quantity: 0,
        modified_at: packageItem.modified_at,
        modified_by: packageItem.modified_by,
        categories: packageInfo ? [{
            category_id: packageInfo.package_id,
            category_name: `Package: ${packageInfo.title}`,
            category_description: 'Package Component',
            image_url: '',
            is_enable: true,
            created_at: '',
            modified_at: ''
        }] : []
    };
};

// Skeleton components remain the same
const SkeletonImageGallery = (): JSX.Element => (
    <div className="space-y-3 sm:space-y-4">
        <div className="relative bg-gray-200 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden h-64 sm:h-80 md:h-96 lg:h-[500px] animate-pulse"
            style={{
                background: `linear-gradient(90deg, ${solarTheme.primary[100]}, ${solarTheme.primary[50]}, ${solarTheme.primary[100]})`
            }}
        />
        <div className="flex space-x-2 overflow-x-auto pb-2">
            {Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-200 animate-pulse" />
            ))}
        </div>
    </div>
);

const SkeletonProductDetails = (): JSX.Element => (
    <div className="space-y-4 sm:space-y-6">
        <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="flex gap-2 pt-2">
                <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
        </div>
        <div className="space-y-2">
            <div className="flex gap-3">
                <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="flex gap-2">
                {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
                ))}
            </div>
        </div>
        <div className="space-y-3">
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="flex gap-3">
                <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-12 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse" />
            </div>
        </div>
        <div className="space-y-3">
            <div className="h-14 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-14 bg-gray-200 rounded-xl animate-pulse" />
        </div>
        <div className="space-y-3 p-4 rounded-xl" style={{ backgroundColor: solarTheme.primary[50] }}>
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
            </div>
        </div>
    </div>
);

const SkeletonSpecifications = (): JSX.Element => (
    <div className="mt-8 sm:mt-12">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 sm:p-6 space-y-6">
                <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {Array(6).fill(0).map((_, i) => (
                        <div key={i} className="p-3 sm:p-4 rounded-lg" style={{ backgroundColor: solarTheme.primary[50] }}>
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default function SingleProductPageComponent(): JSX.Element {
    const params = useParams();
    const router = useRouter();
    const productId = params?.id as string;

    const { currentProduct, productLoading, productError, fetchProduct } = useCurrentProduct();
    const { isAuthenticated, redirectToLogin } = useAuth();
    const { addToCartSafe, openCartSidebar } = useCart();
    const { isInCart, addingToCart } = useProductCartStatus(productId);

    const [selectedImage, setSelectedImage] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);
    const [packageItemProduct, setPackageItemProduct] = useState<Product | null>(null);
    const [isSearchingPackages, setIsSearchingPackages] = useState<boolean>(false);
    const [notFoundError, setNotFoundError] = useState<string | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

    // Fetch product on mount, if fails, try to find it in packages
    useEffect(() => {
        if (productId) {
            // Reset states when productId changes
            setPackageItemProduct(null);
            setNotFoundError(null);
            setIsSearchingPackages(false);
            setIsInitialLoad(true);

            fetchProduct(productId)
                .then(() => {
                    setIsInitialLoad(false);
                })
                .catch(async (err) => {
                console.error('Failed to fetch product:', err);

                // If product not found, search in packages for a matching package item
                setIsSearchingPackages(true);
                try {
                    const packagesResponse = await PackageService.fetchPackages({ limit: 100 });
                    let found = false;

                    // Search through all packages for a matching package item
                    for (const pkg of packagesResponse.data) {
                        // Fetch package items for this package
                        try {
                            const itemsResponse = await PackageService.fetchPackageItems(pkg.package_id);
                            const matchingItem = itemsResponse.data.find(
                                item => item.package_item_id === productId
                            );

                            if (matchingItem) {
                                // Transform package item to product format
                                const transformedProduct = transformPackageItemToProduct(matchingItem, {
                                    title: pkg.title,
                                    package_id: pkg.package_id
                                });
                                setPackageItemProduct(transformedProduct);
                                found = true;
                                break;
                            }
                        } catch (itemsError) {
                            console.error(`Failed to fetch items for package ${pkg.package_id}:`, itemsError);
                            // Continue to next package
                        }
                    }

                    if (!found) {
                        setNotFoundError('Product or package item not found');
                    }
                } catch (packageError) {
                    console.error('Failed to search packages:', packageError);
                    setNotFoundError('Product not found');
                } finally {
                    setIsSearchingPackages(false);
                    setIsInitialLoad(false);
                }
            });
        }
    }, [productId, fetchProduct]);

    // Reset selected image when product changes
    useEffect(() => {
        setSelectedImage(0);
    }, [currentProduct, packageItemProduct]);

    // Determine which product to display
    const displayProduct = currentProduct || packageItemProduct;
    const isLoading = isInitialLoad || productLoading || isSearchingPackages;
    const hasError = !isInitialLoad && ((productError && !packageItemProduct) || notFoundError);

    if (isLoading) {
        return (
            <div className="min-h-screen" style={{ backgroundColor: solarTheme.neutral[50] }}>
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
                    <nav className="mb-4 sm:mb-6">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                        </div>
                    </nav>
                    <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                        <SkeletonImageGallery />
                        <SkeletonProductDetails />
                    </div>
                    <SkeletonSpecifications />
                </div>
            </div>
        );
    }

    if (hasError || !displayProduct) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: solarTheme.neutral[50] }}>
                <div className="text-center max-w-md px-4">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
                    <p className="text-gray-600 mb-6">{notFoundError || productError || 'The product you are looking for does not exist.'}</p>
                    <button
                        onClick={() => window.location.href = '/products'}
                        className="text-white font-medium py-3 px-6 rounded-lg"
                        style={{
                            background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[500]})`
                        }}
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    const product: Product = displayProduct;
    const price = parseFloat(product.sale_price);
    const originalPrice = parseFloat(product.original_price);
    const hasDiscount = originalPrice > price;
    const discount = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    const productImages = product.image_urls.length > 0
        ? product.image_urls.map((url, index) => ({ id: index, url, alt: `${product.title} - Image ${index + 1}` }))
        : [{ id: 0, url: "/packages/product_placeholder.png", alt: product.title }];

    const productSpecs: ProductSpec[] = Object.entries(product.specifications || {})
        .filter(([_, value]) => value !== null && value !== undefined && value !== '')
        .map(([key, value]) => ({
            label: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
            value: String(value)
        }));

    const renderStars = (rating: number): JSX.Element[] => {
        return Array(5).fill(0).map((_, i) => (
            <span
                key={i}
                className={`text-base sm:text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            >
                ★
            </span>
        ));
    };

    const handleAddToCart = async (): Promise<void> => {
        // Check if user is authenticated
        if (!isAuthenticated) {
            // Save current URL to return after login
            const currentUrl = window.location.pathname;
            redirectToLogin(`Please sign in to add items to cart`);
            // Store return URL in sessionStorage
            sessionStorage.setItem('returnUrl', currentUrl);
            return;
        }

        // Add to cart
        const success = await addToCartSafe(productId, quantity);
        if (success) {
            openCartSidebar();
        }
    };

    const handleBuyNow = (): void => {
        // Check if user is authenticated
        if (!isAuthenticated) {
            const currentUrl = window.location.pathname;
            redirectToLogin(`Please sign in to continue`);
            sessionStorage.setItem('returnUrl', currentUrl);
            return;
        }

        // Proceed to checkout
        router.push(`/checkout?productId=${productId}&quantity=${quantity}`);
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: solarTheme.neutral[50] }}>
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
                {/* Breadcrumb */}
                <nav className="mb-4 sm:mb-6">
                    <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm overflow-x-auto">
                        <span className="text-gray-500 whitespace-nowrap cursor-pointer hover:text-gray-700 transition-colors" onClick={() => window.location.href = '/'}>Home</span>
                        <span className="text-gray-400">›</span>
                        <span className="text-gray-500 whitespace-nowrap cursor-pointer hover:text-gray-700 transition-colors" onClick={() => window.location.href = '/products'}>Solar Products</span>
                        <span className="text-gray-400">›</span>
                        <span style={{ color: solarTheme.primary[600] }} className="whitespace-nowrap truncate max-w-[200px]">
                            {product.title}
                        </span>
                    </div>
                </nav>

                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                    {/* Image Gallery Section */}
                    <div className="space-y-3 sm:space-y-4">
                        <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={productImages[selectedImage].url}
                                alt={productImages[selectedImage].alt}
                                className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-contain"
                                style={{ background: `linear-gradient(135deg, ${solarTheme.primary[50]}, ${solarTheme.primary[100]})` }}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/packages/product_placeholder.png";
                                }}
                            />

                            {productImages.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : productImages.length - 1)}
                                        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg transition-all duration-300 min-h-[44px] min-w-[44px]"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft className='cursor-pointer w-4 h-4 sm:w-5 sm:h-5 text-gray-700' />
                                    </button>
                                    <button
                                        onClick={() => setSelectedImage(selectedImage < productImages.length - 1 ? selectedImage + 1 : 0)}
                                        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg transition-all duration-300 min-h-[44px] min-w-[44px]"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight className='cursor-pointer w-4 h-4 sm:w-5 sm:h-5 text-gray-700' />
                                    </button>
                                </>
                            )}

                            {hasDiscount && (
                                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 px-2 sm:px-3 py-1 rounded-full text-white text-xs sm:text-sm font-semibold"
                                    style={{ backgroundColor: solarTheme.secondary[500] }}
                                >
                                    {discount}% OFF
                                </div>
                            )}

                            {product.is_featured && (
                                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 px-2 sm:px-3 py-1 rounded-full text-white text-xs sm:text-sm font-semibold"
                                    style={{ backgroundColor: solarTheme.primary[600] }}
                                >
                                    FEATURED
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        {productImages.length > 1 && (
                            <div className="flex space-x-2 overflow-x-auto pb-2">
                                {productImages.map((image, index) => (
                                    <button
                                        key={image.id}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 min-h-[44px] min-w-[44px] ${selectedImage === index
                                            ? `border-2`
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        style={{
                                            borderColor: selectedImage === index ? solarTheme.primary[500] : undefined
                                        }}
                                        aria-label={`View image ${index + 1}`}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={image.url}
                                            alt={image.alt}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = "/packages/product_placeholder.png";
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details Section */}
                    <div className="space-y-4 sm:space-y-6">
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                                {product.title}
                            </h1>
                            <p className="text-base sm:text-lg mb-3 leading-relaxed" style={{ color: solarTheme.primary[600] }}>
                                {product.subtitle}
                            </p>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
                                <div className="flex items-center">
                                    {renderStars(4)}
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                                    <span className="text-gray-600">(4.5 out of 5)</span>
                                    <span className="text-gray-400 hidden sm:inline">•</span>
                                    <span className="text-gray-600">{product.sold_quantity} sold</span>
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
                                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                                    ${price.toFixed(2)}
                                </span>
                                {hasDiscount && (
                                    <span className="text-lg sm:text-xl text-gray-500 line-through">
                                        ${originalPrice.toFixed(2)}
                                    </span>
                                )}
                            </div>
                            {hasDiscount && (
                                <div className="text-sm font-semibold" style={{ color: solarTheme.secondary[600] }}>
                                    Save LKR {(originalPrice - price).toFixed(2)} ({discount}% off)
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${product.is_available && product.quantity_available > 0
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {product.is_available && product.quantity_available > 0
                                        ? `${product.quantity_available} in stock`
                                        : 'Out of stock'}
                                </div>
                            </div>
                        </div>

                        {/* Categories */}
                        {product.categories.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Categories:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.categories.map(category => (
                                        <span
                                            key={category.category_id}
                                            className="px-3 py-1 rounded-full text-sm font-medium transition-colors hover:shadow-md"
                                            style={{
                                                backgroundColor: solarTheme.primary[100],
                                                color: solarTheme.primary[700]
                                            }}
                                        >
                                            {category.category_name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Quantity:</h3>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-12 sm:w-10 sm:h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-300 min-h-[44px] min-w-[44px]"
                                    aria-label="Decrease quantity"
                                >
                                    <span className="text-gray-700 font-semibold text-lg">−</span>
                                </button>
                                <span className="w-16 text-center font-semibold text-lg sm:text-xl" role="status" aria-label={`Quantity: ${quantity}`}>{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.quantity_available, quantity + 1))}
                                    disabled={quantity >= product.quantity_available}
                                    className="w-12 h-12 sm:w-10 sm:h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-300 min-h-[44px] min-w-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Increase quantity"
                                >
                                    <span className="text-gray-700 font-semibold text-lg">+</span>
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 sm:space-y-3">
                            <button
                                onClick={handleBuyNow}
                                disabled={!product.is_available || product.quantity_available === 0}
                                className="w-full py-4 px-6 rounded-xl font-bold text-white text-base sm:text-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[50px] sm:min-h-[56px]"
                                style={{
                                    background: product.is_available && product.quantity_available > 0
                                        ? `linear-gradient(135deg, ${solarTheme.primary[600]}, ${solarTheme.primary[700]})`
                                        : '#9ca3af'
                                }}
                            >
                                {product.is_available && product.quantity_available > 0 ? 'Buy Now' : 'Out of Stock'}
                            </button>

                            <button
                                onClick={handleAddToCart}
                                disabled={!product.is_available || product.quantity_available === 0 || addingToCart}
                                className="w-full py-4 px-6 rounded-xl font-bold text-base sm:text-lg border-2 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed min-h-[50px] sm:min-h-[56px] flex items-center justify-center gap-2"
                                style={{
                                    borderColor: isInCart ? solarTheme.primary[500] : solarTheme.primary[500],
                                    color: isInCart ? solarTheme.primary[700] : solarTheme.primary[700],
                                    backgroundColor: isInCart ? solarTheme.primary[50] : 'white'
                                }}
                            >
                                {addingToCart ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        <span>Adding...</span>
                                    </>
                                ) : isInCart ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        <span>In Cart</span>
                                    </>
                                ) : (
                                    'Add to Cart'
                                )}
                            </button>
                        </div>

                        {/* Product Description */}
                        <div className="rounded-xl p-4" style={{ backgroundColor: solarTheme.primary[50] }}>
                            <h3 className="font-semibold text-gray-900 mb-3 text-base sm:text-lg">Description:</h3>
                            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                                {product.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                {productSpecs.length > 0 && (
                    <div className="mt-8 sm:mt-12">
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
                            <div className="p-4 sm:p-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Technical Specifications</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                    {productSpecs.map((spec, index) => (
                                        <div key={index} className="p-3 sm:p-4 rounded-lg transition-all hover:shadow-md" style={{ backgroundColor: solarTheme.primary[50] }}>
                                            <dt className="font-semibold text-gray-900 text-sm sm:text-base mb-1">{spec.label}</dt>
                                            <dd className="text-gray-700 text-sm sm:text-base">{spec.value}</dd>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
