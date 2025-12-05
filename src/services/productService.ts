// src/services/productService.ts
import { apiClient } from './apiClient';
import {
    Product,
    Category,
    ProductsResponse,
    ProductResponse,
    CategoriesResponse,
    CategoryResponse,
    ProductsQueryParams,
    CategoriesQueryParams,
    AdvancedSearchParams,
    PRODUCT_ENDPOINTS,
} from '../types/productTypes';

/**
 * Product Service
 * Handles all product and category-related API calls
 */
export class ProductService {
    /**
     * Fetch all products with optional filters
     */
    static async fetchProducts(params: ProductsQueryParams = {}): Promise<ProductsResponse> {
        try {
            const queryParams = new URLSearchParams();

            if (params.page) queryParams.set('page', params.page.toString());
            if (params.limit) queryParams.set('limit', params.limit.toString());
            if (params.isAvailable !== undefined) {
                queryParams.set('isAvailable', params.isAvailable.toString());
            }
            if (params.isFeatured !== undefined) {
                queryParams.set('isFeatured', params.isFeatured.toString());
            }
            if (params.search) {
                queryParams.set('search', params.search);
            }

            const queryString = queryParams.toString();
            const url = `${PRODUCT_ENDPOINTS.PRODUCTS}${queryString ? `?${queryString}` : ''}`;

            const response = await apiClient.get<ProductsResponse>(url);
            return response;
        } catch (error) {
            console.error('Failed to fetch products:', error);
            throw error;
        }
    }

    /**
     * Advanced product search with category name, product name, and model
     */
    static async advancedSearchProducts(params: AdvancedSearchParams = {}): Promise<ProductsResponse> {
        try {
            const queryParams = new URLSearchParams();

            if (params.category) queryParams.set('category', params.category);
            if (params.name) queryParams.set('name', params.name);
            if (params.model) queryParams.set('model', params.model);
            if (params.page) queryParams.set('page', params.page.toString());
            if (params.limit) queryParams.set('limit', params.limit.toString());

            const queryString = queryParams.toString();
            const url = `${PRODUCT_ENDPOINTS.ADVANCED_SEARCH}${queryString ? `?${queryString}` : ''}`;

            const response = await apiClient.get<ProductsResponse>(url);
            return response;
        } catch (error) {
            console.error('Failed to perform advanced search:', error);
            throw error;
        }
    }

    /**
     * Fetch product by ID
     */
    static async fetchProductById(id: string): Promise<ProductResponse> {
        try {
            if (!id) {
                throw new Error('Product ID is required');
            }

            const response = await apiClient.get<ProductResponse>(
                PRODUCT_ENDPOINTS.PRODUCT_BY_ID(id)
            );
            return response;
        } catch (error) {
            console.error(`Failed to fetch product ${id}:`, error);
            throw error;
        }
    }

    /**
     * Fetch all categories with optional filters
     */
    static async fetchCategories(params: CategoriesQueryParams = {}): Promise<CategoriesResponse> {
        try {
            const queryParams = new URLSearchParams();

            if (params.page) queryParams.set('page', params.page.toString());
            if (params.limit) queryParams.set('limit', params.limit.toString());
            if (params.isEnabled !== undefined) {
                queryParams.set('isEnabled', params.isEnabled.toString());
            }

            const queryString = queryParams.toString();
            const url = `${PRODUCT_ENDPOINTS.CATEGORIES}${queryString ? `?${queryString}` : ''}`;

            const response = await apiClient.get<CategoriesResponse>(url);
            return response;
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            throw error;
        }
    }

    /**
     * Fetch category by ID
     */
    static async fetchCategoryById(id: string): Promise<CategoryResponse> {
        try {
            if (!id) {
                throw new Error('Category ID is required');
            }

            const response = await apiClient.get<CategoryResponse>(
                PRODUCT_ENDPOINTS.CATEGORY_BY_ID(id)
            );
            return response;
        } catch (error) {
            console.error(`Failed to fetch category ${id}:`, error);
            throw error;
        }
    }

    /**
     * Search products by query
     */
    static async searchProducts(
        query: string,
        params: Omit<ProductsQueryParams, 'search'> = {}
    ): Promise<ProductsResponse> {
        try {
            if (!query.trim()) {
                throw new Error('Search query is required');
            }

            return await this.fetchProducts({
                ...params,
                search: query.trim(),
            });
        } catch (error) {
            console.error('Failed to search products:', error);
            throw error;
        }
    }

