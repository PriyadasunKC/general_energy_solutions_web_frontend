/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import all slices
import authSlice from './slices/authSlice';
import productSlice from './slices/productSlice';
import packageSlice from './slices/packageSlice';
import packageOrderSlice from './slices/packageOrderSlice';
import userSlice from './slices/userSlice';
import mediaSlice from './slices/mediaSlice';
import addressSlice from './slices/addressSlice';
import orderSlice from './slices/orderSlice';

// Persist configuration
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'user'], // Only persist auth and user state (cart)
    blacklist: ['products', 'packages', 'media', 'addresses', 'orders'], // Don't persist these as they can be refetched
};

// Auth-specific persist config (more selective)
const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['user', 'accessToken', 'isAuthenticated', 'isInitialized'], // Persist essential auth data
    blacklist: ['isLoading', 'error'], // Don't persist loading states and errors
};

// User-specific persist config (for cart persistence)
const userPersistConfig = {
    key: 'user',
    storage,
    whitelist: ['cart', 'isCartInitialized'], // Persist cart data
    blacklist: ['cartLoading', 'cartError', 'addingToCart', 'updatingCartItem', 'removingFromCart', 'cartOperationError', 'cartSidebarOpen', 'recentlyAddedItem'], // Don't persist loading states, errors, and UI states
};

// Combine reducers with persistence
const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authSlice),
    products: productSlice, // Not persisted - will be refetched on app load
    packages: packageSlice, // Not persisted - will be refetched on app load
    packageOrders: packageOrderSlice, // Not persisted - will be refetched on app load
    user: persistReducer(userPersistConfig, userSlice),
    media: mediaSlice, // Not persisted - files can be re-uploaded if needed
    addresses: addressSlice, // Not persisted - will be refetched on app load
    orders: orderSlice, // Not persisted - will be refetched on app load
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    'persist/FLUSH',
                    'persist/REHYDRATE',
                    'persist/PAUSE',
                    'persist/PERSIST',
                    'persist/PURGE',
                    'persist/REGISTER',
                ],
                // Ignore these field paths in all actions
                ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
                // Ignore these paths in the state
                ignoredPaths: ['media.selectedFiles', 'media.previewUrls'],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Enhanced typed hooks with better typing
export const useAppDispatch = (): AppDispatch => store.dispatch;
export const useAppSelector = <T>(selector: (state: RootState) => T): T => selector(store.getState());

// Store initialization helper
export const initializeStore = async (): Promise<void> => {
    // Any store initialization logic can go here
    console.log('Store initialized with modules:', Object.keys(store.getState()));
};

// Store cleanup helper
export const cleanupStore = (): void => {
    // Cleanup any resources if needed
    persistor.purge();
};

// Development helpers
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    // Add development helpers
    (window as any).__STORE__ = store;
    (window as any).__PERSISTOR__ = persistor;
}

export default store;