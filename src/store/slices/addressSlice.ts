// src/store/slices/addressSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AddressService } from '../../services/addressService';
import {
    AddressState,
    Address,
    CreateAddressPayload,
    UpdateAddressPayload,
} from '../../types/addressTypes';
import { APIError } from '../../types/authTypes';

// Initial state
const initialState: AddressState = {
    addresses: [],
    currentAddress: null,
    defaultAddress: null,
    addressesLoading: false,
    addressLoading: false,
    addressesError: null,
    addressError: null,
    isInitialized: false,
};

// Async thunks

/**
 * Create a new address
 */
export const createAddress = createAsyncThunk<
    Address,
    CreateAddressPayload,
    { rejectValue: APIError }
>('addresses/create', async (payload, { rejectWithValue }) => {
    try {
        const response = await AddressService.createAddress(payload);
        return response.address;
    } catch (error) {
        return rejectWithValue(error as APIError);
    }
});

/**
 * Fetch all addresses
 */
export const fetchAddresses = createAsyncThunk<
    Address[],
    void,
    { rejectValue: APIError }
>('addresses/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await AddressService.getAllAddresses();
        return response.addresses;
    } catch (error) {
        return rejectWithValue(error as APIError);
    }
});

/**
 * Fetch address by ID
 */
export const fetchAddressById = createAsyncThunk<
    Address,
    string,
    { rejectValue: APIError }
>('addresses/fetchById', async (addressId, { rejectWithValue }) => {
    try {
        const response = await AddressService.getAddressById(addressId);
        return response.address;
    } catch (error) {
        return rejectWithValue(error as APIError);
    }
});

/**
 * Update an address
 */
export const updateAddress = createAsyncThunk<
    Address,
    { addressId: string; payload: UpdateAddressPayload },
    { rejectValue: APIError }
>('addresses/update', async ({ addressId, payload }, { rejectWithValue }) => {
    try {
        const response = await AddressService.updateAddress(addressId, payload);
        return response.address;
    } catch (error) {
        return rejectWithValue(error as APIError);
    }
});

/**
 * Set address as default
 */
export const setDefaultAddress = createAsyncThunk<
    Address,
    string,
    { rejectValue: APIError }
>('addresses/setDefault', async (addressId, { rejectWithValue }) => {
    try {
        const response = await AddressService.setDefaultAddress(addressId);
        return response.address;
    } catch (error) {
        return rejectWithValue(error as APIError);
    }
});

/**
 * Delete an address permanently
 */
export const deleteAddress = createAsyncThunk<
    string,
    string,
    { rejectValue: APIError }
>('addresses/delete', async (addressId, { rejectWithValue }) => {
    try {
        await AddressService.deleteAddress(addressId);
        return addressId;
    } catch (error) {
        return rejectWithValue(error as APIError);
    }
});

