/* ===== REDUX STORE CONFIGURATION ===== */
/* Central Redux store combining all feature slices */
/* Configured with Redux Toolkit for optimal performance */

import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import cartReducer from '../features/cart/cartSlice'
import productReducer from '../features/products/productSlice'
import orderReducer from '../features/orders/orderSlice'
import adminReducer from '../features/admin/adminSlice'
import uiReducer from '../features/ui/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    orders: orderReducer,
    admin: adminReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for non-serializable payloads
        ignoredActions: [
          'auth/login/fulfilled',
          'auth/register/fulfilled',
          'cart/addItemToCart/fulfilled',
        ],
      },
    }),
})

export default store
