/* ===== SHOPPING CART SLICE ===== */
/* Manages cart items, shipping address, and checkout flow */
/* Syncs local cart with backend on authentication */

import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit'
import {
  fetchCartAPI,
  addToCartAPI,
  updateCartItemAPI,
  removeCartItemAPI,
  clearCartAPI,
  syncCartAPI,
  createCheckoutSessionAPI,
} from './cartAPI'
import { getErrorMessage, loadCart, saveCart } from '../../utils/helpers'
import { fulfilled, pending, rejected } from '../../app/sliceHelpers'

const persistedCart = loadCart()

const initialState = {
  items: persistedCart?.items || persistedCart || [],
  shippingAddress: persistedCart?.shippingAddress || {
    fullName: '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
  },
  status: 'idle',
  checkoutStatus: 'idle',
  error: null,
}

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, thunkApi) => {
    try {
      return await fetchCartAPI()
    } catch (err) {
      return thunkApi.rejectWithValue(
        getErrorMessage(err, 'Unable to fetch cart')
      )
    }
  }
)

export const addItemToCart = createAsyncThunk(
  'cart/addItemToCart',
  async (payload, thunkApi) => {
    try {
      return await addToCartAPI(payload)
    } catch (err) {
      // Handle stock validation errors
      if (err.response?.status === 400) {
        const msg = getErrorMessage(err, 'Unable to add to cart')
        if (
          msg.toLowerCase().includes('stock') ||
          msg.toLowerCase().includes('quantity')
        ) {
          return thunkApi.rejectWithValue(msg)
        }
      }
      return thunkApi.rejectWithValue(
        getErrorMessage(err, 'Unable to add to cart')
      )
    }
  }
)

export const updateItemQuantity = createAsyncThunk(
  'cart/updateItemQuantity',
  async ({ productId, quantity }, thunkApi) => {
    try {
      return await updateCartItemAPI({ productId, quantity })
    } catch (err) {
      // Handle stock validation — quantity exceeds stock
      if (err.response?.status === 400) {
        const msg = getErrorMessage(err, 'Unable to update cart')
        return thunkApi.rejectWithValue(msg)
      }
      return thunkApi.rejectWithValue(
        getErrorMessage(err, 'Unable to update cart')
      )
    }
  }
)

export const removeItem = createAsyncThunk(
  'cart/removeItem',
  async (productId, thunkApi) => {
    try {
      return await removeCartItemAPI(productId)
    } catch (err) {
      return thunkApi.rejectWithValue(
        getErrorMessage(err, 'Unable to remove item')
      )
    }
  }
)

export const clearBackendCart = createAsyncThunk(
  'cart/clearBackendCart',
  async (_, thunkApi) => {
    try {
      return await clearCartAPI()
    } catch (err) {
      // If bulk delete endpoint doesn't exist, fall through gracefully
      // The local state will still be cleared in the fulfilled handler
      if (err.response?.status === 404 || err.response?.status === 405) {
        return { success: true }
      }
      return thunkApi.rejectWithValue(
        getErrorMessage(err, 'Unable to clear cart')
      )
    }
  }
)

export const syncCart = createAsyncThunk(
  'cart/syncCart',
  async (_, thunkApi) => {
    try {
      return await syncCartAPI({ items: thunkApi.getState().cart.items })
    } catch (err) {
      return thunkApi.rejectWithValue(
        getErrorMessage(err, 'Unable to sync cart')
      )
    }
  }
)

