// src/hooks/index.ts
// Central export file for all Redux hooks

// Auth hooks
export { default as useAuth, useAuthStatus, useUser, useProtectedRoute } from './useAuth';

// Product hooks
export {
    default as useProducts,
    useProductsOnly,
    useCategoriesOnly,
    useCurrentProduct,
    useCurrentCategory
} from './productHook';

// Package hooks
export {
    default as usePackages,
    usePackagesOnly,
    useCurrentPackage,
    usePackageItems
} from './packageHook';

// User/Cart hooks
export {
    useCart,
    useCartState,
    useCartSidebar,
    useProductCartStatus
} from './userHook';

// Media hooks
export {
    default as useMedia,
    useMediaState,
    useUploadProgress,
    useFileSelection,
    useImageMedia
} from './mediaHook';

// Address hooks
export {
    default as useAddresses,
    useDefaultAddress,
    useCurrentAddress
} from './addressHook';

// Order hooks
export {
    default as useOrders,
    useCurrentOrder,
    useOrderPagination
} from './orderHook';

// Package order hooks
export {
    default as usePackageOrders,
    useCurrentOrder as useCurrentPackageOrder
} from './packageOrderHook';

// Redux utility hooks
export * from '../lib/redux-hooks';

// Re-export types for convenience
export type { UseAuthReturn } from '../types/authTypes';
export type { UseProductsReturn } from '../types/productTypes';
export type { UsePackagesReturn } from '../types/packageTypes';
export type { UseCartReturn } from '../types/userTypes';
export type { UseMediaReturn } from '../types/mediaTypes';
export type { UseAddressReturn } from '../types/addressTypes';
export type { UseOrderReturn } from '../types/orderTypes';