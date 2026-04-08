import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createCheckoutSessionAPI, syncCartAPI } from './cartAPI'
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

export const syncCart = createAsyncThunk(
  'cart/syncCart',
  async (_, thunkApi) => {
    try {
      const items = thunkApi.getState().cart.items
      return await syncCartAPI({ items })
    } catch (error) {
      return thunkApi.rejectWithValue(
        getErrorMessage(error, 'Unable to sync cart')
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
    } catch (error) {
      return thunkApi.rejectWithValue(
        getErrorMessage(error, 'Unable to start checkout')
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
      const item = state.items.find(
        (cartItem) => cartItem.productId === productId
      )
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

// ─── Selectors ────────────────────────────────────────────
export const selectCartItems = (state) => state.cart.items
export const selectShippingAddress = (state) => state.cart.shippingAddress
export const selectCartStatus = (state) => state.cart.status
export const selectCheckoutStatus = (state) => state.cart.checkoutStatus
export const selectCartError = (state) => state.cart.error
export const selectCartCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0)
export const selectCartTotal = (state) =>
  state.cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