    /**
     * Fetch featured products
     */
    static async fetchFeaturedProducts(params: Omit<ProductsQueryParams, 'isFeatured'> = {}): Promise<ProductsResponse> {
        try {
            return await this.fetchProducts({
                ...params,
                isFeatured: true,
            });
        } catch (error) {
            console.error('Failed to fetch featured products:', error);
            throw error;
        }
    }

    /**
     * Fetch available products
     */
    static async fetchAvailableProducts(params: Omit<ProductsQueryParams, 'isAvailable'> = {}): Promise<ProductsResponse> {
        try {
            return await this.fetchProducts({
                ...params,
                isAvailable: true,
            });
        } catch (error) {
            console.error('Failed to fetch available products:', error);
            throw error;
        }
    }

    /**
     * Fetch products by category
     */
    static async fetchProductsByCategory(
        categoryId: string,
        params: Omit<ProductsQueryParams, 'categoryId'> = {}
    ): Promise<ProductsResponse> {
        try {
            if (!categoryId) {
                throw new Error('Category ID is required');
            }

            return await this.fetchProducts({
                ...params,
                categoryId,
            });
        } catch (error) {
            console.error(`Failed to fetch products for category ${categoryId}:`, error);
            throw error;
        }
    }

    /**
     * Fetch enabled categories only
     */
    static async fetchEnabledCategories(params: Omit<CategoriesQueryParams, 'isEnabled'> = {}): Promise<CategoriesResponse> {
        try {
            return await this.fetchCategories({
                ...params,
                isEnabled: true,
            });
        } catch (error) {
            console.error('Failed to fetch enabled categories:', error);
            throw error;
        }
    }

    /**
     * Check if product is in stock
     */
    static isProductInStock(product: Product): boolean {
        return product.is_available &&
            !product.is_deleted &&
            product.quantity_available > 0;
    }

    /**
     * Get product price information
     */
    static getProductPrice(product: Product): { sale: number; original: number; discount?: number } {
        const salePrice = parseFloat(product.sale_price);
        const originalPrice = parseFloat(product.original_price);

        const result = {
            sale: salePrice,
            original: originalPrice,
        };

        if (originalPrice > salePrice) {
            return {
                ...result,
                discount: Math.round(((originalPrice - salePrice) / originalPrice) * 100),
            };
        }

        return result;
    }

    /**
     * Format product specifications for display
     */
    static formatSpecifications(specifications: Record<string, unknown>): Array<{ key: string; value: string }> {
        return Object.entries(specifications)
            .filter(([_, value]) => value !== null && value !== undefined && value !== '')
            .map(([key, value]) => ({
                key: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
                value: String(value),
            }));
    }

    /**
     * Get primary image URL for product
     */
    static getPrimaryImageUrl(product: Product): string | null {
        return product.image_urls && product.image_urls.length > 0
            ? product.image_urls[0]
            : null;
    }

    /**
     * Filter products by availability
     */
    static filterAvailableProducts(products: Product[]): Product[] {
        return products.filter(product => this.isProductInStock(product));
    }

    /**
     * Filter products by featured status
     */
    static filterFeaturedProducts(products: Product[]): Product[] {
        return products.filter(product => product.is_featured);
    }

    /**
     * Sort products by price
     */
    static sortProductsByPrice(products: Product[], order: 'asc' | 'desc' = 'asc'): Product[] {
        return [...products].sort((a, b) => {
            const priceA = parseFloat(a.sale_price);
            const priceB = parseFloat(b.sale_price);

            return order === 'asc' ? priceA - priceB : priceB - priceA;
        });
    }

    /**
     * Sort products by title
     */
    static sortProductsByTitle(products: Product[], order: 'asc' | 'desc' = 'asc'): Product[] {
        return [...products].sort((a, b) => {
            const comparison = a.title.localeCompare(b.title);
            return order === 'asc' ? comparison : -comparison;
        });
    }

    /**
     * Group products by category
     */
    static groupProductsByCategory(products: Product[]): Record<string, Product[]> {
        return products.reduce((groups, product) => {
            product.categories.forEach(category => {
                if (!groups[category.category_id]) {
                    groups[category.category_id] = [];
                }
                groups[category.category_id].push(product);
            });

            if (product.categories.length === 0) {
                if (!groups['uncategorized']) {
                    groups['uncategorized'] = [];
                }
                groups['uncategorized'].push(product);
            }

            return groups;
        }, {} as Record<string, Product[]>);
    }
}

export default ProductService;