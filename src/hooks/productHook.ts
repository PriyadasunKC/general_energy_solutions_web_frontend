// src/hooks/productHook.ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import {
    fetchProducts,
    fetchProductById,
    searchProducts,
    advancedSearchProducts,
    fetchCategories,
    fetchCategoryById,
    fetchFeaturedProducts,
    fetchAvailableProducts,
    clearProductsError,
    clearProductError,
    clearCategoriesError,
    clearCategoryError,
    clearAllErrors,
    clearCurrentProduct,
    clearCurrentCategory,
    setFilters,
    clearFilters,
    setAdvancedSearchParams,
    clearAdvancedSearchParams,
    setSearchQuery,
    resetProductsPagination,
    resetCategoriesPagination,
    clearProducts,
    clearCategories,
    setInitialized,
    selectProducts,
    selectCurrentProduct,
    selectProductsLoading,
    selectProductLoading,
    selectProductsError,
    selectProductError,
    selectProductsPagination,
    selectCategories,
    selectCurrentCategory,
    selectCategoriesLoading,
    selectCategoryLoading,
    selectCategoriesError,
    selectCategoryError,
    selectCategoriesPagination,
    selectFilters,
    selectAdvancedSearchParams,
    selectIsAdvancedSearch,
    selectIsProductsInitialized,
    selectFeaturedProducts,
    selectAvailableProducts,
    selectEnabledCategories,
} from '../store/slices/productSlice';
import { ProductService } from '../services/productService';
import {
    UseProductsReturn,
    Product,
    Category,
    ProductsQueryParams,
    CategoriesQueryParams,
    AdvancedSearchParams,
    ProductState,
} from '../types/productTypes';

/**
 * Custom hook for product management
 */
