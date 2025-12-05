// src/store/slices/productSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProductService } from '../../services/productService';
import {
    ProductState,
    Product,
    Category,
    ProductsQueryParams,
    CategoriesQueryParams,
    AdvancedSearchParams,
    DEFAULT_PAGINATION,
} from '../../types/productTypes';
import { APIError } from '../../types/authTypes';

// Initial state
const initialState: ProductState = {
    products: [],
    currentProduct: null,
    productsLoading: false,
    productLoading: false,
    productsError: null,
    productError: null,
    productsPagination: { ...DEFAULT_PAGINATION },

    categories: [],
    currentCategory: null,
    categoriesLoading: false,
    categoryLoading: false,
    categoriesError: null,
    categoryError: null,
    categoriesPagination: { ...DEFAULT_PAGINATION },

    filters: {
        search: '',
        isAvailable: undefined,
        isFeatured: undefined,
        categoryId: undefined,
    },

    advancedSearchParams: {},
    isAdvancedSearch: false,

    isInitialized: false,
};

// Async thunks

export const fetchProducts = createAsyncThunk<
    { products: Product[]; page: number; limit: number; total?: number; isLoadMore: boolean },
    ProductsQueryParams & { isLoadMore?: boolean },
    { rejectValue: APIError }
>(
    'products/fetchProducts',
    async (params = {}, { rejectWithValue }) => {
        try {
            const { isLoadMore = false, ...queryParams } = params;
            const response = await ProductService.fetchProducts(queryParams);

            return {
                products: response.data,
                page: response.pagination.page,
                limit: response.pagination.limit,
                total: response.pagination.total,
                isLoadMore,
            };
        } catch (error) {
            return rejectWithValue(error as APIError);
        }
    }
);

export const advancedSearchProducts = createAsyncThunk<
    { products: Product[]; page: number; limit: number; total?: number; isLoadMore: boolean },
    AdvancedSearchParams & { isLoadMore?: boolean },
    { rejectValue: APIError }
>(
    'products/advancedSearchProducts',
    async (params = {}, { rejectWithValue }) => {
        try {
            const { isLoadMore = false, ...searchParams } = params;
            const response = await ProductService.advancedSearchProducts(searchParams);

            return {
                products: response.data,
                page: response.pagination.page,
                limit: response.pagination.limit,
                total: response.pagination.total,
                isLoadMore,
            };
        } catch (error) {
            return rejectWithValue(error as APIError);
        }
    }
);

export const fetchProductById = createAsyncThunk<
    Product,
    string,
    { rejectValue: APIError }
>(
    'products/fetchProductById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await ProductService.fetchProductById(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error as APIError);
        }
    }
);

export const searchProducts = createAsyncThunk<
    { products: Product[]; page: number; limit: number; total?: number },
    { query: string; params?: Omit<ProductsQueryParams, 'search'> },
    { rejectValue: APIError }
>(
    'products/searchProducts',
    async ({ query, params = {} }, { rejectWithValue }) => {
        try {
            const response = await ProductService.searchProducts(query, params);

            return {
                products: response.data,
                page: response.pagination.page,
                limit: response.pagination.limit,
                total: response.pagination.total,
            };
        } catch (error) {
            return rejectWithValue(error as APIError);
        }
    }
);

export const fetchCategories = createAsyncThunk<
    { categories: Category[]; page: number; limit: number; total?: number; isLoadMore: boolean },
    CategoriesQueryParams & { isLoadMore?: boolean },
    { rejectValue: APIError }
>(
    'products/fetchCategories',
    async (params = {}, { rejectWithValue }) => {
        try {
            const { isLoadMore = false, ...queryParams } = params;
            const response = await ProductService.fetchCategories(queryParams);

            return {
                categories: response.data,
                page: response.pagination.page,
                limit: response.pagination.limit,
                total: response.pagination.total,
                isLoadMore,
            };
        } catch (error) {
            return rejectWithValue(error as APIError);
        }
    }
);

export const fetchCategoryById = createAsyncThunk<
    Category,
    string,
    { rejectValue: APIError }
>(
    'products/fetchCategoryById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await ProductService.fetchCategoryById(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error as APIError);
        }
    }
);

export const fetchFeaturedProducts = createAsyncThunk<
    { products: Product[]; page: number; limit: number; total?: number },
    Omit<ProductsQueryParams, 'isFeatured'>,
    { rejectValue: APIError }
>(
    'products/fetchFeaturedProducts',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await ProductService.fetchFeaturedProducts(params);

            return {
                products: response.data,
                page: response.pagination.page,
                limit: response.pagination.limit,
                total: response.pagination.total,
            };
        } catch (error) {
            return rejectWithValue(error as APIError);
        }
    }
);

export const fetchAvailableProducts = createAsyncThunk<
    { products: Product[]; page: number; limit: number; total?: number },
    Omit<ProductsQueryParams, 'isAvailable'>,
    { rejectValue: APIError }
>(
    'products/fetchAvailableProducts',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await ProductService.fetchAvailableProducts(params);

            return {
                products: response.data,
                page: response.pagination.page,
                limit: response.pagination.limit,
                total: response.pagination.total,
            };
        } catch (error) {
            return rejectWithValue(error as APIError);
        }
    }
);

