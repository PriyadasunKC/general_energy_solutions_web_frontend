// src/hooks/packageHook.ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import {
    fetchPackages,
    fetchPackageById,
    fetchPackageItems,
    searchPackages,
    fetchFeaturedPackages,
    fetchAvailablePackages,
    clearPackagesError,
    clearPackageError,
    clearPackageItemsError,
    clearAllErrors,
    clearCurrentPackage,
    clearPackageItems,
    setFilters,
    clearFilters,
    setSearchQuery,
    resetPackagesPagination,
    clearPackages,
    setInitialized,
    selectPackages,
    selectCurrentPackage,
    selectPackagesLoading,
    selectPackageLoading,
    selectPackagesError,
    selectPackageError,
    selectPackagesPagination,
    selectPackageItems,
    selectPackageItemsLoading,
    selectPackageItemsError,
    selectPackageFilters,
    selectIsPackagesInitialized,
    selectFeaturedPackages,
    selectAvailablePackages,
    selectPackagesByPowerOutput,
} from '../store/slices/packageSlice';
import { PackageService } from '../services/packageService';
import {
    UsePackagesReturn,
    Package,
    PackageItem,
    PackagesQueryParams,
    PackageState,
} from '../types/packageTypes';

/**
 * Custom hook for package management
 * Provides all package-related functionality with Redux integration
 */
