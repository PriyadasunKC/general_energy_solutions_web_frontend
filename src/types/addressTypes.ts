// src/types/addressTypes.ts

/**
 * User information in address response
 */
export interface AddressUser {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
}

/**
 * Address interface matching API response
 */
export interface Address {
    addressId: string;
    userId: string;
    label: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    isDeleted: boolean;
    createdAt: string;
    modifiedAt: string;
    modifiedBy: string;
    user?: AddressUser;
}

/**
 * Create address payload
 */
export interface CreateAddressPayload {
    label: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
}

/**
 * Update address payload
 */
export interface UpdateAddressPayload {
    label?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
}

/**
 * Single address API response
 */
export interface AddressResponse {
    message: string;
    address: Address;
}

/**
 * All addresses API response
 */
export interface AddressesResponse {
    addresses: Address[];
    total: number;
}

/**
 * Delete address API response
 */
export interface DeleteAddressResponse {
    message: string;
}

/**
 * Address limit error response
 */
export interface AddressLimitError {
    error: string;
    message: string;
}

/**
 * Redux state for address management
 */
export interface AddressState {
    addresses: Address[];
    currentAddress: Address | null;
    defaultAddress: Address | null;
    addressesLoading: boolean;
    addressLoading: boolean;
    addressesError: string | null;
    addressError: string | null;
    isInitialized: boolean;
}

/**
 * Hook return type for useAddresses
 */
export interface UseAddressReturn {
    // State
    addresses: Address[];
    currentAddress: Address | null;
    defaultAddress: Address | null;
    addressesLoading: boolean;
    addressLoading: boolean;
    addressesError: string | null;
    addressError: string | null;
    isInitialized: boolean;

    // Actions
    addAddress: (payload: CreateAddressPayload) => Promise<Address>;
    fetchAllAddresses: () => Promise<Address[]>;
    fetchAddress: (addressId: string) => Promise<Address>;
    updateAddressById: (addressId: string, payload: UpdateAddressPayload) => Promise<Address>;
    setAsDefault: (addressId: string) => Promise<Address>;
    removeAddress: (addressId: string) => Promise<void>;
    clearErrors: () => void;
    clearCurrent: () => void;
    clearAll: () => void;

    // Utilities
    getDefaultAddress: () => Address | null;
    formatAddressForDisplay: (address: Address) => string;
    isAddressComplete: (address: Address) => boolean;
}

/**
 * API endpoints for address management
 */
export const ADDRESS_ENDPOINTS = {
    CREATE: '/api/addresses',
    GET_ALL: '/api/addresses',
    GET_BY_ID: (addressId: string) => `/api/addresses/${addressId}`,
    UPDATE: (addressId: string) => `/api/addresses/${addressId}`,
    SET_DEFAULT: (addressId: string) => `/api/addresses/${addressId}/set-default`,
    DELETE: (addressId: string) => `/api/addresses/${addressId}/permanent`,
} as const;

/**
 * Address constants
 */
export const ADDRESS_CONSTANTS = {
    MAX_ADDRESSES: 5,
    DEFAULT_COUNTRY: 'USA',
} as const;
