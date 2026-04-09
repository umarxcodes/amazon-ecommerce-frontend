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

// Fetch cart from backend (call on app load if user is logged in)
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, thunkApi) => {
    try {
      return await fetchCartAPI()
    } catch (error) {
      return thunkApi.rejectWithValue(
        getErrorMessage(error, 'Unable to fetch cart')
      )
    }
  }
)

// Add item to backend cart
export const addItemToCart = createAsyncThunk(
  'cart/addItemToCart',
  async (payload, thunkApi) => {
    try {
      return await addToCartAPI(payload)
    } catch (error) {
      return thunkApi.rejectWithValue(
        getErrorMessage(error, 'Unable to add to cart')
      )
    }
  }
)

// Update quantity in backend cart
export const updateItemQuantity = createAsyncThunk(
  'cart/updateItemQuantity',
  async (payload, thunkApi) => {
    try {
      return await updateCartItemAPI(payload)
    } catch (error) {
      return thunkApi.rejectWithValue(
        getErrorMessage(error, 'Unable to update cart')
      )
    }
  }
)

// Remove item from backend cart
export const removeItem = createAsyncThunk(
  'cart/removeItem',
  async (productId, thunkApi) => {
    try {
      return await removeCartItemAPI(productId)
    } catch (error) {
      return thunkApi.rejectWithValue(
        getErrorMessage(error, 'Unable to remove item')
      )
    }
  }
)

// Clear backend cart
export const clearBackendCart = createAsyncThunk(
  'cart/clearBackendCart',
  async (_, thunkApi) => {
    try {
      return await clearCartAPI()
    } catch (error) {
      return thunkApi.rejectWithValue(
        getErrorMessage(error, 'Unable to clear cart')
      )
    }
  }
)

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
      // syncCart
      .addCase(syncCart.pending, pending())
      .addCase(syncCart.fulfilled, fulfilled())
      .addCase(syncCart.rejected, rejected())
      // createCheckoutSession
      .addCase(createCheckoutSession.pending, pending('checkoutStatus'))
      .addCase(createCheckoutSession.fulfilled, fulfilled('checkoutStatus'))
      .addCase(createCheckoutSession.rejected, rejected('checkoutStatus'))
      // fetchCart
      .addCase(fetchCart.pending, pending())
      .addCase(fetchCart.rejected, rejected())
      .addCase(fetchCart.fulfilled, (state, action) => {
        fulfilled()(state)
        state.items = action.payload?.items || []
      })
      // addItemToCart
      .addCase(addItemToCart.pending, pending())
      .addCase(addItemToCart.rejected, rejected())
      .addCase(addItemToCart.fulfilled, (state, action) => {
        fulfilled()(state)
        state.items = action.payload?.items || state.items
      })
      // updateItemQuantity
      .addCase(updateItemQuantity.pending, pending())
      .addCase(updateItemQuantity.rejected, rejected())
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        fulfilled()(state)
        state.items = action.payload?.items || state.items
      })
      // removeItem
      .addCase(removeItem.pending, pending())
      .addCase(removeItem.rejected, rejected())
      .addCase(removeItem.fulfilled, (state, action) => {
        fulfilled()(state)
        state.items = action.payload?.items || state.items
      })
      // clearBackendCart
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
