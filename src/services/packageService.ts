// src/services/packageService.ts
import { apiClient } from './apiClient';
import {
    Package,
    PackageItem,
    PackagesResponse,
    PackageResponse,
    PackageItemsResponse,
    PackagesQueryParams,
    PACKAGE_ENDPOINTS,
} from '../types/packageTypes';

/**
 * Package Service
 * Handles all package-related API calls
 */
export class PackageService {
    /**
     * Fetch all packages with optional filters
     */
    static async fetchPackages(params: PackagesQueryParams = {}): Promise<PackagesResponse> {
        try {
            const queryParams = new URLSearchParams();

            // Add pagination params
            if (params.page) queryParams.set('page', params.page.toString());
            if (params.limit) queryParams.set('limit', params.limit.toString());

            // Add filter params
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
            const url = `${PACKAGE_ENDPOINTS.PACKAGES}${queryString ? `?${queryString}` : ''}`;

            const response = await apiClient.get<PackagesResponse>(url);
            return response;
        } catch (error) {
            console.error('Failed to fetch packages:', error);
            throw error;
        }
    }

    /**
     * Fetch package by ID
     */
    static async fetchPackageById(id: string): Promise<PackageResponse> {
        try {
            if (!id) {
                throw new Error('Package ID is required');
            }

            const response = await apiClient.get<PackageResponse>(
                PACKAGE_ENDPOINTS.PACKAGE_BY_ID(id)
            );
            return response;
        } catch (error) {
            console.error(`Failed to fetch package ${id}:`, error);
            throw error;
        }
    }

    /**
     * Fetch package items by package ID
     */
    static async fetchPackageItems(packageId: string): Promise<PackageItemsResponse> {
        try {
            if (!packageId) {
                throw new Error('Package ID is required');
            }

            const response = await apiClient.get<PackageItemsResponse>(
                PACKAGE_ENDPOINTS.PACKAGE_ITEMS(packageId)
            );
            return response;
        } catch (error) {
            console.error(`Failed to fetch package items for ${packageId}:`, error);
            throw error;
        }
    }

    /**
     * Search packages by query
     */
    static async searchPackages(
        query: string,
        params: Omit<PackagesQueryParams, 'search'> = {}
    ): Promise<PackagesResponse> {
        try {
            if (!query.trim()) {
                throw new Error('Search query is required');
            }

            return await this.fetchPackages({
                ...params,
                search: query.trim(),
            });
        } catch (error) {
            console.error('Failed to search packages:', error);
            throw error;
        }
    }

    /**
     * Fetch featured packages
     */
    static async fetchFeaturedPackages(params: Omit<PackagesQueryParams, 'isFeatured'> = {}): Promise<PackagesResponse> {
        try {
            return await this.fetchPackages({
                ...params,
                isFeatured: true,
            });
        } catch (error) {
            console.error('Failed to fetch featured packages:', error);
            throw error;
        }
    }

    /**
     * Fetch available packages
     */
    static async fetchAvailablePackages(params: Omit<PackagesQueryParams, 'isAvailable'> = {}): Promise<PackagesResponse> {
        try {
            return await this.fetchPackages({
                ...params,
                isAvailable: true,
            });
        } catch (error) {
            console.error('Failed to fetch available packages:', error);
            throw error;
        }
    }

    /**
     * Check if package is in stock
     */
    static isPackageInStock(pkg: Package): boolean {
        return pkg.is_available &&
            !pkg.is_deleted &&
            pkg.quantity_available > 0;
    }

