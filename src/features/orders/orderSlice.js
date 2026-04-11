/* ===== ORDERS SLICE ===== */
/* Manages user orders and payment checkout flow */
/* Integrates with payment gateway for order processing */

import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit'
import {
  createOrderAPI,
  fetchOrderByIdAPI,
  fetchOrdersAPI,
  startCheckoutAPI,
} from './orderAPI'
import { getErrorMessage } from '../../utils/helpers'
import { fulfilled, pending, rejected } from '../../app/sliceHelpers'

const initialState = {
  items: [],
  selectedOrder: null,
  status: 'idle',
  detailStatus: 'idle',
  createOrderStatus: 'idle',
  checkoutStatus: 'idle',
  error: null,
}

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, thunkApi) => {
    try {
      return await fetchOrdersAPI()
    } catch (err) {
      return thunkApi.rejectWithValue(
        getErrorMessage(err, 'Unable to fetch orders')
      )
    }
  }
)

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id, thunkApi) => {
    try {
      return await fetchOrderByIdAPI(id)
    } catch (err) {
      return thunkApi.rejectWithValue(
        getErrorMessage(err, 'Unable to fetch order')
      )
    }
  }
)

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (payload, thunkApi) => {
    try {
      return await createOrderAPI(payload)
    } catch (err) {
      return thunkApi.rejectWithValue(
        getErrorMessage(err, 'Unable to create order')
      )
    }
  }
)

export const startCheckout = createAsyncThunk(
  'orders/startCheckout',
  async (orderId, thunkApi) => {
    try {
      // startCheckoutAPI already returns data (axiosInstance.get returns data)
      const result = await startCheckoutAPI(orderId)
      const url = result?.url || result?.checkoutUrl
      if (url) window.location.href = url
      return result
    } catch (err) {
      return thunkApi.rejectWithValue(
        getErrorMessage(err, 'Unable to start checkout')
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
      state.createOrderStatus = 'idle'
      state.checkoutStatus = 'idle'
      state.error = null
    },
    setSelectedOrder(state, action) {
      state.selectedOrder = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, pending())
      .addCase(fetchOrders.rejected, rejected())
      .addCase(fetchOrders.fulfilled, (state, action) => {
        fulfilled()(state)
        state.items =
          action.payload.orders ||
          action.payload.data?.orders ||
          action.payload ||
          []
      })
      .addCase(fetchOrderById.pending, pending('detailStatus'))
      .addCase(fetchOrderById.rejected, rejected('detailStatus'))
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        fulfilled('detailStatus')(state)
        state.selectedOrder =
          action.payload.order || action.payload.data || action.payload
      })
      .addCase(createOrder.pending, pending('createOrderStatus'))
      .addCase(createOrder.rejected, rejected('createOrderStatus'))
      .addCase(createOrder.fulfilled, (state, action) => {
        fulfilled('createOrderStatus')(state)
        const order =
          action.payload.order || action.payload.data || action.payload
        state.items.unshift(order)
      })
      .addCase(startCheckout.pending, pending('checkoutStatus'))
      .addCase(startCheckout.fulfilled, fulfilled('checkoutStatus'))
      .addCase(startCheckout.rejected, rejected('checkoutStatus'))
  },
})

export const { resetOrderStatus, setSelectedOrder } = orderSlice.actions
export default orderSlice.reducer

// Memoized selectors
const selectOrderState = (s) => s.orders
export const selectAllOrders = createSelector(
  [selectOrderState],
  (orders) => orders.items
)
export const selectSelectedOrder = createSelector(
  [selectOrderState],
  (orders) => orders.selectedOrder
)
export const selectOrderStatus = createSelector(
  [selectOrderState],
  (orders) => orders.status
)
export const selectDetailStatus = createSelector(
  [selectOrderState],
  (orders) => orders.detailStatus
)
export const selectOrderError = createSelector(
  [selectOrderState],
  (orders) => orders.error
)
export const selectCreateOrderStatus = createSelector(
  [selectOrderState],
  (orders) => orders.createOrderStatus
)
export const selectCheckoutStatus = createSelector(
  [selectOrderState],
  (orders) => orders.checkoutStatus
)
