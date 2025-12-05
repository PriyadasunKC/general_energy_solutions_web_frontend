// src/hooks/addressHook.ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import {
    createAddress,
    fetchAddresses,
    fetchAddressById,
    updateAddress,
    setDefaultAddress,
    deleteAddress,
    clearAddressError,
    clearAddressesError,
    clearAllAddressErrors,
    clearCurrentAddress,
    clearAddresses,
    selectAddresses,
    selectCurrentAddress,
    selectDefaultAddress,
    selectAddressesLoading,
    selectAddressLoading,
    selectAddressesError,
    selectAddressError,
    selectAddressesInitialized,
} from '../store/slices/addressSlice';
import { AddressService } from '../services/addressService';
import {
    Address,
    CreateAddressPayload,
    UpdateAddressPayload,
} from '../types/addressTypes';

/**
 * Custom hook for address management
 */
export const useAddresses = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Selectors
    const addresses = useSelector((state: RootState) => selectAddresses(state));
    const currentAddress = useSelector((state: RootState) => selectCurrentAddress(state));
    const defaultAddress = useSelector((state: RootState) => selectDefaultAddress(state));
    const addressesLoading = useSelector((state: RootState) => selectAddressesLoading(state));
    const addressLoading = useSelector((state: RootState) => selectAddressLoading(state));
    const addressesError = useSelector((state: RootState) => selectAddressesError(state));
    const addressError = useSelector((state: RootState) => selectAddressError(state));
    const isInitialized = useSelector((state: RootState) => selectAddressesInitialized(state));

    /**
     * Create a new address
     */
    const addAddress = useCallback(
        async (payload: CreateAddressPayload): Promise<Address> => {
            return await dispatch(createAddress(payload)).unwrap();
        },
        [dispatch]
    );

    /**
     * Fetch all addresses
     */
    const fetchAllAddresses = useCallback(async (): Promise<Address[]> => {
        return await dispatch(fetchAddresses()).unwrap();
    }, [dispatch]);

    /**
     * Fetch a specific address by ID
     */
    const fetchAddress = useCallback(
        async (addressId: string): Promise<Address> => {
            return await dispatch(fetchAddressById(addressId)).unwrap();
        },
        [dispatch]
    );

    /**
     * Update an address
     */
    const updateAddressById = useCallback(
        async (addressId: string, payload: UpdateAddressPayload): Promise<Address> => {
            return await dispatch(updateAddress({ addressId, payload })).unwrap();
        },
        [dispatch]
    );

    /**
     * Set an address as default
     */
    const setAsDefault = useCallback(
        async (addressId: string): Promise<Address> => {
            return await dispatch(setDefaultAddress(addressId)).unwrap();
        },
        [dispatch]
    );

    /**
     * Delete an address permanently
     */
    const removeAddress = useCallback(
        async (addressId: string): Promise<void> => {
            await dispatch(deleteAddress(addressId)).unwrap();
        },
        [dispatch]
    );

    /**
     * Clear all errors
     */
    const clearErrors = useCallback(() => {
        dispatch(clearAllAddressErrors());
    }, [dispatch]);

    /**
     * Clear address error only
     */
    const clearAddressErrorOnly = useCallback(() => {
        dispatch(clearAddressError());
    }, [dispatch]);

    /**
     * Clear addresses error only
     */
    const clearAddressesErrorOnly = useCallback(() => {
        dispatch(clearAddressesError());
    }, [dispatch]);

    /**
     * Clear current address
     */
    const clearCurrent = useCallback(() => {
        dispatch(clearCurrentAddress());
    }, [dispatch]);

    /**
     * Clear all addresses
     */
    const clearAll = useCallback(() => {
        dispatch(clearAddresses());
    }, [dispatch]);

    /**
     * Get default address from current list
     */
    const getDefaultAddress = useCallback((): Address | null => {
        return AddressService.getDefaultAddress(addresses);
    }, [addresses]);

    /**
     * Format address for display
     */
    const formatAddressForDisplay = useCallback((address: Address): string => {
        return AddressService.formatAddressForDisplay(address);
    }, []);

    /**
     * Check if address is complete
     */
    const isAddressComplete = useCallback((address: Address): boolean => {
        return AddressService.isAddressComplete(address);
    }, []);

    return {
        // State
        addresses,
        currentAddress,
        defaultAddress,
        addressesLoading,
        addressLoading,
        addressesError,
        addressError,
        isInitialized,

        // Actions
        addAddress,
        fetchAllAddresses,
        fetchAddress,
        updateAddressById,
        setAsDefault,
        removeAddress,
        clearErrors,
        clearAddressErrorOnly,
        clearAddressesErrorOnly,
        clearCurrent,
        clearAll,

        // Utilities
        getDefaultAddress,
        formatAddressForDisplay,
        isAddressComplete,
    };
};

/**
 * Hook for default address only
 */
export const useDefaultAddress = () => {
    const dispatch = useDispatch<AppDispatch>();
    const defaultAddress = useSelector((state: RootState) => selectDefaultAddress(state));
    const addressLoading = useSelector((state: RootState) => selectAddressLoading(state));
    const addressError = useSelector((state: RootState) => selectAddressError(state));

    const setAsDefault = useCallback(
        async (addressId: string): Promise<Address> => {
            return await dispatch(setDefaultAddress(addressId)).unwrap();
        },
        [dispatch]
    );

    return {
        defaultAddress,
        addressLoading,
        addressError,
        setAsDefault,
    };
};

/**
 * Hook for current address only
 */
export const useCurrentAddress = () => {
    const dispatch = useDispatch<AppDispatch>();
    const currentAddress = useSelector((state: RootState) => selectCurrentAddress(state));
    const addressLoading = useSelector((state: RootState) => selectAddressLoading(state));
    const addressError = useSelector((state: RootState) => selectAddressError(state));

    const fetchAddress = useCallback(
        async (addressId: string): Promise<Address> => {
            return await dispatch(fetchAddressById(addressId)).unwrap();
        },
        [dispatch]
    );

    const clearAddress = useCallback(() => {
        dispatch(clearCurrentAddress());
    }, [dispatch]);

    return {
        currentAddress,
        addressLoading,
        addressError,
        fetchAddress,
        clearAddress,
    };
};

export default useAddresses;
