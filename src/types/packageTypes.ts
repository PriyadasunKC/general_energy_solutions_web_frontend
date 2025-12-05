// src/types/packageTypes.ts

// Package item interfaces
export interface PackageItemSpecification {
    weight?: string;
    current?: string;
    voltage?: string;
    wattage?: string;
    warranty?: string;
    cell_type?: string;
    dimensions?: string;
    efficiency?: string;
    [key: string]: string | undefined;
}

export interface PackageItem {
    package_item_id: string;
    package_id: string;
    title: string;
    subtitle: string;
    description: string;
    specification: PackageItemSpecification;
    image_urls: string[];
    quantity: number;
    price: string;
    is_deleted: boolean;
    modified_at: string;
    modified_by: string;
}

// Package interfaces
export interface PackageSpecification {
    warranty?: string;
    efficiency?: string;
    panel_type?: string;
    power_output?: string;
    [key: string]: string | undefined;
}

export interface Package {
    package_id: string;
    package_code: string;
    title: string;
    subtitle: string;
    description: string;
    specification: PackageSpecification;
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
    packageItems: PackageItem[];
}

// API Response interfaces
export interface PackagesResponse {
    success: boolean;
    data: Package[];
    pagination: {
        page: number;
        limit: number;
    };
}

export interface PackageResponse {
    success: boolean;
    data: Package;
}

export interface PackageItemsResponse {
    success: boolean;
    data: PackageItem[];
}

// Query parameters interfaces
export interface PackagesQueryParams {
    page?: number;
    limit?: number;
    isAvailable?: boolean;
    isFeatured?: boolean;
    search?: string;
}

// State interfaces
export interface PackageState {
    // Packages
    packages: Package[];
    currentPackage: Package | null;
    packagesLoading: boolean;
    packageLoading: boolean;
    packagesError: string | null;
    packageError: string | null;
    packagesPagination: {
        page: number;
        limit: number;
        hasMore: boolean;
    };

    // Package items
    packageItems: PackageItem[];
    packageItemsLoading: boolean;
    packageItemsError: string | null;

    // Filters and search
    filters: {
        search: string;
        isAvailable: boolean | undefined;
        isFeatured: boolean | undefined;
    };

    // UI state
    isInitialized: boolean;
}

// Hook return types
export interface UsePackagesReturn {
    // Packages state
    packages: Package[];
    currentPackage: Package | null;
    packagesLoading: boolean;
    packageLoading: boolean;
    packagesError: string | null;
    packageError: string | null;
    packagesPagination: {
        page: number;
        limit: number;
        hasMore: boolean;
    };

    // Package items state
    packageItems: PackageItem[];
    packageItemsLoading: boolean;
    packageItemsError: string | null;

    // Filters
    filters: PackageState['filters'];

    // Actions
    fetchPackages: (params?: PackagesQueryParams) => Promise<Package[]>;
    fetchMorePackages: (params?: PackagesQueryParams) => Promise<Package[]>;
    fetchPackageById: (id: string) => Promise<Package>;
    fetchPackageItems: (packageId: string) => Promise<PackageItem[]>;
    searchPackages: (query: string) => Promise<Package[]>;
    filterPackages: (filters: Partial<PackageState['filters']>) => void;
    clearFilters: () => void;
    clearErrors: () => void;
    clearCurrentPackage: () => void;
    clearPackageItems: () => void;

    // Utilities
    isInitialized: boolean;
    getFeaturedPackages: () => Package[];
    getAvailablePackages: () => Package[];
    isPackageInStock: (packageId: string) => boolean;
    getPackagePrice: (packageId: string) => { sale: number; original: number } | null;
    calculatePackageTotalValue: (packageId: string) => number;
    getPackageSavings: (packageId: string) => number;

    // Additional utilities
    initializePackages: () => Promise<void>;
    refreshPackages: () => Promise<void>;
    getPackagesByPowerRequirement: (minWatts: number) => Package[];
    getPackageByCode: (packageCode: string) => Package | undefined;
    sortPackages: (sortBy: 'price' | 'title' | 'savings', order?: 'asc' | 'desc') => Package[];
    getPackagePowerOutput: (packageId: string) => number;
    isPackageSuitableForPower: (packageId: string, requiredWatts: number) => boolean;
}

// API endpoints
export const PACKAGE_ENDPOINTS = {
    PACKAGES: '/api/packages',
    PACKAGE_BY_ID: (id: string) => `/api/packages/${id}`,
    PACKAGE_ITEMS: (id: string) => `/api/packages/${id}/items`,
} as const;

// Default pagination
export const DEFAULT_PACKAGE_PAGINATION = {
    page: 1,
    limit: 10,
    hasMore: true,
} as const;