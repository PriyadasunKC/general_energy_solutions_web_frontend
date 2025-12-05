import React, { useState, useEffect } from 'react';
import {
    X,
    MapPin,
    Plus,
    Edit3,
    Trash2,
    Check,
    Star,
    Phone,
    Building,
    Home,
    Briefcase,
    AlertCircle,
    Loader2
} from 'lucide-react';

import { solarTheme } from '@/theme/theme';
import { useAddresses, useAuth } from '@/hooks';
import type { Address as BackendAddress } from '@/types/addressTypes';

interface AddressManageComponentProps {
    onClose: () => void;
    onAddressSelect?: (address: BackendAddress) => void;
}

const sriLankanStates = [
    "Western Province",
    "Central Province",
    "Southern Province",
    "Northern Province",
    "Eastern Province",
    "North Western Province",
    "North Central Province",
    "Uva Province",
    "Sabaragamuwa Province"
];

export default function AddressManageComponent({
    onClose,
    onAddressSelect
}: AddressManageComponentProps) {
    const {
        addresses,
        addressesLoading,
        addressesError,
        addressError,
        addAddress,
        fetchAllAddresses,
        updateAddressById,
        setAsDefault,
        removeAddress,
        clearErrors,
        isInitialized
    } = useAddresses();

    const { user } = useAuth();

    const [showAddForm, setShowAddForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<BackendAddress | null>(null);
    const [formData, setFormData] = useState<{
        label: string;
        addressLine1: string;
        addressLine2: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        isDefault: boolean;
    }>({
        label: 'Home',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Sri Lanka',
        isDefault: false
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingAction, setLoadingAction] = useState<{ addressId: string; action: 'setDefault' | 'delete' } | null>(null);

    // Fetch addresses on mount
    useEffect(() => {
        if (!isInitialized) {
            fetchAllAddresses().catch((error) => {
                console.error('Failed to fetch addresses:', error);
            });
        }
    }, [isInitialized, fetchAllAddresses]);

    // Disable body scroll when modal is open
    useEffect(() => {
        const scrollY = window.scrollY;

        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';

        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, scrollY);
        };
    }, []);

    // Clear errors when form visibility changes
    useEffect(() => {
        if (!showAddForm) {
            clearErrors();
            setFormErrors({});
        }
    }, [showAddForm, clearErrors]);

    const handleClose = () => {
        onClose();
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!formData.label?.trim()) errors.label = 'Address label is required';
        if (!formData.addressLine1?.trim()) errors.addressLine1 = 'Address line 1 is required';
        if (!formData.city?.trim()) errors.city = 'City is required';
        if (!formData.state?.trim()) errors.state = 'State/Province is required';
        if (!formData.postalCode?.trim()) errors.postalCode = 'Postal code is required';

        // Postal code validation (5 digits)
        if (formData.postalCode && !/^\d{5}$/.test(formData.postalCode)) {
            errors.postalCode = 'Postal code should be 5 digits';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleAddAddress = () => {
        // Check address limit
        if (addresses.length >= 5) {
            setFormErrors({
                general: 'Maximum address limit reached. You can only have up to 5 addresses.'
            });
            return;
        }

        setFormData({
            label: 'Home',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'Sri Lanka',
            isDefault: addresses.length === 0
        });
        setEditingAddress(null);
        setShowAddForm(true);
        setFormErrors({});
    };

    const handleEditAddress = (address: BackendAddress) => {
        setFormData({
            label: address.label,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2 || '',
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
            isDefault: address.isDefault
        });
        setEditingAddress(address);
        setShowAddForm(true);
        setFormErrors({});
    };

    const handleSaveAddress = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        setFormErrors({});

        try {
            if (editingAddress) {
                // Update existing address
                await updateAddressById(editingAddress.addressId, {
                    label: formData.label,
                    addressLine1: formData.addressLine1,
                    addressLine2: formData.addressLine2 || undefined,
                    city: formData.city,
                    state: formData.state,
                    postalCode: formData.postalCode,
                    country: formData.country
                });
            } else {
                // Create new address
                await addAddress({
                    label: formData.label,
                    addressLine1: formData.addressLine1,
                    addressLine2: formData.addressLine2 || undefined,
                    city: formData.city,
                    state: formData.state,
                    postalCode: formData.postalCode,
                    country: formData.country,
                    isDefault: formData.isDefault
                });
            }

            setShowAddForm(false);
            setEditingAddress(null);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to save address';
            if (errorMessage.includes('Maximum address limit')) {
                setFormErrors({ general: errorMessage });
            } else {
                setFormErrors({ general: errorMessage });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteAddress = async (addressId: string) => {
        if (addresses.length <= 1) {
            return; // Don't allow deleting the last address
        }

        setLoadingAction({ addressId, action: 'delete' });
        try {
            await removeAddress(addressId);
        } catch (error) {
            console.error('Failed to delete address:', error);
        } finally {
            setLoadingAction(null);
        }
    };

    const handleSetDefault = async (addressId: string) => {
        setLoadingAction({ addressId, action: 'setDefault' });
        try {
            await setAsDefault(addressId);
        } catch (error) {
            console.error('Failed to set default address:', error);
        } finally {
            setLoadingAction(null);
        }
    };

    const handleSelectAddress = (address: BackendAddress) => {
        onAddressSelect?.(address);
        handleClose();
    };

    const getAddressTypeIcon = (label: string) => {
        const lowerLabel = label.toLowerCase();
        if (lowerLabel.includes('home')) return <Home className="w-4 h-4" />;
        if (lowerLabel.includes('office') || lowerLabel.includes('work')) return <Briefcase className="w-4 h-4" />;
        return <MapPin className="w-4 h-4" />;
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const getUserDisplayName = () => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName} ${user.lastName}`;
        }
        return user?.email || 'User';
    };

    return (
        <div
            className="fixed inset-0 bg-transparent backdrop-blur-md bg-opacity-75 flex items-end sm:items-center justify-center p-0 sm:p-4 z-[60]"
            onClick={handleBackdropClick}
        >
            <div className="bg-white w-full h-full sm:h-auto sm:max-h-[85vh] sm:min-h-[60vh] sm:rounded-2xl sm:shadow-2xl sm:w-full sm:max-w-4xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-4 sm:p-6 border-b flex items-center justify-between flex-shrink-0 bg-white" style={{ borderColor: solarTheme.primary[200] }}>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                            {showAddForm ? (editingAddress ? 'Edit Address' : 'Add Address') : 'Manage Addresses'}
                        </h2>
                        <p className="text-gray-600 text-xs sm:text-sm mt-1">
                            {showAddForm ? 'Fill in the address details' : 'Select or manage your addresses'}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors ml-2 flex-shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <div
                        className={`p-4 sm:p-6 space-y-4 sm:space-y-6 ${showAddForm ? 'pb-24 sm:pb-6' : 'pb-6'
                            }`}
                    >
                        {/* Loading State - Skeleton */}
                        {addressesLoading && !isInitialized && (
                            <div className="space-y-3 sm:space-y-4">
                                {[1, 2].map((index) => (
                                    <div
                                        key={index}
                                        className="border rounded-lg sm:rounded-xl p-4 sm:p-6 animate-pulse"
                                        style={{ borderColor: solarTheme.primary[200] }}
                                    >
                                        <div className="flex flex-col gap-3 sm:gap-4">
                                            {/* Header Skeleton */}
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                                                        <div className="h-4 bg-gray-300 rounded w-32"></div>
                                                        <div className="h-6 bg-gray-300 rounded w-16"></div>
                                                    </div>

                                                    {/* Address Details Skeleton */}
                                                    <div className="space-y-2 mt-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 bg-gray-300 rounded"></div>
                                                            <div className="h-3 bg-gray-300 rounded w-28"></div>
                                                        </div>
                                                        <div className="flex items-start gap-2">
                                                            <div className="w-3 h-3 bg-gray-300 rounded mt-0.5"></div>
                                                            <div className="flex-1 space-y-1">
                                                                <div className="h-3 bg-gray-300 rounded w-full"></div>
                                                                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                                                                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons Skeleton */}
                                            <div className="flex gap-2 pt-2 border-t" style={{ borderColor: solarTheme.primary[100] }}>
                                                <div className="h-9 bg-gray-300 rounded-lg flex-1"></div>
                                                <div className="h-9 bg-gray-300 rounded-lg flex-1"></div>
                                                <div className="h-9 bg-gray-300 rounded-lg flex-1"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Error State */}
                        {addressesError && !showAddForm && (
                            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                                <div className="flex items-center gap-2 text-red-800">
                                    <AlertCircle className="w-5 h-5" />
                                    <span className="font-medium">Error loading addresses</span>
                                </div>
                                <p className="text-red-600 text-sm mt-1">{addressesError}</p>
                            </div>
                        )}

                        {!showAddForm && !addressesLoading ? (
                            <>
                                {/* Add New Address Button */}
                                <button
                                    onClick={handleAddAddress}
                                    disabled={addresses.length >= 5}
                                    className={`w-full p-3 sm:p-4 border-2 border-dashed rounded-lg sm:rounded-xl flex items-center justify-center gap-2 transition-all duration-200 ${
                                        addresses.length >= 5
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:border-solid'
                                    }`}
                                    style={{
                                        borderColor: solarTheme.primary[300],
                                        color: solarTheme.primary[600]
                                    }}
                                >
                                    <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
                                    <span className="font-semibold text-sm sm:text-base">
                                        {addresses.length >= 5 ? 'Maximum Addresses Reached (5/5)' : 'Add New Address'}
                                    </span>
                                </button>

                                {/* Address count info */}
                                {addresses.length > 0 && (
                                    <div className="text-sm text-gray-600 text-center">
                                        {addresses.length} of 5 addresses
                                    </div>
                                )}

                                {/* Address List */}
                                <div className="space-y-3 sm:space-y-4">
                                    {addresses.map((address) => (
                                        <div
                                            key={address.addressId}
                                            className="border rounded-lg sm:rounded-xl p-4 sm:p-6 transition-all duration-200 hover:shadow-lg"
                                            style={{ borderColor: solarTheme.primary[200] }}
                                        >
                                            <div className="flex flex-col gap-3 sm:gap-4">
                                                {/* Address Header */}
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleSelectAddress(address)}>
                                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                            <div style={{ color: solarTheme.primary[600] }}>
                                                                {getAddressTypeIcon(address.label)}
                                                            </div>
                                                            <span className="font-bold text-gray-900 text-sm sm:text-base truncate">
                                                                {getUserDisplayName()}
                                                            </span>
                                                            <span className="text-xs px-2 py-1 rounded-full flex-shrink-0" style={{
                                                                backgroundColor: solarTheme.secondary[100],
                                                                color: solarTheme.secondary[700]
                                                            }}>
                                                                {address.label}
                                                            </span>
                                                            {address.isDefault && (
                                                                <span className="text-xs px-2 py-1 rounded-full text-white flex items-center gap-1 flex-shrink-0" style={{
                                                                    backgroundColor: solarTheme.primary[600]
                                                                }}>
                                                                    <Star className="w-2 sm:w-3 h-2 sm:h-3 fill-current" />
                                                                    <span className="hidden sm:inline">Default</span>
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Address Details */}
                                                        <div className="text-xs sm:text-sm text-gray-700 space-y-1">
                                                            {user?.phone && (
                                                                <div className="flex items-center gap-2">
                                                                    <Phone className="w-3 h-3 flex-shrink-0" />
                                                                    <span className="truncate">{user.phone}</span>
                                                                </div>
                                                            )}
                                                            <div className="flex items-start gap-2">
                                                                <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="truncate">{address.addressLine1}</div>
                                                                    {address.addressLine2 && <div className="truncate">{address.addressLine2}</div>}
                                                                    <div className="truncate">{address.city}, {address.state} {address.postalCode}</div>
                                                                    <div className="truncate">{address.country}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2 pt-2 border-t" style={{ borderColor: solarTheme.primary[100] }}>
                                                    {!address.isDefault && (
                                                        <button
                                                            onClick={() => handleSetDefault(address.addressId)}
                                                            disabled={loadingAction?.addressId === address.addressId && loadingAction?.action === 'setDefault'}
                                                            className="flex items-center gap-1 px-3 py-2 text-xs sm:text-sm border rounded-lg transition-colors hover:bg-gray-50 flex-1 justify-center disabled:opacity-50"
                                                            style={{ borderColor: solarTheme.primary[300], color: solarTheme.primary[600] }}
                                                        >
                                                            {loadingAction?.addressId === address.addressId && loadingAction?.action === 'setDefault' ? (
                                                                <Loader2 className="w-3 sm:w-4 h-3 sm:h-4 animate-spin" />
                                                            ) : (
                                                                <Star className="w-3 sm:w-4 h-3 sm:h-4" />
                                                            )}
                                                            <span>Set Default</span>
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => handleEditAddress(address)}
                                                        className="flex items-center gap-1 px-3 py-2 text-xs sm:text-sm border rounded-lg transition-colors hover:bg-gray-50 flex-1 justify-center"
                                                        style={{ borderColor: solarTheme.secondary[300], color: solarTheme.secondary[600] }}
                                                    >
                                                        <Edit3 className="w-3 sm:w-4 h-3 sm:h-4" />
                                                        <span>Edit</span>
                                                    </button>

                                                    {addresses.length > 1 && (
                                                        <button
                                                            onClick={() => handleDeleteAddress(address.addressId)}
                                                            disabled={loadingAction?.addressId === address.addressId && loadingAction?.action === 'delete'}
                                                            className="flex items-center gap-1 px-3 py-2 text-xs sm:text-sm border rounded-lg transition-colors hover:bg-red-50 flex-1 justify-center disabled:opacity-50"
                                                            style={{ borderColor: '#fca5a5', color: '#dc2626' }}
                                                        >
                                                            {loadingAction?.addressId === address.addressId && loadingAction?.action === 'delete' ? (
                                                                <Loader2 className="w-3 sm:w-4 h-3 sm:h-4 animate-spin" />
                                                            ) : (
                                                                <Trash2 className="w-3 sm:w-4 h-3 sm:h-4" />
                                                            )}
                                                            <span>Delete</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : showAddForm && (
                            /* Add/Edit Form */
                            <div className="space-y-4 sm:space-y-6">
                                {/* Back Button - Mobile Only */}
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="sm:hidden flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
                                >
                                    <X className="w-4 h-4" />
                                    <span className="text-sm">Back to addresses</span>
                                </button>

                                {/* Form Errors */}
                                {(formErrors.general || addressError) && (
                                    <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                                        <div className="flex items-center gap-2 text-red-800">
                                            <AlertCircle className="w-5 h-5" />
                                            <span className="font-medium">Error</span>
                                        </div>
                                        <p className="text-red-600 text-sm mt-1">{formErrors.general || addressError}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                                    {/* Address Label */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Building className="w-3 sm:w-4 h-3 sm:h-4 inline mr-1" />
                                            Address Label *
                                        </label>
                                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                            {['Home', 'Office', 'Other'].map((labelOption) => (
                                                <label key={labelOption} className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg transition-colors" style={{
                                                    borderColor: formData.label === labelOption ? solarTheme.primary[300] : '#e5e7eb',
                                                    backgroundColor: formData.label === labelOption ? solarTheme.primary[50] : 'white'
                                                }}>
                                                    <input
                                                        type="radio"
                                                        name="addressLabel"
                                                        value={labelOption}
                                                        checked={formData.label === labelOption}
                                                        onChange={(e) => handleInputChange('label', e.target.value)}
                                                        className="text-primary-600 focus:ring-primary-500"
                                                    />
                                                    <div className="flex items-center gap-1">
                                                        {getAddressTypeIcon(labelOption)}
                                                        <span className="text-sm">{labelOption}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Address Line 1 */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <MapPin className="w-3 sm:w-4 h-3 sm:h-4 inline mr-1" />
                                            Address Line 1 *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.addressLine1}
                                            onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                                            className="w-full px-3 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm sm:text-base"
                                            style={{
                                                borderColor: formErrors.addressLine1 ? '#dc2626' : solarTheme.primary[300]
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.boxShadow = `0 0 0 2px ${solarTheme.primary[500]}`;
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.boxShadow = '';
                                            }}
                                            placeholder="Street address, house number"
                                        />
                                        {formErrors.addressLine1 && (
                                            <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                                {formErrors.addressLine1}
                                            </p>
                                        )}
                                    </div>

                                    {/* Address Line 2 */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address Line 2 (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.addressLine2}
                                            onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                                            className="w-full px-3 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm sm:text-base"
                                            style={{
                                                borderColor: solarTheme.primary[300]
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.boxShadow = `0 0 0 2px ${solarTheme.primary[500]}`;
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.boxShadow = '';
                                            }}
                                            placeholder="Apartment, suite, floor (optional)"
                                        />
                                    </div>

                                    {/* City & Province Row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* City */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.city}
                                                onChange={(e) => handleInputChange('city', e.target.value)}
                                                className="w-full px-3 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm sm:text-base"
                                                style={{
                                                    borderColor: formErrors.city ? '#dc2626' : solarTheme.primary[300]
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.boxShadow = `0 0 0 2px ${solarTheme.primary[500]}`;
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.boxShadow = '';
                                                }}
                                                placeholder="Enter city"
                                            />
                                            {formErrors.city && (
                                                <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                                    {formErrors.city}
                                                </p>
                                            )}
                                        </div>

                                        {/* State/Province */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Province *
                                            </label>
                                            <select
                                                value={formData.state}
                                                onChange={(e) => handleInputChange('state', e.target.value)}
                                                className="w-full px-3 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm sm:text-base"
                                                style={{
                                                    borderColor: formErrors.state ? '#dc2626' : solarTheme.primary[300]
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.boxShadow = `0 0 0 2px ${solarTheme.primary[500]}`;
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.boxShadow = '';
                                                }}
                                            >
                                                <option value="">Select Province</option>
                                                {sriLankanStates.map((state) => (
                                                    <option key={state} value={state}>{state}</option>
                                                ))}
                                            </select>
                                            {formErrors.state && (
                                                <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                                    {formErrors.state}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Postal Code & Country Row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Postal Code */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Postal Code *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.postalCode}
                                                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                                className="w-full px-3 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm sm:text-base"
                                                style={{
                                                    borderColor: formErrors.postalCode ? '#dc2626' : solarTheme.primary[300]
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.boxShadow = `0 0 0 2px ${solarTheme.primary[500]}`;
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.boxShadow = '';
                                                }}
                                                placeholder="12345"
                                                maxLength={5}
                                            />
                                            {formErrors.postalCode && (
                                                <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                                    {formErrors.postalCode}
                                                </p>
                                            )}
                                        </div>

                                        {/* Country */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Country *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.country}
                                                onChange={(e) => handleInputChange('country', e.target.value)}
                                                className="w-full px-3 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors bg-gray-50 text-sm sm:text-base"
                                                style={{
                                                    borderColor: solarTheme.primary[300]
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.boxShadow = `0 0 0 2px ${solarTheme.primary[500]}`;
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.boxShadow = '';
                                                }}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions - Fixed on Mobile, Relative on Desktop */}
                {showAddForm && (
                    <div className="fixed bottom-0 left-0 right-0 sm:relative bg-white p-4 sm:p-6 border-t shadow-lg sm:shadow-none flex-shrink-0 z-10" style={{ borderColor: solarTheme.primary[200] }}>
                        <div className="flex gap-3 max-w-4xl mx-auto">
                            <button
                                onClick={() => setShowAddForm(false)}
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-3 border rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base disabled:opacity-50"
                                style={{ borderColor: solarTheme.primary[300] }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveAddress}
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-3 rounded-lg font-bold text-white transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:hover:scale-100"
                                style={{
                                    background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[500]})`
                                }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" />
                                        {editingAddress ? 'Update' : 'Save'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
