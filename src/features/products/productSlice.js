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
    } catch (error) {
      return thunkApi.rejectWithValue(
        getErrorMessage(error, 'Unable to fetch products')
      )
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, thunkApi) => {
    try {
      return await fetchProductByIdAPI(productId)
    } catch (error) {
      return thunkApi.rejectWithValue(
        getErrorMessage(error, 'Unable to fetch product details')
      )
    }
  }
)

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (payload, thunkApi) => {
    try {
      return await createProductAPI(payload)
    } catch (error) {
      return thunkApi.rejectWithValue(
        getErrorMessage(error, 'Unable to create product')
      )
    }
  }
)

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (payload, thunkApi) => {
    try {
      return await updateProductAPI(payload)
    } catch (error) {
      return thunkApi.rejectWithValue(
        getErrorMessage(error, 'Unable to update product')
      )
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, thunkApi) => {
    try {
      await deleteProductAPI(productId)
      return productId
    } catch (error) {
      return thunkApi.rejectWithValue(
        getErrorMessage(error, 'Unable to delete product')
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
        state.items.unshift(action.payload.product || action.payload)
      })
      .addCase(updateProduct.pending, pending('mutationStatus'))
      .addCase(updateProduct.rejected, rejected('mutationStatus'))
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updated = action.payload.product || action.payload
        fulfilled('mutationStatus')(state)
        state.items = state.items.map((item) =>
          item._id === updated._id ? updated : item
        )
        if (state.selectedProduct?._id === updated._id) {
          state.selectedProduct = updated
        }
      })
      .addCase(deleteProduct.pending, pending('mutationStatus'))
      .addCase(deleteProduct.rejected, rejected('mutationStatus'))
      .addCase(deleteProduct.fulfilled, (state, action) => {
        fulfilled('mutationStatus')(state)
        state.items = state.items.filter((item) => item._id !== action.payload)
      })
  },
})

export const { setProductFilters, resetSelectedProduct, resetMutationStatus } =
  productSlice.actions
export default productSlice.reducer

// ─── Selectors ────────────────────────────────────────────
export const selectAllProducts = (state) => state.products.items
export const selectSelectedProduct = (state) => state.products.selectedProduct
export const selectProductFilters = (state) => state.products.filters
export const selectProductTotal = (state) => state.products.total
export const selectProductPages = (state) => state.products.pages
export const selectProductStatus = (state) => state.products.status
export const selectDetailStatus = (state) => state.products.detailStatus
export const selectMutationStatus = (state) => state.products.mutationStatus
export const selectProductError = (state) => state.products.error
