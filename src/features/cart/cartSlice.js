import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createCheckoutSessionAPI, syncCartAPI } from './cartAPI'
import { getErrorMessage, loadCart, saveCart } from '../../utils/helpers'

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

export const syncCart = createAsyncThunk('cart/syncCart', async (_, thunkApi) => {
  try {
    const items = thunkApi.getState().cart.items
    return await syncCartAPI({ items })
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error, 'Unable to sync cart'))
  }
})

export const createCheckoutSession = createAsyncThunk(
  'cart/createCheckoutSession',
  async (_, thunkApi) => {
    try {
      const { items, shippingAddress } = thunkApi.getState().cart
      return await createCheckoutSessionAPI({ items, shippingAddress })
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error, 'Unable to start checkout'))
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const incoming = action.payload
      const existing = state.items.find((item) => item.productId === incoming.productId)

      if (existing) {
        existing.quantity += incoming.quantity || 1
      } else {
        state.items.push({ ...incoming, quantity: incoming.quantity || 1 })
      }

      saveCart(state.items)
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.productId !== action.payload)
      saveCart(state.items)
    },
    updateCartQuantity(state, action) {
      const { productId, quantity } = action.payload
      const item = state.items.find((cartItem) => cartItem.productId === productId)

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
      state.shippingAddress = {
        ...state.shippingAddress,
        ...action.payload,
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncCart.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(syncCart.fulfilled, (state) => {
        state.status = 'succeeded'
      })
      .addCase(syncCart.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(createCheckoutSession.pending, (state) => {
        state.checkoutStatus = 'loading'
        state.error = null
      })
      .addCase(createCheckoutSession.fulfilled, (state) => {
        state.checkoutStatus = 'succeeded'
      })
      .addCase(createCheckoutSession.rejected, (state, action) => {
        state.checkoutStatus = 'failed'
        state.error = action.payload
      })
  },
})

export const { addToCart, removeFromCart, updateCartQuantity, clearCart, setShippingAddress } =
  cartSlice.actions
export default cartSlice.reducer
