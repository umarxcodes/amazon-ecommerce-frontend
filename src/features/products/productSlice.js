import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  createProductAPI,
  deleteProductAPI,
  fetchProductByIdAPI,
  fetchProductsAPI,
  updateProductAPI,
} from './productAPI'
import { getErrorMessage } from '../../utils/helpers'
import { fulfilled, pending, rejected } from '../../app/sliceHelpers'

const initialState = {
  items: [],
  selectedProduct: null,
  filters: {
    search: '',
    category: 'all',
    sortBy: 'featured',
    page: 1,
    limit: 8,
  },
  total: 0,
  pages: 1,
  status: 'idle',
  detailStatus: 'idle',
  mutationStatus: 'idle',
  error: null,
}

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, thunkApi) => {
    try {
      return await fetchProductsAPI(params)
    } catch (err) {
      return thunkApi.rejectWithValue(
        getErrorMessage(err, 'Unable to fetch products')
      )
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, thunkApi) => {
    try {
      return await fetchProductByIdAPI(id)
    } catch (err) {
      return thunkApi.rejectWithValue(
        getErrorMessage(err, 'Unable to fetch product')
      )
    }
  }
)

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (payload, thunkApi) => {
    try {
      return await createProductAPI(payload)
    } catch (err) {
      return thunkApi.rejectWithValue(
        getErrorMessage(err, 'Unable to create product')
      )
    }
  }
)

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (payload, thunkApi) => {
    try {
      return await updateProductAPI(payload)
    } catch (err) {
      return thunkApi.rejectWithValue(
        getErrorMessage(err, 'Unable to update product')
      )
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, thunkApi) => {
    try {
      await deleteProductAPI(id)
      return id
    } catch (err) {
      return thunkApi.rejectWithValue(
        getErrorMessage(err, 'Unable to delete product')
      )
    }
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProductFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetSelectedProduct(state) {
      state.selectedProduct = null
    },
    resetMutationStatus(state) {
      state.mutationStatus = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, pending())
      .addCase(fetchProducts.rejected, rejected())
      .addCase(fetchProducts.fulfilled, (state, action) => {
        fulfilled()(state)
        state.items = action.payload.products || action.payload.data || []
        state.total = action.payload.total || state.items.length
        state.pages = action.payload.pages || 1
      })
      .addCase(fetchProductById.pending, pending('detailStatus'))
      .addCase(fetchProductById.rejected, rejected('detailStatus'))
      .addCase(fetchProductById.fulfilled, (state, action) => {
        fulfilled('detailStatus')(state)
        state.selectedProduct = action.payload
      })
      .addCase(createProduct.pending, pending('mutationStatus'))
      .addCase(createProduct.rejected, rejected('mutationStatus'))
      .addCase(createProduct.fulfilled, (state, action) => {
        fulfilled('mutationStatus')(state)
        const p =
          action.payload.product || action.payload.data || action.payload
        if (p) state.items.unshift(p)
      })
      .addCase(updateProduct.pending, pending('mutationStatus'))
      .addCase(updateProduct.rejected, rejected('mutationStatus'))
      .addCase(updateProduct.fulfilled, (state, action) => {
        const p =
          action.payload.product || action.payload.data || action.payload
        fulfilled('mutationStatus')(state)
        state.items = state.items.map((i) => (i._id === p._id ? p : i))
        if (state.selectedProduct?._id === p._id) state.selectedProduct = p
      })
      .addCase(deleteProduct.pending, pending('mutationStatus'))
      .addCase(deleteProduct.rejected, rejected('mutationStatus'))
      .addCase(deleteProduct.fulfilled, (state, action) => {
        fulfilled('mutationStatus')(state)
        state.items = state.items.filter((i) => i._id !== action.payload)
      })
  },
})

export const { setProductFilters, resetSelectedProduct, resetMutationStatus } =
  productSlice.actions
export default productSlice.reducer

export const selectAllProducts = (s) => s.products.items
export const selectSelectedProduct = (s) => s.products.selectedProduct
export const selectProductFilters = (s) => s.products.filters
export const selectProductTotal = (s) => s.products.total
export const selectProductPages = (s) => s.products.pages
export const selectProductStatus = (s) => s.products.status
export const selectDetailStatus = (s) => s.products.detailStatus
export const selectMutationStatus = (s) => s.products.mutationStatus
export const selectProductError = (s) => s.products.error
