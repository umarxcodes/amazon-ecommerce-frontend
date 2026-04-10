import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
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
      const { data } = await startCheckoutAPI(orderId)
      const url = data?.url || data?.checkoutUrl
      if (url) window.location.href = url
      return data
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
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, pending())
      .addCase(fetchOrders.rejected, rejected())
      .addCase(fetchOrders.fulfilled, (state, action) => {
        fulfilled()(state)
        state.items = action.payload.orders || action.payload || []
      })
      .addCase(fetchOrderById.pending, pending('detailStatus'))
      .addCase(fetchOrderById.rejected, rejected('detailStatus'))
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        fulfilled('detailStatus')(state)
        state.selectedOrder = action.payload
      })
      .addCase(createOrder.pending, pending('createOrderStatus'))
      .addCase(createOrder.rejected, rejected('createOrderStatus'))
      .addCase(createOrder.fulfilled, (state, action) => {
        fulfilled('createOrderStatus')(state)
        state.items.unshift(action.payload)
      })
      .addCase(startCheckout.pending, pending('checkoutStatus'))
      .addCase(startCheckout.fulfilled, fulfilled('checkoutStatus'))
      .addCase(startCheckout.rejected, rejected('checkoutStatus'))
  },
})

export const { resetOrderStatus } = orderSlice.actions
export default orderSlice.reducer

export const selectAllOrders = (s) => s.orders.items
export const selectSelectedOrder = (s) => s.orders.selectedOrder
export const selectOrderStatus = (s) => s.orders.status
export const selectDetailStatus = (s) => s.orders.detailStatus
export const selectOrderError = (s) => s.orders.error
export const selectCreateOrderStatus = (s) => s.orders.createOrderStatus
export const selectCheckoutStatus = (s) => s.orders.checkoutStatus
