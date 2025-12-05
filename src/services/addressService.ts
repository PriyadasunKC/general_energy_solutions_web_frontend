// src/services/addressService.ts
import { apiClient } from './apiClient';
import {
    Address,
    CreateAddressPayload,
    UpdateAddressPayload,
    AddressResponse,
    AddressesResponse,
    DeleteAddressResponse,
    ADDRESS_ENDPOINTS,
} from '../types/addressTypes';

/**
 * Address Service
 * Handles all address-related API calls
 */
export class AddressService {
    /**
     * Create a new address
     */
    static async createAddress(payload: CreateAddressPayload): Promise<AddressResponse> {
        try {
            const response = await apiClient.post<AddressResponse>(
                ADDRESS_ENDPOINTS.CREATE,
                payload
            );
            return response;
        } catch (error) {
            console.error('Failed to create address:', error);
            throw error;
        }
    }

    /**
     * Get all addresses for the current user
     */
    static async getAllAddresses(): Promise<AddressesResponse> {
        try {
            const response = await apiClient.get<AddressesResponse>(
                ADDRESS_ENDPOINTS.GET_ALL
            );
            return response;
        } catch (error) {
            console.error('Failed to fetch addresses:', error);
            throw error;
        }
    }

    /**
     * Get address by ID
     */
    static async getAddressById(addressId: string): Promise<AddressResponse> {
        try {
            if (!addressId) {
                throw new Error('Address ID is required');
            }

            const response = await apiClient.get<AddressResponse>(
                ADDRESS_ENDPOINTS.GET_BY_ID(addressId)
            );
            return response;
        } catch (error) {
            console.error(`Failed to fetch address ${addressId}:`, error);
            throw error;
        }
    }

    /**
     * Update an existing address
     */
    static async updateAddress(
        addressId: string,
        payload: UpdateAddressPayload
    ): Promise<AddressResponse> {
        try {
            if (!addressId) {
                throw new Error('Address ID is required');
            }

            const response = await apiClient.put<AddressResponse>(
                ADDRESS_ENDPOINTS.UPDATE(addressId),
                payload
            );
            return response;
        } catch (error) {
            console.error(`Failed to update address ${addressId}:`, error);
            throw error;
        }
    }

    /**
     * Set an address as default
     */
    static async setDefaultAddress(addressId: string): Promise<AddressResponse> {
        try {
            if (!addressId) {
                throw new Error('Address ID is required');
            }

            const response = await apiClient.patch<AddressResponse>(
                ADDRESS_ENDPOINTS.SET_DEFAULT(addressId)
            );
            return response;
        } catch (error) {
            console.error(`Failed to set default address ${addressId}:`, error);
            throw error;
        }
    }

    /**
     * Delete an address permanently
     */
    static async deleteAddress(addressId: string): Promise<DeleteAddressResponse> {
        try {
            if (!addressId) {
                throw new Error('Address ID is required');
            }

            const response = await apiClient.delete<DeleteAddressResponse>(
                ADDRESS_ENDPOINTS.DELETE(addressId)
            );
            return response;
        } catch (error) {
            console.error(`Failed to delete address ${addressId}:`, error);
            throw error;
        }
    }

    /**
     * Get default address from a list of addresses
     */
    static getDefaultAddress(addresses: Address[]): Address | null {
        return addresses.find((address) => address.isDefault) || null;
    }

    /**
     * Format address for display
     */
    static formatAddressForDisplay(address: Address): string {
        const parts: string[] = [address.addressLine1];

        if (address.addressLine2) {
            parts.push(address.addressLine2);
        }

        parts.push(`${address.city}, ${address.state} ${address.postalCode}`);
        parts.push(address.country);

        return parts.join(', ');
    }

    /**
     * Format address for single line display
     */
    static formatAddressSingleLine(address: Address): string {
        const parts: string[] = [];

        if (address.label) {
            parts.push(address.label);
        }

        parts.push(address.addressLine1);

        if (address.addressLine2) {
            parts.push(address.addressLine2);
        }

        parts.push(address.city);
        parts.push(address.state);
        parts.push(address.postalCode);

        return parts.join(', ');
    }

    /**
     * Format address for multi-line display
     */
    static formatAddressMultiLine(address: Address): string[] {
        const lines: string[] = [];

        if (address.label) {
            lines.push(address.label);
        }

        lines.push(address.addressLine1);

        if (address.addressLine2) {
            lines.push(address.addressLine2);
        }

        lines.push(`${address.city}, ${address.state} ${address.postalCode}`);
        lines.push(address.country);

        return lines;
    }

    /**
     * Check if address has all required fields
     */
    static isAddressComplete(address: Address): boolean {
        return !!(
            address.addressLine1 &&
            address.city &&
            address.state &&
            address.postalCode &&
            address.country
        );
    }

    /**
     * Validate address before submission
     */
    static validateAddress(payload: CreateAddressPayload | UpdateAddressPayload): {
        isValid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];

        if ('addressLine1' in payload && !payload.addressLine1) {
            errors.push('Address line 1 is required');
        }

        if ('city' in payload && !payload.city) {
            errors.push('City is required');
        }

        if ('state' in payload && !payload.state) {
            errors.push('State is required');
        }

        if ('postalCode' in payload && !payload.postalCode) {
            errors.push('Postal code is required');
        }

        if ('country' in payload && !payload.country) {
            errors.push('Country is required');
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    /**
     * Filter active (non-deleted) addresses
     */
    static filterActiveAddresses(addresses: Address[]): Address[] {
        return addresses.filter((address) => !address.isDeleted);
    }

    /**
     * Sort addresses (default first, then by creation date)
     */
    static sortAddresses(addresses: Address[]): Address[] {
        return [...addresses].sort((a, b) => {
            // Default address always first
            if (a.isDefault && !b.isDefault) return -1;
            if (!a.isDefault && b.isDefault) return 1;

            // Then by creation date (newest first)
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }

    /**
     * Get address label with default indicator
     */
    static getAddressLabelWithDefault(address: Address): string {
        return address.isDefault ? `${address.label} (Default)` : address.label;
    }
}

export default AddressService;
