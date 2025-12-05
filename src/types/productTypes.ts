// src/types/productTypes.ts

// Category interfaces
export interface Category {
    category_id: string;
    category_name: string;
    category_description: string;
    image_url: string;
    is_enable: boolean;
    created_at?: string;
    modified_at?: string;
    modified_by?: string;
}

// Product interfaces
export interface ProductSpecifications {
    voltage?: string;
    wattage?: string;
    efficiency?: string;
    [key: string]: string | undefined;
}

export interface Product {
    product_id: string;
    product_code: string;
    title: string;
    subtitle: string;
    description: string;
    specifications: ProductSpecifications;
    image_urls: string[];
    quantity_available: number;
    sale_price: string;
    original_price: string;
    is_featured: boolean;
    is_available: boolean;
    is_deleted: boolean;
    sold_quantity: number;
    modified_at: string;
    modified_by: string;
    categories: Category[];
}

// API Response interfaces
export interface ProductsResponse {
    success: boolean;
    data: Product[];
    pagination: {
        page: number;
        limit: number;
        total?: number;
    };
}

export interface ProductResponse {
    success: boolean;
    data: Product;
}

export interface CategoriesResponse {
    success: boolean;
    data: Category[];
    pagination: {
        page: number;
        limit: number;
        total?: number;
    };
}

export interface CategoryResponse {
    success: boolean;
    data: Category;
}

// Query parameters interfaces
export interface ProductsQueryParams {
    page?: number;
    limit?: number;
    isAvailable?: boolean;
    isFeatured?: boolean;
    search?: string;
    categoryId?: string;
}

export interface CategoriesQueryParams {
    page?: number;
    limit?: number;
    isEnabled?: boolean;
}

// Advanced search parameters
export interface AdvancedSearchParams {
    category?: string;  // Category name search
    name?: string;      // Product name/title search
    model?: string;     // Product code/model search
    page?: number;
    limit?: number;
}

// State interfaces
export interface ProductState {
    // Products
    products: Product[];
    currentProduct: Product | null;
    productsLoading: boolean;
    productLoading: boolean;
    productsError: string | null;
    productError: string | null;
    productsPagination: {
        page: number;
        limit: number;
        hasMore: boolean;
        total?: number;
    };

    // Categories
    categories: Category[];
    currentCategory: Category | null;
    categoriesLoading: boolean;
    categoryLoading: boolean;
    categoriesError: string | null;
    categoryError: string | null;
    categoriesPagination: {
        page: number;
        limit: number;
        hasMore: boolean;
        total?: number;
    };

    // Filters and search
    filters: {
        search: string;
        isAvailable: boolean | undefined;
        isFeatured: boolean | undefined;
        categoryId: string | undefined;
    };

    // Advanced search
    advancedSearchParams: AdvancedSearchParams;
    isAdvancedSearch: boolean;

    // UI state
    isInitialized: boolean;
}

// Hook return types
export interface UseProductsReturn {
    // Products state
    products: Product[];
    currentProduct: Product | null;
    productsLoading: boolean;
    productLoading: boolean;
    productsError: string | null;
    productError: string | null;
    productsPagination: {
        page: number;
        limit: number;
        hasMore: boolean;
        total?: number;
    };

    // Categories state
    categories: Category[];
    currentCategory: Category | null;
    categoriesLoading: boolean;
    categoryLoading: boolean;
    categoriesError: string | null;
    categoryError: string | null;
    categoriesPagination: {
        page: number;
        limit: number;
        hasMore: boolean;
        total?: number;
    };

    // Filters
    filters: ProductState['filters'];
    advancedSearchParams: AdvancedSearchParams;
    isAdvancedSearch: boolean;

    // Actions
    fetchProducts: (params?: ProductsQueryParams) => Promise<Product[]>;
    fetchMoreProducts: (params?: ProductsQueryParams) => Promise<Product[]>;
    fetchProductById: (id: string) => Promise<Product>;
    fetchCategories: (params?: CategoriesQueryParams) => Promise<Category[]>;
    fetchMoreCategories: (params?: CategoriesQueryParams) => Promise<Category[]>;
    fetchCategoryById: (id: string) => Promise<Category>;
    searchProducts: (query: string, params?: Omit<ProductsQueryParams, 'search'>) => Promise<Product[]>;
    advancedSearchProducts: (params: AdvancedSearchParams) => Promise<Product[]>;
    filterProducts: (filters: Partial<ProductState['filters']>) => void;
    clearFilters: () => void;
    clearErrors: () => void;
    clearCurrentProduct: () => void;
    clearCurrentCategory: () => void;

    // Utilities
    isInitialized: boolean;
    getFeaturedProducts: () => Product[];
    getAvailableProducts: () => Product[];
    getProductsByCategory: (categoryId: string) => Product[];
    isProductInStock: (productId: string) => boolean;
    getProductPrice: (productId: string) => { sale: number; original: number } | null;

    // Additional utilities
    initializeProducts: () => Promise<void>;
    refreshProducts: () => Promise<void>;
    refreshCategories: () => Promise<void>;
}

// API endpoints
export const PRODUCT_ENDPOINTS = {
    PRODUCTS: '/api/products',
    PRODUCT_BY_ID: (id: string) => `/api/products/${id}`,
    CATEGORIES: '/api/categories',
    CATEGORY_BY_ID: (id: string) => `/api/categories/${id}`,
    ADVANCED_SEARCH: '/api/products/search',
} as const;

// Default pagination
export const DEFAULT_PAGINATION = {
    page: 1,
    limit: 10,
    hasMore: true,
} as const;