export const useProducts = (): UseProductsReturn => {
    const dispatch = useDispatch<AppDispatch>();

    // Selectors
    const products = useSelector((state: RootState) => selectProducts(state));
    const currentProduct = useSelector((state: RootState) => selectCurrentProduct(state));
    const productsLoading = useSelector((state: RootState) => selectProductsLoading(state));
    const productLoading = useSelector((state: RootState) => selectProductLoading(state));
    const productsError = useSelector((state: RootState) => selectProductsError(state));
    const productError = useSelector((state: RootState) => selectProductError(state));
    const productsPagination = useSelector((state: RootState) => selectProductsPagination(state));

    const categories = useSelector((state: RootState) => selectCategories(state));
    const currentCategory = useSelector((state: RootState) => selectCurrentCategory(state));
    const categoriesLoading = useSelector((state: RootState) => selectCategoriesLoading(state));
    const categoryLoading = useSelector((state: RootState) => selectCategoryLoading(state));
    const categoriesError = useSelector((state: RootState) => selectCategoriesError(state));
    const categoryError = useSelector((state: RootState) => selectCategoryError(state));
    const categoriesPagination = useSelector((state: RootState) => selectCategoriesPagination(state));

    const filters = useSelector((state: RootState) => selectFilters(state));
    const advancedSearchParams = useSelector((state: RootState) => selectAdvancedSearchParams(state));
    const isAdvancedSearch = useSelector((state: RootState) => selectIsAdvancedSearch(state));
    const isInitialized = useSelector((state: RootState) => selectIsProductsInitialized(state));

    // Derived selectors
    const featuredProducts = useSelector((state: RootState) => selectFeaturedProducts(state));
    const availableProducts = useSelector((state: RootState) => selectAvailableProducts(state));
    const enabledCategories = useSelector((state: RootState) => selectEnabledCategories(state));

    /**
     * Fetch products with optional parameters
     */
    const fetchProductsData = useCallback(async (params: ProductsQueryParams = {}): Promise<Product[]> => {
        const result = await dispatch(fetchProducts({ ...params, isLoadMore: false })).unwrap();
        return result.products;
    }, [dispatch]);

    /**
     * Fetch more products for pagination
     */
    const fetchMoreProducts = useCallback(async (params: ProductsQueryParams = {}): Promise<Product[]> => {
        const nextPage = productsPagination.page + 1;
        const result = await dispatch(fetchProducts({
            ...params,
            page: nextPage,
            isLoadMore: true
        })).unwrap();
        return result.products;
    }, [dispatch, productsPagination.page]);

    /**
     * Fetch product by ID
     */
    const fetchProductByIdData = useCallback(async (id: string): Promise<Product> => {
        const result = await dispatch(fetchProductById(id)).unwrap();
        return result;
    }, [dispatch]);

    /**
     * Search products (basic search)
     */
    const searchProductsData = useCallback(async (query: string, params: Omit<ProductsQueryParams, 'search'> = {}): Promise<Product[]> => {
        const result = await dispatch(searchProducts({ query, params })).unwrap();
        return result.products;
    }, [dispatch]);

    /**
     * Advanced search products
     */
    const advancedSearchProductsData = useCallback(async (params: AdvancedSearchParams): Promise<Product[]> => {
        // Store the search params in state
        dispatch(setAdvancedSearchParams(params));

        const result = await dispatch(advancedSearchProducts({ ...params, isLoadMore: false })).unwrap();
        return result.products;
    }, [dispatch]);

    /**
     * Fetch more products for advanced search pagination
     */
    const fetchMoreAdvancedSearch = useCallback(async (): Promise<Product[]> => {
        if (!isAdvancedSearch) {
            throw new Error('Not in advanced search mode');
        }

        const nextPage = productsPagination.page + 1;
        const result = await dispatch(advancedSearchProducts({
            ...advancedSearchParams,
            page: nextPage,
            isLoadMore: true
        })).unwrap();
        return result.products;
    }, [dispatch, isAdvancedSearch, advancedSearchParams, productsPagination.page]);

    /**
     * Fetch categories with optional parameters
     */
    const fetchCategoriesData = useCallback(async (params: CategoriesQueryParams = {}): Promise<Category[]> => {
        const result = await dispatch(fetchCategories({ ...params, isLoadMore: false })).unwrap();
        return result.categories;
    }, [dispatch]);

    /**
     * Fetch more categories for pagination
     */
    const fetchMoreCategories = useCallback(async (params: CategoriesQueryParams = {}): Promise<Category[]> => {
        const nextPage = categoriesPagination.page + 1;
        const result = await dispatch(fetchCategories({
            ...params,
            page: nextPage,
            isLoadMore: true
        })).unwrap();
        return result.categories;
    }, [dispatch, categoriesPagination.page]);

    /**
     * Fetch category by ID
     */
    const fetchCategoryByIdData = useCallback(async (id: string): Promise<Category> => {
        const result = await dispatch(fetchCategoryById(id)).unwrap();
        return result;
    }, [dispatch]);

    /**
     * Filter products
     */
    const filterProducts = useCallback((newFilters: Partial<ProductState['filters']>): void => {
        dispatch(setFilters(newFilters));
        dispatch(resetProductsPagination());
        dispatch(clearAdvancedSearchParams());

        const queryParams: ProductsQueryParams = {
            page: 1,
            limit: productsPagination.limit,
        };

        if (newFilters.search !== undefined) {
            queryParams.search = newFilters.search;
        }
        if (newFilters.isAvailable !== undefined) {
            queryParams.isAvailable = newFilters.isAvailable;
        }
        if (newFilters.isFeatured !== undefined) {
            queryParams.isFeatured = newFilters.isFeatured;
        }

        dispatch(fetchProducts({ ...queryParams, isLoadMore: false }));
    }, [dispatch, productsPagination.limit]);

    /**
     * Clear all filters and fetch all products
     */
    const clearAllFilters = useCallback((): void => {
        dispatch(clearFilters());
        dispatch(resetProductsPagination());
        dispatch(fetchProducts({ page: 1, limit: productsPagination.limit, isLoadMore: false }));
    }, [dispatch, productsPagination.limit]);

    /**
     * Clear all errors
     */
    const clearErrors = useCallback((): void => {
        dispatch(clearAllErrors());
    }, [dispatch]);

    /**
     * Clear current product
     */
    const clearCurrentProductData = useCallback((): void => {
        dispatch(clearCurrentProduct());
    }, [dispatch]);

    /**
     * Clear current category
     */
    const clearCurrentCategoryData = useCallback((): void => {
        dispatch(clearCurrentCategory());
    }, [dispatch]);

    /**
     * Get featured products
     */
    const getFeaturedProducts = useCallback((): Product[] => {
        return featuredProducts;
    }, [featuredProducts]);

    /**
     * Get available products
     */
    const getAvailableProducts = useCallback((): Product[] => {
        return availableProducts;
    }, [availableProducts]);

    /**
     * Get products by category
     */
    const getProductsByCategory = useCallback((categoryId: string): Product[] => {
        return products.filter(product =>
            product.categories.some(category => category.category_id === categoryId)
        );
    }, [products]);

    /**
     * Check if product is in stock
     */
    const isProductInStock = useCallback((productId: string): boolean => {
        const product = products.find(p => p.product_id === productId);
        if (!product) return false;
        return ProductService.isProductInStock(product);
    }, [products]);

    /**
     * Get product price information
     */
    const getProductPrice = useCallback((productId: string): { sale: number; original: number } | null => {
        const product = products.find(p => p.product_id === productId);
        if (!product) return null;
        return ProductService.getProductPrice(product);
    }, [products]);

    /**
     * Initialize products data
     */
    const initializeProducts = useCallback(async (): Promise<void> => {
        try {
            if (!isInitialized) {
                await Promise.all([
                    dispatch(fetchProducts({ page: 1, limit: 10 })).unwrap(),
                    dispatch(fetchCategories({ page: 1, limit: 20, isEnabled: true })).unwrap(),
                ]);
                dispatch(setInitialized(true));
            }
        } catch (error) {
            console.error('Failed to initialize products:', error);
        }
    }, [dispatch, isInitialized]);

    /**
     * Refresh products data
     */
    const refreshProducts = useCallback(async (): Promise<void> => {
        dispatch(clearProducts());
        dispatch(resetProductsPagination());
        dispatch(clearAdvancedSearchParams());
        await dispatch(fetchProducts({ page: 1, limit: productsPagination.limit })).unwrap();
    }, [dispatch, productsPagination.limit]);

    /**
     * Refresh categories data
     */
    const refreshCategories = useCallback(async (): Promise<void> => {
        dispatch(clearCategories());
        dispatch(resetCategoriesPagination());
        await dispatch(fetchCategories({ page: 1, limit: categoriesPagination.limit })).unwrap();
    }, [dispatch, categoriesPagination.limit]);

    return {
        // State
        products,
        currentProduct,
        productsLoading,
        productLoading,
        productsError,
        productError,
        productsPagination,

        categories,
        currentCategory,
        categoriesLoading,
        categoryLoading,
        categoriesError,
        categoryError,
        categoriesPagination,

        filters,
        advancedSearchParams,
        isAdvancedSearch,

        // Actions
        fetchProducts: fetchProductsData,
        fetchMoreProducts,
        fetchProductById: fetchProductByIdData,
        fetchCategories: fetchCategoriesData,
        fetchMoreCategories,
        fetchCategoryById: fetchCategoryByIdData,
        searchProducts: searchProductsData,
        advancedSearchProducts: advancedSearchProductsData,
        filterProducts,
        clearFilters: clearAllFilters,
        clearErrors,
        clearCurrentProduct: clearCurrentProductData,
        clearCurrentCategory: clearCurrentCategoryData,

        // Utilities
        isInitialized,
        getFeaturedProducts,
        getAvailableProducts,
        getProductsByCategory,
        isProductInStock,
        getProductPrice,

        // Additional actions
        initializeProducts,
        refreshProducts,
        refreshCategories,
    };
};