export const createCheckoutSession = createAsyncThunk(
  'cart/createCheckoutSession',
  async (_, thunkApi) => {
    try {
      const { items, shippingAddress } = thunkApi.getState().cart
      return await createCheckoutSessionAPI({ items, shippingAddress })
    } catch (err) {
      return thunkApi.rejectWithValue(
        getErrorMessage(err, 'Unable to start checkout')
      )
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const incoming = action.payload
      const existing = state.items.find(
        (item) => item.productId === incoming.productId
      )
      if (existing) {
        existing.quantity += incoming.quantity || 1
      } else {
        state.items.push({ ...incoming, quantity: incoming.quantity || 1 })
      }
      saveCart({ items: state.items, shippingAddress: state.shippingAddress })
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      )
      saveCart({ items: state.items, shippingAddress: state.shippingAddress })
    },
    updateCartQuantity(state, action) {
      const { productId, quantity } = action.payload
      const item = state.items.find((i) => i.productId === productId)
      if (item) {
        item.quantity = Math.max(1, quantity)
      }
      saveCart({ items: state.items, shippingAddress: state.shippingAddress })
    },
    clearCart(state) {
      state.items = []
      saveCart({ items: [], shippingAddress: state.shippingAddress })
    },
    setShippingAddress(state, action) {
      state.shippingAddress = { ...state.shippingAddress, ...action.payload }
      saveCart({ items: state.items, shippingAddress: state.shippingAddress })
    },
    resetCartStatus(state) {
      state.status = 'idle'
      state.checkoutStatus = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncCart.pending, pending())
      .addCase(syncCart.fulfilled, fulfilled())
      .addCase(syncCart.rejected, rejected())
      .addCase(createCheckoutSession.pending, pending('checkoutStatus'))
      .addCase(createCheckoutSession.fulfilled, fulfilled('checkoutStatus'))
      .addCase(createCheckoutSession.rejected, rejected('checkoutStatus'))
      .addCase(fetchCart.pending, pending())
      .addCase(fetchCart.rejected, rejected())
      .addCase(fetchCart.fulfilled, (state, action) => {
        fulfilled()(state)
        const payload = action.payload
        state.items =
          payload?.items ??
          payload?.data?.items ??
          payload?.cart?.items ??
          payload?.data ??
          payload?.cart ??
          []
        if (!Array.isArray(state.items)) state.items = []
      })
      .addCase(addItemToCart.pending, pending())
      .addCase(addItemToCart.rejected, rejected())
      .addCase(addItemToCart.fulfilled, (state, action) => {
        fulfilled()(state)
        // Backend may return cart data in various formats — handle all
        const payload = action.payload
        const newItems =
          payload?.items ??
          payload?.data?.items ??
          payload?.cart?.items ??
          payload?.data ??
          payload?.cart ??
          payload
        if (Array.isArray(newItems)) {
          state.items = newItems
        }
      })
      .addCase(updateItemQuantity.pending, pending())
      .addCase(updateItemQuantity.rejected, rejected())
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        fulfilled()(state)
        const payload = action.payload
        const newItems =
          payload?.items ??
          payload?.data?.items ??
          payload?.cart?.items ??
          payload?.data ??
          payload?.cart ??
          payload
        if (Array.isArray(newItems)) {
          state.items = newItems
        }
      })
      .addCase(removeItem.pending, pending())
      .addCase(removeItem.rejected, rejected())
      .addCase(removeItem.fulfilled, (state, action) => {
        fulfilled()(state)
        const payload = action.payload
        const newItems =
          payload?.items ??
          payload?.data?.items ??
          payload?.cart?.items ??
          payload?.data ??
          payload?.cart ??
          payload
        if (Array.isArray(newItems)) {
          state.items = newItems
        }
      })
      .addCase(clearBackendCart.pending, pending())
      .addCase(clearBackendCart.rejected, rejected())
      .addCase(clearBackendCart.fulfilled, (state, action) => {
        fulfilled()(state)
        // Always clear items regardless of response shape
        state.items = []
        saveCart({ items: [], shippingAddress: state.shippingAddress })
      })
  },
})

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  setShippingAddress,
  resetCartStatus,
} = cartSlice.actions
export default cartSlice.reducer

// Memoized selectors
const selectCartState = (s) => s.cart
export const selectCartItems = createSelector(
  [selectCartState],
  (cart) => cart.items
)
export const selectShippingAddress = createSelector(
  [selectCartState],
  (cart) => cart.shippingAddress
)
export const selectCartStatus = createSelector(
  [selectCartState],
  (cart) => cart.status
)
export const selectCheckoutStatus = createSelector(
  [selectCartState],
  (cart) => cart.checkoutStatus
)
export const selectCartError = createSelector(
  [selectCartState],
  (cart) => cart.error
)
export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((t, i) => t + (i.quantity || 0), 0)
)
export const selectCartTotal = createSelector([selectCartItems], (items) =>
  items.reduce((t, i) => t + (i.price || 0) * (i.quantity || 0), 0)
)