// Address slice
const addressSlice = createSlice({
    name: 'addresses',
    initialState,
    reducers: {
        // Clear errors
        clearAddressError: (state) => {
            state.addressError = null;
        },

        clearAddressesError: (state) => {
            state.addressesError = null;
        },

        clearAllAddressErrors: (state) => {
            state.addressError = null;
            state.addressesError = null;
        },

        // Clear current address
        clearCurrentAddress: (state) => {
            state.currentAddress = null;
            state.addressError = null;
        },

        // Clear all addresses
        clearAddresses: (state) => {
            state.addresses = [];
            state.defaultAddress = null;
            state.addressesError = null;
            state.isInitialized = false;
        },

        // Set default address locally (optimistic update)
        setDefaultAddressLocal: (state, action: PayloadAction<string>) => {
            state.addresses = state.addresses.map((address) => ({
                ...address,
                isDefault: address.addressId === action.payload,
            }));
            state.defaultAddress =
                state.addresses.find((address) => address.addressId === action.payload) || null;
        },
    },
    extraReducers: (builder) => {
        // Create address
        builder
            .addCase(createAddress.pending, (state) => {
                state.addressLoading = true;
                state.addressError = null;
            })
            .addCase(createAddress.fulfilled, (state, action) => {
                state.addressLoading = false;
                state.currentAddress = action.payload;
                state.addresses = [action.payload, ...state.addresses];

                // Update default address if this is the default
                if (action.payload.isDefault) {
                    // Remove default from other addresses
                    state.addresses = state.addresses.map((address) => ({
                        ...address,
                        isDefault: address.addressId === action.payload.addressId,
                    }));
                    state.defaultAddress = action.payload;
                }

                state.addressError = null;
            })
            .addCase(createAddress.rejected, (state, action) => {
                state.addressLoading = false;
                state.addressError = action.payload?.message || 'Failed to create address';
            });

        // Fetch all addresses
        builder
            .addCase(fetchAddresses.pending, (state) => {
                state.addressesLoading = true;
                state.addressesError = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.addressesLoading = false;
                state.addresses = action.payload;
                state.defaultAddress =
                    action.payload.find((address) => address.isDefault) || null;
                state.addressesError = null;
                state.isInitialized = true;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.addressesLoading = false;
                state.addressesError = action.payload?.message || 'Failed to fetch addresses';
            });

        // Fetch address by ID
        builder
            .addCase(fetchAddressById.pending, (state) => {
                state.addressLoading = true;
                state.addressError = null;
            })
            .addCase(fetchAddressById.fulfilled, (state, action) => {
                state.addressLoading = false;
                state.currentAddress = action.payload;
                state.addressError = null;
            })
            .addCase(fetchAddressById.rejected, (state, action) => {
                state.addressLoading = false;
                state.currentAddress = null;
                state.addressError = action.payload?.message || 'Failed to fetch address';
            });

        // Update address
        builder
            .addCase(updateAddress.pending, (state) => {
                state.addressLoading = true;
                state.addressError = null;
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                state.addressLoading = false;
                state.currentAddress = action.payload;

                // Update in addresses list
                const index = state.addresses.findIndex(
                    (address) => address.addressId === action.payload.addressId
                );
                if (index !== -1) {
                    state.addresses[index] = action.payload;
                }

                state.addressError = null;
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.addressLoading = false;
                state.addressError = action.payload?.message || 'Failed to update address';
            });

        // Set default address
        builder
            .addCase(setDefaultAddress.pending, (state) => {
                state.addressLoading = true;
                state.addressError = null;
            })
            .addCase(setDefaultAddress.fulfilled, (state, action) => {
                state.addressLoading = false;
                state.currentAddress = action.payload;

                // Update all addresses - remove default from others
                state.addresses = state.addresses.map((address) => ({
                    ...address,
                    isDefault: address.addressId === action.payload.addressId,
                }));

                state.defaultAddress = action.payload;
                state.addressError = null;
            })
            .addCase(setDefaultAddress.rejected, (state, action) => {
                state.addressLoading = false;
                state.addressError = action.payload?.message || 'Failed to set default address';
            });

        // Delete address
        builder
            .addCase(deleteAddress.pending, (state) => {
                state.addressLoading = true;
                state.addressError = null;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.addressLoading = false;

                // Remove from addresses list
                state.addresses = state.addresses.filter(
                    (address) => address.addressId !== action.payload
                );

                // Clear current if it was deleted
                if (state.currentAddress?.addressId === action.payload) {
                    state.currentAddress = null;
                }

                // Update default address if it was deleted
                if (state.defaultAddress?.addressId === action.payload) {
                    state.defaultAddress =
                        state.addresses.find((address) => address.isDefault) || null;
                }

                state.addressError = null;
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.addressLoading = false;
                state.addressError = action.payload?.message || 'Failed to delete address';
            });
    },
});

// Export actions
export const {
    clearAddressError,
    clearAddressesError,
    clearAllAddressErrors,
    clearCurrentAddress,
    clearAddresses,
    setDefaultAddressLocal,
} = addressSlice.actions;

// Export selectors
export const selectAddresses = (state: { addresses: AddressState }) =>
    state.addresses.addresses;
export const selectCurrentAddress = (state: { addresses: AddressState }) =>
    state.addresses.currentAddress;
export const selectDefaultAddress = (state: { addresses: AddressState }) =>
    state.addresses.defaultAddress;
export const selectAddressesLoading = (state: { addresses: AddressState }) =>
    state.addresses.addressesLoading;
export const selectAddressLoading = (state: { addresses: AddressState }) =>
    state.addresses.addressLoading;
export const selectAddressesError = (state: { addresses: AddressState }) =>
    state.addresses.addressesError;
export const selectAddressError = (state: { addresses: AddressState }) =>
    state.addresses.addressError;
export const selectAddressesInitialized = (state: { addresses: AddressState }) =>
    state.addresses.isInitialized;

// Export reducer
export default addressSlice.reducer;
