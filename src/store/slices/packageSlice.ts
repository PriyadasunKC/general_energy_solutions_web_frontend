// src/store/slices/packageSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PackageService } from '../../services/packageService';
import {
    PackageState,
    Package,
    PackageItem,
    PackagesQueryParams,
    DEFAULT_PACKAGE_PAGINATION,
} from '../../types/packageTypes';
import { APIError } from '../../types/authTypes';

// Initial state
const initialState: PackageState = {
    // Packages
    packages: [],
    currentPackage: null,
    packagesLoading: false,
    packageLoading: false,
    packagesError: null,
    packageError: null,
    packagesPagination: { ...DEFAULT_PACKAGE_PAGINATION },

    // Package items
    packageItems: [],
    packageItemsLoading: false,
    packageItemsError: null,

    // Filters and search
    filters: {
        search: '',
        isAvailable: undefined,
        isFeatured: undefined,
    },

    // UI state
    isInitialized: false,
};

// Async thunks for package actions

/**
 * Fetch packages with pagination
 */
export const fetchPackages = createAsyncThunk<
    { packages: Package[]; page: number; limit: number; isLoadMore: boolean },
    PackagesQueryParams & { isLoadMore?: boolean },
    { rejectValue: APIError }
>(
    'packages/fetchPackages',
    async (params = {}, { rejectWithValue }) => {
        try {
            const { isLoadMore = false, ...queryParams } = params;
            const response = await PackageService.fetchPackages(queryParams);

            return {
                packages: response.data,
                page: response.pagination.page,
                limit: response.pagination.limit,
                isLoadMore,
            };
        } catch (error) {
            return rejectWithValue(error as APIError);
        }
    }
);

/**
 * Fetch package by ID
 */
export const fetchPackageById = createAsyncThunk<
    Package,
    string,
    { rejectValue: APIError }
>(
    'packages/fetchPackageById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await PackageService.fetchPackageById(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error as APIError);
        }
    }
);

/**
 * Fetch package items by package ID
 */
export const fetchPackageItems = createAsyncThunk<
    PackageItem[],
    string,
    { rejectValue: APIError }
>(
    'packages/fetchPackageItems',
    async (packageId, { rejectWithValue }) => {
        try {
            const response = await PackageService.fetchPackageItems(packageId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error as APIError);
        }
    }
);

/**
 * Search packages
 */
export const searchPackages = createAsyncThunk<
    { packages: Package[]; page: number; limit: number },
    { query: string; params?: Omit<PackagesQueryParams, 'search'> },
    { rejectValue: APIError }
>(
    'packages/searchPackages',
    async ({ query, params = {} }, { rejectWithValue }) => {
        try {
            const response = await PackageService.searchPackages(query, params);

            return {
                packages: response.data,
                page: response.pagination.page,
                limit: response.pagination.limit,
            };
        } catch (error) {
            return rejectWithValue(error as APIError);
        }
    }
);

/**
 * Fetch featured packages
 */
export const fetchFeaturedPackages = createAsyncThunk<
    { packages: Package[]; page: number; limit: number },
    Omit<PackagesQueryParams, 'isFeatured'>,
    { rejectValue: APIError }
>(
    'packages/fetchFeaturedPackages',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await PackageService.fetchFeaturedPackages(params);

            return {
                packages: response.data,
                page: response.pagination.page,
                limit: response.pagination.limit,
            };
        } catch (error) {
            return rejectWithValue(error as APIError);
        }
    }
);

/**
 * Fetch available packages
 */
export const fetchAvailablePackages = createAsyncThunk<
    { packages: Package[]; page: number; limit: number },
    Omit<PackagesQueryParams, 'isAvailable'>,
    { rejectValue: APIError }
>(
    'packages/fetchAvailablePackages',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await PackageService.fetchAvailablePackages(params);

            return {
                packages: response.data,
                page: response.pagination.page,
                limit: response.pagination.limit,
            };
        } catch (error) {
            return rejectWithValue(error as APIError);
        }
    }
);