// Product slice
const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearProductsError: (state) => {
            state.productsError = null;
        },
        clearProductError: (state) => {
            state.productError = null;
        },
        clearCategoriesError: (state) => {
            state.categoriesError = null;
        },
        clearCategoryError: (state) => {
            state.categoryError = null;
        },
        clearAllErrors: (state) => {
            state.productsError = null;
            state.productError = null;
            state.categoriesError = null;
            state.categoryError = null;
        },
        clearCurrentProduct: (state) => {
            state.currentProduct = null;
            state.productError = null;
        },
        clearCurrentCategory: (state) => {
            state.currentCategory = null;
            state.categoryError = null;
        },
        setFilters: (state, action: PayloadAction<Partial<ProductState['filters']>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                search: '',
                isAvailable: undefined,
                isFeatured: undefined,
                categoryId: undefined,
            };
            state.advancedSearchParams = {};
            state.isAdvancedSearch = false;
        },
        setAdvancedSearchParams: (state, action: PayloadAction<AdvancedSearchParams>) => {
            state.advancedSearchParams = action.payload;
            state.isAdvancedSearch = true;
        },
        clearAdvancedSearchParams: (state) => {
            state.advancedSearchParams = {};
            state.isAdvancedSearch = false;
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.filters.search = action.payload;
        },
        setProductsLoading: (state, action: PayloadAction<boolean>) => {
            state.productsLoading = action.payload;
        },
        setProductLoading: (state, action: PayloadAction<boolean>) => {
            state.productLoading = action.payload;
        },
        setCategoriesLoading: (state, action: PayloadAction<boolean>) => {
            state.categoriesLoading = action.payload;
        },
        setCategoryLoading: (state, action: PayloadAction<boolean>) => {
            state.categoryLoading = action.payload;
        },
        resetProductsPagination: (state) => {
            state.productsPagination = { ...DEFAULT_PAGINATION };
        },
        resetCategoriesPagination: (state) => {
            state.categoriesPagination = { ...DEFAULT_PAGINATION };
        },
        clearProducts: (state) => {
            state.products = [];
            state.productsPagination = { ...DEFAULT_PAGINATION };
            state.productsError = null;
        },
        clearCategories: (state) => {
            state.categories = [];
            state.categoriesPagination = { ...DEFAULT_PAGINATION };
            state.categoriesError = null;
        },
        setInitialized: (state, action: PayloadAction<boolean>) => {
            state.isInitialized = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Fetch Products
        builder
            .addCase(fetchProducts.pending, (state, action) => {
                const isLoadMore = action.meta.arg.isLoadMore;
                state.productsLoading = true;
                if (!isLoadMore) {
                    state.productsError = null;
                }
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                const { products, page, limit, total, isLoadMore } = action.payload;
                state.productsLoading = false;

                if (isLoadMore) {
                    state.products = [...state.products, ...products];
                } else {
                    state.products = products;
                }

                state.productsPagination = {
                    page,
                    limit,
                    hasMore: products.length === limit,
                    total,
                };
                state.productsError = null;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.productsLoading = false;
                state.productsError = action.payload?.message || 'Failed to fetch products';
            });

        // Advanced Search Products
        builder
            .addCase(advancedSearchProducts.pending, (state, action) => {
                const isLoadMore = action.meta.arg.isLoadMore;
                state.productsLoading = true;
                if (!isLoadMore) {
                    state.productsError = null;
                }
            })
            .addCase(advancedSearchProducts.fulfilled, (state, action) => {
                const { products, page, limit, total, isLoadMore } = action.payload;
                state.productsLoading = false;

                if (isLoadMore) {
                    state.products = [...state.products, ...products];
                } else {
                    state.products = products;
                }

                state.productsPagination = {
                    page,
                    limit,
                    hasMore: products.length === limit,
                    total,
                };
                state.productsError = null;
            })
            .addCase(advancedSearchProducts.rejected, (state, action) => {
                state.productsLoading = false;
                state.productsError = action.payload?.message || 'Failed to search products';
            });

        // Fetch Product by ID
        builder
            .addCase(fetchProductById.pending, (state) => {
                state.productLoading = true;
                state.productError = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.productLoading = false;
                state.currentProduct = action.payload;
                state.productError = null;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.productLoading = false;
                state.currentProduct = null;
                state.productError = action.payload?.message || 'Failed to fetch product';
            });

        // Search Products
        builder
            .addCase(searchProducts.pending, (state) => {
                state.productsLoading = true;
                state.productsError = null;
            })
            .addCase(searchProducts.fulfilled, (state, action) => {
                const { products, page, limit, total } = action.payload;
                state.productsLoading = false;
                state.products = products;
                state.productsPagination = {
                    page,
                    limit,
                    hasMore: products.length === limit,
                    total,
                };
                state.productsError = null;
            })
            .addCase(searchProducts.rejected, (state, action) => {
                state.productsLoading = false;
                state.productsError = action.payload?.message || 'Failed to search products';
            });

        // Fetch Categories
        builder
            .addCase(fetchCategories.pending, (state, action) => {
                const isLoadMore = action.meta.arg.isLoadMore;
                state.categoriesLoading = true;
                if (!isLoadMore) {
                    state.categoriesError = null;
                }
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                const { categories, page, limit, total, isLoadMore } = action.payload;
                state.categoriesLoading = false;

                if (isLoadMore) {
                    state.categories = [...state.categories, ...categories];
                } else {
                    state.categories = categories;
                }

                state.categoriesPagination = {
                    page,
                    limit,
                    hasMore: categories.length === limit,
                    total,
                };
                state.categoriesError = null;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.categoriesLoading = false;
                state.categoriesError = action.payload?.message || 'Failed to fetch categories';
            });

        // Fetch Category by ID
        builder
            .addCase(fetchCategoryById.pending, (state) => {
                state.categoryLoading = true;
                state.categoryError = null;
            })
            .addCase(fetchCategoryById.fulfilled, (state, action) => {
                state.categoryLoading = false;
                state.currentCategory = action.payload;
                state.categoryError = null;
            })
            .addCase(fetchCategoryById.rejected, (state, action) => {
                state.categoryLoading = false;
                state.currentCategory = null;
                state.categoryError = action.payload?.message || 'Failed to fetch category';
            });

        // Fetch Featured Products
        builder
            .addCase(fetchFeaturedProducts.pending, (state) => {
                state.productsLoading = true;
                state.productsError = null;
            })
            .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
                const { products, page, limit, total } = action.payload;
                state.productsLoading = false;
                state.products = products;
                state.productsPagination = {
                    page,
                    limit,
                    hasMore: products.length === limit,
                    total,
                };
                state.productsError = null;
            })
            .addCase(fetchFeaturedProducts.rejected, (state, action) => {
                state.productsLoading = false;
                state.productsError = action.payload?.message || 'Failed to fetch featured products';
            });

        // Fetch Available Products
        builder
            .addCase(fetchAvailableProducts.pending, (state) => {
                state.productsLoading = true;
                state.productsError = null;
            })
            .addCase(fetchAvailableProducts.fulfilled, (state, action) => {
                const { products, page, limit, total } = action.payload;
                state.productsLoading = false;
                state.products = products;
                state.productsPagination = {
                    page,
                    limit,
                    hasMore: products.length === limit,
                    total,
                };
                state.productsError = null;
            })
            .addCase(fetchAvailableProducts.rejected, (state, action) => {
                state.productsLoading = false;
                state.productsError = action.payload?.message || 'Failed to fetch available products';
            });
    },
});

