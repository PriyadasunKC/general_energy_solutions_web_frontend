// src/lib/redux-hooks.ts
// Enhanced typed hooks for Redux usage throughout the app
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@/store/store'

// Basic typed hooks
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

// Enhanced selectors with better performance
import { createSelector } from '@reduxjs/toolkit'

// Auth selectors
export const useAuthState = () => useAppSelector(state => state.auth)
export const useIsAuthenticated = () => useAppSelector(state => state.auth.isAuthenticated)
export const useCurrentUser = () => useAppSelector(state => state.auth.user)
export const useAuthLoading = () => useAppSelector(state => state.auth.isLoading)
export const useAuthError = () => useAppSelector(state => state.auth.error)

// Products selectors
export const useProductsState = () => useAppSelector(state => state.products)
export const useProductsList = () => useAppSelector(state => state.products.products)
export const useCurrentProduct = () => useAppSelector(state => state.products.currentProduct)
export const useProductsLoading = () => useAppSelector(state => state.products.productsLoading)
export const useProductsError = () => useAppSelector(state => state.products.productsError)

// Categories selectors  
export const useCategoriesList = () => useAppSelector(state => state.products.categories)
export const useCurrentCategory = () => useAppSelector(state => state.products.currentCategory)
export const useCategoriesLoading = () => useAppSelector(state => state.products.categoriesLoading)
export const useCategoriesError = () => useAppSelector(state => state.products.categoriesError)

// Packages selectors
export const usePackagesState = () => useAppSelector(state => state.packages)
export const usePackagesList = () => useAppSelector(state => state.packages.packages)
export const useCurrentPackage = () => useAppSelector(state => state.packages.currentPackage)
export const usePackagesLoading = () => useAppSelector(state => state.packages.packagesLoading)
export const usePackagesError = () => useAppSelector(state => state.packages.packagesError)

// Package items selectors
export const usePackageItems = () => useAppSelector(state => state.packages.packageItems)
export const usePackageItemsLoading = () => useAppSelector(state => state.packages.packageItemsLoading)
export const usePackageItemsError = () => useAppSelector(state => state.packages.packageItemsError)

// User/Cart selectors
export const useUserState = () => useAppSelector(state => state.user)
export const useCart = () => useAppSelector(state => state.user.cart)
export const useCartItems = () => useAppSelector(state => state.user.cart?.items || [])
export const useCartLoading = () => useAppSelector(state => state.user.cartLoading)
export const useCartError = () => useAppSelector(state => state.user.cartError)
export const useCartTotals = () => useAppSelector(state => state.user.cartTotals)
export const useCartItemCount = () => useAppSelector(state => state.user.cart?.total_items || 0)
export const useCartSidebarOpen = () => useAppSelector(state => state.user.cartSidebarOpen)

// Media selectors
export const useMediaState = () => useAppSelector(state => state.media)
export const useMediaFiles = () => useAppSelector(state => state.media.mediaFiles)
export const useMediaLoading = () => useAppSelector(state => state.media.mediaLoading)
export const useMediaError = () => useAppSelector(state => state.media.mediaError)
export const useUploading = () => useAppSelector(state => state.media.uploading)
export const useUploadError = () => useAppSelector(state => state.media.uploadError)
export const useSelectedFiles = () => useAppSelector(state => state.media.selectedFiles)
export const useDragActive = () => useAppSelector(state => state.media.dragActive)

// Memoized selectors for better performance
export const useFeaturedProducts = () => useAppSelector(
    createSelector(
        (state: RootState) => state.products.products,
        (products) => products.filter(product => product.is_featured)
    )
)

export const useAvailableProducts = () => useAppSelector(
    createSelector(
        (state: RootState) => state.products.products,
        (products) => products.filter(product => product.is_available && !product.is_deleted && product.quantity_available > 0)
    )
)

export const useFeaturedPackages = () => useAppSelector(
    createSelector(
        (state: RootState) => state.packages.packages,
        (packages) => packages.filter(pkg => pkg.is_featured)
    )
)

export const useAvailablePackages = () => useAppSelector(
    createSelector(
        (state: RootState) => state.packages.packages,
        (packages) => packages.filter(pkg => pkg.is_available && !pkg.is_deleted && pkg.quantity_available > 0)
    )
)

export const useImageFiles = () => useAppSelector(
    createSelector(
        (state: RootState) => state.media.mediaFiles,
        (files) => files.filter(file => file.resource_type === 'image')
    )
)

export const useVideoFiles = () => useAppSelector(
    createSelector(
        (state: RootState) => state.media.mediaFiles,
        (files) => files.filter(file => file.resource_type === 'video')
    )
)

// Utility selectors
export const useIsCartEmpty = () => useAppSelector(
    createSelector(
        (state: RootState) => state.user.cart?.items,
        (items) => !items || items.length === 0
    )
)

export const useEnabledCategories = () => useAppSelector(
    createSelector(
        (state: RootState) => state.products.categories,
        (categories) => categories.filter(category => category.is_enable)
    )
)

// Complex selectors with parameters
export const useProductsByCategory = (categoryId: string) => useAppSelector(
    createSelector(
        (state: RootState) => state.products.products,
        (products) => products.filter(product =>
            product.categories.some(category => category.category_id === categoryId)
        )
    )
)

export const useCartItemByProductId = (productId: string) => useAppSelector(
    createSelector(
        (state: RootState) => state.user.cart?.items || [],
        (items) => items.find(item => item.product_id === productId) || null
    )
)

export const useIsProductInCart = (productId: string) => useAppSelector(
    createSelector(
        (state: RootState) => state.user.cart?.items || [],
        (items) => items.some(item => item.product_id === productId)
    )
)

// Loading state selectors
export const useIsAnyLoading = () => useAppSelector(
    createSelector(
        (state: RootState) => state.auth.isLoading,
        (state: RootState) => state.products.productsLoading,
        (state: RootState) => state.products.productLoading,
        (state: RootState) => state.packages.packagesLoading,
        (state: RootState) => state.packages.packageLoading,
        (state: RootState) => state.user.cartLoading,
        (state: RootState) => state.media.mediaLoading,
        (state: RootState) => state.media.uploading,
        (...loadingStates) => loadingStates.some(Boolean)
    )
)

// Error state selectors
export const useHasAnyError = () => useAppSelector(
    createSelector(
        (state: RootState) => state.auth.error,
        (state: RootState) => state.products.productsError,
        (state: RootState) => state.products.productError,
        (state: RootState) => state.packages.packagesError,
        (state: RootState) => state.packages.packageError,
        (state: RootState) => state.user.cartError,
        (state: RootState) => state.media.mediaError,
        (...errors) => errors.some(Boolean)
    )
)

// Initialization state selectors
export const useIsAppInitialized = () => useAppSelector(
    createSelector(
        (state: RootState) => state.auth.isInitialized,
        (state: RootState) => state.products.isInitialized,
        (state: RootState) => state.packages.isInitialized,
        (state: RootState) => state.user.isCartInitialized,
        (state: RootState) => state.media.isInitialized,
        (authInit, productsInit, packagesInit, cartInit, mediaInit) =>
            authInit && productsInit && packagesInit && cartInit && mediaInit
    )
)

// Export all hooks for convenience
export {
    useDispatch,
    useSelector,
} from 'react-redux'

export type {
    RootState,
    AppDispatch,
} from '@/store/store'