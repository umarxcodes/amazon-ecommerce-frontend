import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
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
  items: persistedCart,
  shippingAddress: {
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
      return thunkApi.rejectWithValue(
        getErrorMessage(err, 'Unable to add to cart')
      )
    }
  }
)

export const updateItemQuantity = createAsyncThunk(
  'cart/updateItemQuantity',
  async (payload, thunkApi) => {
    try {
      return await updateCartItemAPI(payload)
    } catch (err) {
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
      saveCart(state.items)
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      )
      saveCart(state.items)
    },
    updateCartQuantity(state, action) {
      const { productId, quantity } = action.payload
      const item = state.items.find((i) => i.productId === productId)
      if (item) {
        item.quantity = Math.max(1, quantity)
      }
      saveCart(state.items)
    },
    clearCart(state) {
      state.items = []
      saveCart([])
    },
    setShippingAddress(state, action) {
      state.shippingAddress = { ...state.shippingAddress, ...action.payload }
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
        state.items = action.payload?.items || []
      })
      .addCase(addItemToCart.pending, pending())
      .addCase(addItemToCart.rejected, rejected())
      .addCase(addItemToCart.fulfilled, (state, action) => {
        fulfilled()(state)
        state.items = action.payload?.items || state.items
      })
      .addCase(updateItemQuantity.pending, pending())
      .addCase(updateItemQuantity.rejected, rejected())
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        fulfilled()(state)
        state.items = action.payload?.items || state.items
      })
      .addCase(removeItem.pending, pending())
      .addCase(removeItem.rejected, rejected())
      .addCase(removeItem.fulfilled, (state, action) => {
        fulfilled()(state)
        state.items = action.payload?.items || state.items
      })
      .addCase(clearBackendCart.pending, pending())
      .addCase(clearBackendCart.rejected, rejected())
      .addCase(clearBackendCart.fulfilled, (state) => {
        fulfilled()(state)
        state.items = []
        saveCart([])
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

export const selectCartItems = (s) => s.cart.items
export const selectShippingAddress = (s) => s.cart.shippingAddress
export const selectCartStatus = (s) => s.cart.status
export const selectCheckoutStatus = (s) => s.cart.checkoutStatus
export const selectCartError = (s) => s.cart.error
export const selectCartCount = (s) =>
  s.cart.items.reduce((t, i) => t + i.quantity, 0)
export const selectCartTotal = (s) =>
  s.cart.items.reduce((t, i) => t + i.price * i.quantity, 0)
