import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  fetchOrderByIdAPI,
  fetchOrdersAPI,
  createOrderAPI,
  createCheckoutSessionAPI,
} from './orderAPI'
import { getErrorMessage } from '../../utils/helpers'
import { fulfilled, pending, rejected } from '../../app/sliceHelpers'

const initialState = {
  items: [],
  selectedOrder: null,
  status: 'idle',
  detailStatus: 'idle',
  checkoutStatus: 'idle',
  createOrderStatus: 'idle',
  error: null,
}

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, thunkApi) => {
    try {
      return await fetchOrdersAPI()
    } catch (error) {
      return thunkApi.rejectWithValue(
        getErrorMessage(error, 'Unable to fetch orders')
      )
    }
  }
)

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId, thunkApi) => {
    try {
      return await fetchOrderByIdAPI(orderId)
    } catch (error) {
      return thunkApi.rejectWithValue(
        getErrorMessage(error, 'Unable to fetch order')
      )
    }
  }
)

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (shippingAddress, thunkApi) => {
    try {
      return await createOrderAPI(shippingAddress)
    } catch (error) {
      return thunkApi.rejectWithValue(
        getErrorMessage(error, 'Unable to create order')
      )
    }
  }
)

export const startCheckout = createAsyncThunk(
  'orders/startCheckout',
  async (orderId, thunkApi) => {
    try {
      const result = await createCheckoutSessionAPI(orderId)
      // Redirect to Stripe checkout URL
      if (result.url) {
        window.location.href = result.url
      }
      return result
    } catch (error) {
      return thunkApi.rejectWithValue(
        getErrorMessage(error, 'Unable to start checkout')
      )
    }
  }
)

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderStatus(state) {
      state.status = 'idle'
      state.detailStatus = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, pending())
      .addCase(fetchOrders.rejected, rejected())
      .addCase(fetchOrders.fulfilled, (state, action) => {
        fulfilled()(state)
        state.items = action.payload.orders || action.payload.data || []
      })
      .addCase(fetchOrderById.pending, pending('detailStatus'))
      .addCase(fetchOrderById.rejected, rejected('detailStatus'))
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        fulfilled('detailStatus')(state)
        state.selectedOrder = action.payload.order || action.payload
      })
      .addCase(createOrder.pending, pending('createOrderStatus'))
      .addCase(createOrder.rejected, rejected('createOrderStatus'))
      .addCase(createOrder.fulfilled, (state, action) => {
        fulfilled('createOrderStatus')(state)
        const newOrder = action.payload.order || action.payload
        state.items.unshift(newOrder)
      })
      .addCase(startCheckout.pending, pending('checkoutStatus'))
      .addCase(startCheckout.rejected, rejected('checkoutStatus'))
      .addCase(startCheckout.fulfilled, fulfilled('checkoutStatus'))
  },
})

export const { resetOrderStatus } = orderSlice.actions
export default orderSlice.reducer

// ─── Selectors ────────────────────────────────────────────
export const selectAllOrders = (state) => state.orders.items
export const selectSelectedOrder = (state) => state.orders.selectedOrder
export const selectOrderStatus = (state) => state.orders.status
export const selectDetailStatus = (state) => state.orders.detailStatus
export const selectOrderError = (state) => state.orders.error
export const selectCreateOrderStatus = (state) => state.orders.createOrderStatus
export const selectCheckoutStatus = (state) => state.orders.checkoutStatus
