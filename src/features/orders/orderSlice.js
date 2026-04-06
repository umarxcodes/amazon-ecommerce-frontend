import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchOrderByIdAPI, fetchOrdersAPI } from './orderAPI'
import { getErrorMessage } from '../../utils/helpers'

const initialState = {
  items: [],
  selectedOrder: null,
  status: 'idle',
  detailStatus: 'idle',
  error: null,
}

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, thunkApi) => {
  try {
    return await fetchOrdersAPI()
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error, 'Unable to fetch orders'))
  }
})

export const fetchOrderById = createAsyncThunk('orders/fetchOrderById', async (orderId, thunkApi) => {
  try {
    return await fetchOrderByIdAPI(orderId)
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error, 'Unable to fetch order'))
  }
})

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.orders || action.payload.data || []
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.detailStatus = 'loading'
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded'
        state.selectedOrder = action.payload.order || action.payload
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.detailStatus = 'failed'
        state.error = action.payload
      })
  },
})

export default orderSlice.reducer