/**
 * Hook for products only (lighter version)
 */
export const useProductsOnly = () => {
    const products = useSelector((state: RootState) => selectProducts(state));
    const productsLoading = useSelector((state: RootState) => selectProductsLoading(state));
    const productsError = useSelector((state: RootState) => selectProductsError(state));
    const featuredProducts = useSelector((state: RootState) => selectFeaturedProducts(state));
    const availableProducts = useSelector((state: RootState) => selectAvailableProducts(state));

    return {
        products,
        productsLoading,
        productsError,
        featuredProducts,
        availableProducts,
    };
};

/**
 * Hook for categories only (lighter version)
 */
export const useCategoriesOnly = () => {
    const categories = useSelector((state: RootState) => selectCategories(state));
    const categoriesLoading = useSelector((state: RootState) => selectCategoriesLoading(state));
    const categoriesError = useSelector((state: RootState) => selectCategoriesError(state));
    const enabledCategories = useSelector((state: RootState) => selectEnabledCategories(state));

    return {
        categories,
        categoriesLoading,
        categoriesError,
        enabledCategories,
    };
};

/**
 * Hook for current product
 */
export const useCurrentProduct = () => {
    const dispatch = useDispatch<AppDispatch>();
    const currentProduct = useSelector((state: RootState) => selectCurrentProduct(state));
    const productLoading = useSelector((state: RootState) => selectProductLoading(state));
    const productError = useSelector((state: RootState) => selectProductError(state));

    const fetchProduct = useCallback(async (id: string): Promise<Product> => {
        return await dispatch(fetchProductById(id)).unwrap();
    }, [dispatch]);

    const clearProduct = useCallback((): void => {
        dispatch(clearCurrentProduct());
    }, [dispatch]);

    return {
        currentProduct,
        productLoading,
        productError,
        fetchProduct,
        clearProduct,
    };
};

/**
 * Hook for current category
 */
export const useCurrentCategory = () => {
    const dispatch = useDispatch<AppDispatch>();
    const currentCategory = useSelector((state: RootState) => selectCurrentCategory(state));
    const categoryLoading = useSelector((state: RootState) => selectCategoryLoading(state));
    const categoryError = useSelector((state: RootState) => selectCategoryError(state));

    const fetchCategory = useCallback(async (id: string): Promise<Category> => {
        return await dispatch(fetchCategoryById(id)).unwrap();
    }, [dispatch]);

    const clearCategory = useCallback((): void => {
        dispatch(clearCurrentCategory());
    }, [dispatch]);

    return {
        currentCategory,
        categoryLoading,
        categoryError,
        fetchCategory,
        clearCategory,
    };
};

export default useProducts;