    /**
     * Get package price information
     */
    static getPackagePrice(pkg: Package): { sale: number; original: number; discount?: number } {
        const salePrice = parseFloat(pkg.sale_price);
        const originalPrice = parseFloat(pkg.original_price);

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
     * Calculate total value of package items (individual item prices)
     */
    static calculatePackageItemsValue(pkg: Package): number {
        return pkg.packageItems.reduce((total, item) => {
            const itemPrice = parseFloat(item.price);
            return total + (itemPrice * item.quantity);
        }, 0);
    }

    /**
     * Calculate package savings (difference between item total and package price)
     */
    static calculatePackageSavings(pkg: Package): number {
        const itemsValue = this.calculatePackageItemsValue(pkg);
        const packagePrice = parseFloat(pkg.sale_price);
        return Math.max(0, itemsValue - packagePrice);
    }

    /**
     * Get package savings percentage
     */
    static getPackageSavingsPercentage(pkg: Package): number {
        const itemsValue = this.calculatePackageItemsValue(pkg);
        const savings = this.calculatePackageSavings(pkg);

        if (itemsValue === 0) return 0;
        return Math.round((savings / itemsValue) * 100);
    }

    /**
     * Format package specifications for display
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
     * Get primary image URL for package
     */
    static getPrimaryImageUrl(pkg: Package): string | null {
        return pkg.image_urls && pkg.image_urls.length > 0
            ? pkg.image_urls[0]
            : null;
    }

    /**
     * Filter packages by availability
     */
    static filterAvailablePackages(packages: Package[]): Package[] {
        return packages.filter(pkg => this.isPackageInStock(pkg));
    }

    /**
     * Filter packages by featured status
     */
    static filterFeaturedPackages(packages: Package[]): Package[] {
        return packages.filter(pkg => pkg.is_featured);
    }

    /**
     * Sort packages by price
     */
    static sortPackagesByPrice(packages: Package[], order: 'asc' | 'desc' = 'asc'): Package[] {
        return [...packages].sort((a, b) => {
            const priceA = parseFloat(a.sale_price);
            const priceB = parseFloat(b.sale_price);

            return order === 'asc' ? priceA - priceB : priceB - priceA;
        });
    }

    /**
     * Sort packages by title
     */
    static sortPackagesByTitle(packages: Package[], order: 'asc' | 'desc' = 'asc'): Package[] {
        return [...packages].sort((a, b) => {
            const comparison = a.title.localeCompare(b.title);
            return order === 'asc' ? comparison : -comparison;
        });
    }

    /**
     * Sort packages by savings (highest savings first)
     */
    static sortPackagesBySavings(packages: Package[], order: 'asc' | 'desc' = 'desc'): Package[] {
        return [...packages].sort((a, b) => {
            const savingsA = this.calculatePackageSavings(a);
            const savingsB = this.calculatePackageSavings(b);

            return order === 'asc' ? savingsA - savingsB : savingsB - savingsA;
        });
    }

    /**
     * Get package by package code
     */
    static findPackageByCode(packages: Package[], packageCode: string): Package | undefined {
        return packages.find(pkg => pkg.package_code === packageCode);
    }

    /**
     * Get total items count in package
     */
    static getTotalItemsCount(pkg: Package): number {
        return pkg.packageItems.reduce((total, item) => total + item.quantity, 0);
    }

    /**
     * Check if package has specific item
     */
    static hasPackageItem(pkg: Package, itemTitle: string): boolean {
        return pkg.packageItems.some(item =>
            item.title.toLowerCase().includes(itemTitle.toLowerCase())
        );
    }

    /**
     * Get package item by ID
     */
    static getPackageItemById(pkg: Package, itemId: string): PackageItem | undefined {
        return pkg.packageItems.find(item => item.package_item_id === itemId);
    }

    /**
     * Calculate package weight (if available in specifications)
     */
    static calculatePackageWeight(pkg: Package): number {
        return pkg.packageItems.reduce((totalWeight, item) => {
            const weightStr = item.specification.weight;
            if (weightStr) {
                // Extract number from weight string (e.g., "7.5kg" -> 7.5)
                const weight = parseFloat(weightStr.replace(/[^\d.]/g, ''));
                if (!isNaN(weight)) {
                    return totalWeight + (weight * item.quantity);
                }
            }
            return totalWeight;
        }, 0);
    }

    /**
     * Get package power output (sum of all wattages)
     */
    static calculatePackagePowerOutput(pkg: Package): number {
        return pkg.packageItems.reduce((totalPower, item) => {
            const wattageStr = item.specification.wattage;
            if (wattageStr) {
                // Extract number from wattage string (e.g., "100W" -> 100)
                const wattage = parseFloat(wattageStr.replace(/[^\d.]/g, ''));
                if (!isNaN(wattage)) {
                    return totalPower + (wattage * item.quantity);
                }
            }
            return totalPower;
        }, 0);
    }

    /**
     * Check if package is suitable for power requirement
     */
    static isPackageSuitableForPower(pkg: Package, requiredWatts: number): boolean {
        const packagePower = this.calculatePackagePowerOutput(pkg);
        return packagePower >= requiredWatts;
    }
}

// Export as default for easier importing
export default PackageService;