export const usePackages = (): UsePackagesReturn => {
    const dispatch = useDispatch<AppDispatch>();

    // Selectors
    const packages = useSelector((state: RootState) => selectPackages(state));
    const currentPackage = useSelector((state: RootState) => selectCurrentPackage(state));
    const packagesLoading = useSelector((state: RootState) => selectPackagesLoading(state));
    const packageLoading = useSelector((state: RootState) => selectPackageLoading(state));
    const packagesError = useSelector((state: RootState) => selectPackagesError(state));
    const packageError = useSelector((state: RootState) => selectPackageError(state));
    const packagesPagination = useSelector((state: RootState) => selectPackagesPagination(state));

    const packageItems = useSelector((state: RootState) => selectPackageItems(state));
    const packageItemsLoading = useSelector((state: RootState) => selectPackageItemsLoading(state));
    const packageItemsError = useSelector((state: RootState) => selectPackageItemsError(state));

    const filters = useSelector((state: RootState) => selectPackageFilters(state));
    const isInitialized = useSelector((state: RootState) => selectIsPackagesInitialized(state));

    // Derived selectors
    const featuredPackages = useSelector((state: RootState) => selectFeaturedPackages(state));
    const availablePackages = useSelector((state: RootState) => selectAvailablePackages(state));

    /**
     * Fetch packages with optional parameters
     */
    const fetchPackagesData = useCallback(async (params: PackagesQueryParams = {}): Promise<Package[]> => {
        const result = await dispatch(fetchPackages({ ...params, isLoadMore: false })).unwrap();
        return result.packages;
    }, [dispatch]);

    /**
     * Fetch more packages for pagination
     */
    const fetchMorePackages = useCallback(async (params: PackagesQueryParams = {}): Promise<Package[]> => {
        const nextPage = packagesPagination.page + 1;
        const result = await dispatch(fetchPackages({
            ...params,
            page: nextPage,
            isLoadMore: true
        })).unwrap();
        return result.packages;
    }, [dispatch, packagesPagination.page]);

    /**
     * Fetch package by ID
     */
    const fetchPackageByIdData = useCallback(async (id: string): Promise<Package> => {
        const result = await dispatch(fetchPackageById(id)).unwrap();
        return result;
    }, [dispatch]);

    /**
     * Fetch package items by package ID
     */
    const fetchPackageItemsData = useCallback(async (packageId: string): Promise<PackageItem[]> => {
        const result = await dispatch(fetchPackageItems(packageId)).unwrap();
        return result;
    }, [dispatch]);

    /**
     * Search packages
     */
    const searchPackagesData = useCallback(async (query: string, params: Omit<PackagesQueryParams, 'search'> = {}): Promise<Package[]> => {
        const result = await dispatch(searchPackages({ query, params })).unwrap();
        return result.packages;
    }, [dispatch]);

    /**
     * Filter packages
     */
    const filterPackages = useCallback((newFilters: Partial<PackageState['filters']>): void => {
        dispatch(setFilters(newFilters));

        // Reset pagination when filters change
        dispatch(resetPackagesPagination());

        // Fetch packages with new filters
        const queryParams: PackagesQueryParams = {
            page: 1,
            limit: packagesPagination.limit,
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

        dispatch(fetchPackages({ ...queryParams, isLoadMore: false }));
    }, [dispatch, packagesPagination.limit]);

    /**
     * Clear all filters and fetch all packages
     */
    const clearAllFilters = useCallback((): void => {
        dispatch(clearFilters());
        dispatch(resetPackagesPagination());
        dispatch(fetchPackages({ page: 1, limit: packagesPagination.limit, isLoadMore: false }));
    }, [dispatch, packagesPagination.limit]);

    /**
     * Clear all errors
     */
    const clearErrors = useCallback((): void => {
        dispatch(clearAllErrors());
    }, [dispatch]);

    /**
     * Clear current package
     */
    const clearCurrentPackageData = useCallback((): void => {
        dispatch(clearCurrentPackage());
    }, [dispatch]);

    /**
     * Clear package items
     */
    const clearPackageItemsData = useCallback((): void => {
        dispatch(clearPackageItems());
    }, [dispatch]);

    /**
     * Get featured packages
     */
    const getFeaturedPackages = useCallback((): Package[] => {
        return featuredPackages;
    }, [featuredPackages]);

    /**
     * Get available packages
     */
    const getAvailablePackages = useCallback((): Package[] => {
        return availablePackages;
    }, [availablePackages]);

    /**
     * Check if package is in stock
     */
    const isPackageInStock = useCallback((packageId: string): boolean => {
        const pkg = packages.find(p => p.package_id === packageId);
        if (!pkg) return false;
        return PackageService.isPackageInStock(pkg);
    }, [packages]);

    /**
     * Get package price information
     */
    const getPackagePrice = useCallback((packageId: string): { sale: number; original: number } | null => {
        const pkg = packages.find(p => p.package_id === packageId);
        if (!pkg) return null;
        return PackageService.getPackagePrice(pkg);
    }, [packages]);

    /**
     * Calculate total value of package items
     */
    const calculatePackageTotalValue = useCallback((packageId: string): number => {
        const pkg = packages.find(p => p.package_id === packageId);
        if (!pkg) return 0;
        return PackageService.calculatePackageItemsValue(pkg);
    }, [packages]);

    /**
     * Get package savings amount
     */
    const getPackageSavings = useCallback((packageId: string): number => {
        const pkg = packages.find(p => p.package_id === packageId);
        if (!pkg) return 0;
        return PackageService.calculatePackageSavings(pkg);
    }, [packages]);

    /**
     * Initialize packages data
     */
    const initializePackages = useCallback(async (): Promise<void> => {
        try {
            if (!isInitialized) {
                await dispatch(fetchPackages({ page: 1, limit: 10 })).unwrap();
                dispatch(setInitialized(true));
            }
        } catch (error) {
            console.error('Failed to initialize packages:', error);
        }
    }, [dispatch, isInitialized]);

    /**
     * Refresh packages data
     */
    const refreshPackages = useCallback(async (): Promise<void> => {
        dispatch(clearPackages());
        dispatch(resetPackagesPagination());
        await dispatch(fetchPackages({ page: 1, limit: packagesPagination.limit })).unwrap();
    }, [dispatch, packagesPagination.limit]);

    /**
     * Get packages suitable for power requirement
     */
    const getPackagesByPowerRequirement = useCallback((minWatts: number): Package[] => {
        return packages.filter(pkg =>
            PackageService.isPackageSuitableForPower(pkg, minWatts)
        );
    }, [packages]);

    /**
     * Get package by package code
     */
    const getPackageByCode = useCallback((packageCode: string): Package | undefined => {
        return PackageService.findPackageByCode(packages, packageCode);
    }, [packages]);

    /**
     * Sort packages by various criteria
     */
    const sortPackages = useCallback((sortBy: 'price' | 'title' | 'savings', order: 'asc' | 'desc' = 'asc'): Package[] => {
        switch (sortBy) {
            case 'price':
                return PackageService.sortPackagesByPrice(packages, order);
            case 'title':
                return PackageService.sortPackagesByTitle(packages, order);
            case 'savings':
                return PackageService.sortPackagesBySavings(packages, order);
            default:
                return packages;
        }
    }, [packages]);

    /**
     * Get package power output
     */
    const getPackagePowerOutput = useCallback((packageId: string): number => {
        const pkg = packages.find(p => p.package_id === packageId);
        if (!pkg) return 0;
        return PackageService.calculatePackagePowerOutput(pkg);
    }, [packages]);

    /**
     * Check if package is suitable for power requirement
     */
    const isPackageSuitableForPower = useCallback((packageId: string, requiredWatts: number): boolean => {
        const pkg = packages.find(p => p.package_id === packageId);
        if (!pkg) return false;
        return PackageService.isPackageSuitableForPower(pkg, requiredWatts);
    }, [packages]);

    return {
        // State
        packages,
        currentPackage,
        packagesLoading,
        packageLoading,
        packagesError,
        packageError,
        packagesPagination,

        packageItems,
        packageItemsLoading,
        packageItemsError,

        filters,

        // Actions
        fetchPackages: fetchPackagesData,
        fetchMorePackages,
        fetchPackageById: fetchPackageByIdData,
        fetchPackageItems: fetchPackageItemsData,
        searchPackages: searchPackagesData,
        filterPackages,
        clearFilters: clearAllFilters,
        clearErrors,
        clearCurrentPackage: clearCurrentPackageData,
        clearPackageItems: clearPackageItemsData,

        // Utilities
        isInitialized,
        getFeaturedPackages,
        getAvailablePackages,
        isPackageInStock,
        getPackagePrice,
        calculatePackageTotalValue,
        getPackageSavings,

        // Additional utilities
        initializePackages,
        refreshPackages,
        getPackagesByPowerRequirement,
        getPackageByCode,
        sortPackages,
        getPackagePowerOutput,
        isPackageSuitableForPower,
    };
};

/**
 * Hook for packages only (lighter version)
 */
export const usePackagesOnly = () => {
    const packages = useSelector((state: RootState) => selectPackages(state));
    const packagesLoading = useSelector((state: RootState) => selectPackagesLoading(state));
    const packagesError = useSelector((state: RootState) => selectPackagesError(state));
    const featuredPackages = useSelector((state: RootState) => selectFeaturedPackages(state));
    const availablePackages = useSelector((state: RootState) => selectAvailablePackages(state));

    return {
        packages,
        packagesLoading,
        packagesError,
        featuredPackages,
        availablePackages,
    };
};

/**
 * Hook for current package
 */
export const useCurrentPackage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const currentPackage = useSelector((state: RootState) => selectCurrentPackage(state));
    const packageLoading = useSelector((state: RootState) => selectPackageLoading(state));
    const packageError = useSelector((state: RootState) => selectPackageError(state));

    const fetchPackage = useCallback(async (id: string): Promise<Package> => {
        return await dispatch(fetchPackageById(id)).unwrap();
    }, [dispatch]);

    const clearPackage = useCallback((): void => {
        dispatch(clearCurrentPackage());
    }, [dispatch]);

    return {
        currentPackage,
        packageLoading,
        packageError,
        fetchPackage,
        clearPackage,
    };
};

/**
 * Hook for package items
 */
export const usePackageItems = () => {
    const dispatch = useDispatch<AppDispatch>();
    const packageItems = useSelector((state: RootState) => selectPackageItems(state));
    const packageItemsLoading = useSelector((state: RootState) => selectPackageItemsLoading(state));
    const packageItemsError = useSelector((state: RootState) => selectPackageItemsError(state));

    const fetchItems = useCallback(async (packageId: string): Promise<PackageItem[]> => {
        return await dispatch(fetchPackageItems(packageId)).unwrap();
    }, [dispatch]);

    const clearItems = useCallback((): void => {
        dispatch(clearPackageItems());
    }, [dispatch]);

    return {
        packageItems,
        packageItemsLoading,
        packageItemsError,
        fetchItems,
        clearItems,
    };
};

// Export default
export default usePackages;