// Export actions
export const {
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
    setProductsLoading,
    setProductLoading,
    setCategoriesLoading,
    setCategoryLoading,
    resetProductsPagination,
    resetCategoriesPagination,
    clearProducts,
    clearCategories,
    setInitialized,
} = productSlice.actions;

// Export selectors
export const selectProductState = (state: { products: ProductState }) => state.products;
export const selectProducts = (state: { products: ProductState }) => state.products.products;
export const selectCurrentProduct = (state: { products: ProductState }) => state.products.currentProduct;
export const selectProductsLoading = (state: { products: ProductState }) => state.products.productsLoading;
export const selectProductLoading = (state: { products: ProductState }) => state.products.productLoading;
export const selectProductsError = (state: { products: ProductState }) => state.products.productsError;
export const selectProductError = (state: { products: ProductState }) => state.products.productError;
export const selectProductsPagination = (state: { products: ProductState }) => state.products.productsPagination;

export const selectCategories = (state: { products: ProductState }) => state.products.categories;
export const selectCurrentCategory = (state: { products: ProductState }) => state.products.currentCategory;
export const selectCategoriesLoading = (state: { products: ProductState }) => state.products.categoriesLoading;
export const selectCategoryLoading = (state: { products: ProductState }) => state.products.categoryLoading;
export const selectCategoriesError = (state: { products: ProductState }) => state.products.categoriesError;
export const selectCategoryError = (state: { products: ProductState }) => state.products.categoryError;
export const selectCategoriesPagination = (state: { products: ProductState }) => state.products.categoriesPagination;

export const selectFilters = (state: { products: ProductState }) => state.products.filters;
export const selectAdvancedSearchParams = (state: { products: ProductState }) => state.products.advancedSearchParams;
export const selectIsAdvancedSearch = (state: { products: ProductState }) => state.products.isAdvancedSearch;
export const selectIsProductsInitialized = (state: { products: ProductState }) => state.products.isInitialized;

// Derived selectors
export const selectFeaturedProducts = (state: { products: ProductState }) =>
    state.products.products.filter(product => product.is_featured);

export const selectAvailableProducts = (state: { products: ProductState }) =>
    ProductService.filterAvailableProducts(state.products.products);

export const selectProductsByCategory = (categoryId: string) => (state: { products: ProductState }) =>
    state.products.products.filter(product =>
        product.categories.some(category => category.category_id === categoryId)
    );

export const selectEnabledCategories = (state: { products: ProductState }) =>
    state.products.categories.filter(category => category.is_enable);

export default productSlice.reducer;