// Package slice
const packageSlice = createSlice({
    name: 'packages',
    initialState,
    reducers: {
        // Clear errors
        clearPackagesError: (state) => {
            state.packagesError = null;
        },

        clearPackageError: (state) => {
            state.packageError = null;
        },

        clearPackageItemsError: (state) => {
            state.packageItemsError = null;
        },

        clearAllErrors: (state) => {
            state.packagesError = null;
            state.packageError = null;
            state.packageItemsError = null;
        },

        // Clear current selections
        clearCurrentPackage: (state) => {
            state.currentPackage = null;
            state.packageError = null;
        },

        clearPackageItems: (state) => {
            state.packageItems = [];
            state.packageItemsError = null;
        },

        // Filter management
        setFilters: (state, action: PayloadAction<Partial<PackageState['filters']>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },

        clearFilters: (state) => {
            state.filters = {
                search: '',
                isAvailable: undefined,
                isFeatured: undefined,
            };
        },

        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.filters.search = action.payload;
        },

        // Loading states
        setPackagesLoading: (state, action: PayloadAction<boolean>) => {
            state.packagesLoading = action.payload;
        },

        setPackageLoading: (state, action: PayloadAction<boolean>) => {
            state.packageLoading = action.payload;
        },

        setPackageItemsLoading: (state, action: PayloadAction<boolean>) => {
            state.packageItemsLoading = action.payload;
        },

        // Reset pagination
        resetPackagesPagination: (state) => {
            state.packagesPagination = { ...DEFAULT_PACKAGE_PAGINATION };
        },

        // Clear packages
        clearPackages: (state) => {
            state.packages = [];
            state.packagesPagination = { ...DEFAULT_PACKAGE_PAGINATION };
            state.packagesError = null;
        },

        // Mark as initialized
        setInitialized: (state, action: PayloadAction<boolean>) => {
            state.isInitialized = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Fetch Packages
        builder
            .addCase(fetchPackages.pending, (state, action) => {
                const isLoadMore = action.meta.arg.isLoadMore;
                state.packagesLoading = true;
                if (!isLoadMore) {
                    state.packagesError = null;
                }
            })
            .addCase(fetchPackages.fulfilled, (state, action) => {
                const { packages, page, limit, isLoadMore } = action.payload;
                state.packagesLoading = false;

                if (isLoadMore) {
                    state.packages = [...state.packages, ...packages];
                } else {
                    state.packages = packages;
                }

                state.packagesPagination = {
                    page,
                    limit,
                    hasMore: packages.length === limit,
                };
                state.packagesError = null;
            })
            .addCase(fetchPackages.rejected, (state, action) => {
                state.packagesLoading = false;
                state.packagesError = action.payload?.message || 'Failed to fetch packages';
            });

        // Fetch Package by ID
        builder
            .addCase(fetchPackageById.pending, (state) => {
                state.packageLoading = true;
                state.packageError = null;
            })
            .addCase(fetchPackageById.fulfilled, (state, action) => {
                state.packageLoading = false;
                state.currentPackage = action.payload;
                state.packageError = null;
            })
            .addCase(fetchPackageById.rejected, (state, action) => {
                state.packageLoading = false;
                state.currentPackage = null;
                state.packageError = action.payload?.message || 'Failed to fetch package';
            });

        // Fetch Package Items
        builder
            .addCase(fetchPackageItems.pending, (state) => {
                state.packageItemsLoading = true;
                state.packageItemsError = null;
            })
            .addCase(fetchPackageItems.fulfilled, (state, action) => {
                state.packageItemsLoading = false;
                state.packageItems = action.payload;
                state.packageItemsError = null;
            })
            .addCase(fetchPackageItems.rejected, (state, action) => {
                state.packageItemsLoading = false;
                state.packageItems = [];
                state.packageItemsError = action.payload?.message || 'Failed to fetch package items';
            });

        // Search Packages
        builder
            .addCase(searchPackages.pending, (state) => {
                state.packagesLoading = true;
                state.packagesError = null;
            })
            .addCase(searchPackages.fulfilled, (state, action) => {
                const { packages, page, limit } = action.payload;
                state.packagesLoading = false;
                state.packages = packages;
                state.packagesPagination = {
                    page,
                    limit,
                    hasMore: packages.length === limit,
                };
                state.packagesError = null;
            })
            .addCase(searchPackages.rejected, (state, action) => {
                state.packagesLoading = false;
                state.packagesError = action.payload?.message || 'Failed to search packages';
            });

        // Fetch Featured Packages
        builder
            .addCase(fetchFeaturedPackages.pending, (state) => {
                state.packagesLoading = true;
                state.packagesError = null;
            })
            .addCase(fetchFeaturedPackages.fulfilled, (state, action) => {
                const { packages, page, limit } = action.payload;
                state.packagesLoading = false;
                state.packages = packages;
                state.packagesPagination = {
                    page,
                    limit,
                    hasMore: packages.length === limit,
                };
                state.packagesError = null;
            })
            .addCase(fetchFeaturedPackages.rejected, (state, action) => {
                state.packagesLoading = false;
                state.packagesError = action.payload?.message || 'Failed to fetch featured packages';
            });

        // Fetch Available Packages
        builder
            .addCase(fetchAvailablePackages.pending, (state) => {
                state.packagesLoading = true;
                state.packagesError = null;
            })
            .addCase(fetchAvailablePackages.fulfilled, (state, action) => {
                const { packages, page, limit } = action.payload;
                state.packagesLoading = false;
                state.packages = packages;
                state.packagesPagination = {
                    page,
                    limit,
                    hasMore: packages.length === limit,
                };
                state.packagesError = null;
            })
            .addCase(fetchAvailablePackages.rejected, (state, action) => {
                state.packagesLoading = false;
                state.packagesError = action.payload?.message || 'Failed to fetch available packages';
            });
    },
});

// Export actions
export const {
    clearPackagesError,
    clearPackageError,
    clearPackageItemsError,
    clearAllErrors,
    clearCurrentPackage,
    clearPackageItems,
    setFilters,
    clearFilters,
    setSearchQuery,
    setPackagesLoading,
    setPackageLoading,
    setPackageItemsLoading,
    resetPackagesPagination,
    clearPackages,
    setInitialized,
} = packageSlice.actions;

// Export selectors
export const selectPackageState = (state: { packages: PackageState }) => state.packages;
export const selectPackages = (state: { packages: PackageState }) => state.packages.packages;
export const selectCurrentPackage = (state: { packages: PackageState }) => state.packages.currentPackage;
export const selectPackagesLoading = (state: { packages: PackageState }) => state.packages.packagesLoading;
export const selectPackageLoading = (state: { packages: PackageState }) => state.packages.packageLoading;
export const selectPackagesError = (state: { packages: PackageState }) => state.packages.packagesError;
export const selectPackageError = (state: { packages: PackageState }) => state.packages.packageError;
export const selectPackagesPagination = (state: { packages: PackageState }) => state.packages.packagesPagination;

export const selectPackageItems = (state: { packages: PackageState }) => state.packages.packageItems;
export const selectPackageItemsLoading = (state: { packages: PackageState }) => state.packages.packageItemsLoading;
export const selectPackageItemsError = (state: { packages: PackageState }) => state.packages.packageItemsError;

export const selectPackageFilters = (state: { packages: PackageState }) => state.packages.filters;
export const selectIsPackagesInitialized = (state: { packages: PackageState }) => state.packages.isInitialized;

// Derived selectors
export const selectFeaturedPackages = (state: { packages: PackageState }) =>
    state.packages.packages.filter(pkg => pkg.is_featured);

export const selectAvailablePackages = (state: { packages: PackageState }) =>
    PackageService.filterAvailablePackages(state.packages.packages);

export const selectPackagesByPowerOutput = (minWatts: number) => (state: { packages: PackageState }) =>
    state.packages.packages.filter(pkg =>
        PackageService.isPackageSuitableForPower(pkg, minWatts)
    );

// Export reducer
export default packageSlice.reducer;