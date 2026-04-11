/* ===== PRODUCTS SLICE ===== */
/* Manages product catalog, filtering, sorting, and pagination */
/* Supports CRUD operations (admin only for mutations) */

import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit'
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
      const data = await deleteProductAPI(id)
      // Return the product ID from the response or the data itself
      const productId = data?.product?._id ?? data?._id ?? data?.id ?? id
      return productId
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
      state.detailStatus = 'idle'
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
        let items =
          action.payload.products ||
          action.payload.data?.products ||
          action.payload.data ||
          []
        // Normalize: backend may use 'name' — copy to 'title'
        if (Array.isArray(items)) {
          items = items.map((p) =>
            p && !p.title && p.name ? { ...p, title: p.name } : p
          )
        }
        state.items = items
        state.total =
          action.payload.total ??
          action.payload.data?.total ??
          state.items.length
        state.pages = action.payload.pages ?? action.payload.data?.pages ?? 1
      })
      .addCase(fetchProductById.pending, pending('detailStatus'))
      .addCase(fetchProductById.rejected, rejected('detailStatus'))
      .addCase(fetchProductById.fulfilled, (state, action) => {
        fulfilled('detailStatus')(state)
        let p = action.payload.product || action.payload.data || action.payload
        // Normalize: backend may use 'name' — copy to 'title' for UI consistency
        if (p && !p.title && p.name) p = { ...p, title: p.name }
        state.selectedProduct = p
      })
      .addCase(createProduct.pending, pending('mutationStatus'))
      .addCase(createProduct.rejected, rejected('mutationStatus'))
      .addCase(createProduct.fulfilled, (state, action) => {
        fulfilled('mutationStatus')(state)
        let p = action.payload.product || action.payload.data || action.payload
        if (p && !p.title && p.name) p = { ...p, title: p.name }
        if (p) state.items.unshift(p)
      })
      .addCase(updateProduct.pending, pending('mutationStatus'))
      .addCase(updateProduct.rejected, rejected('mutationStatus'))
      .addCase(updateProduct.fulfilled, (state, action) => {
        fulfilled('mutationStatus')(state)
        let p = action.payload.product || action.payload.data || action.payload
        if (p && !p.title && p.name) p = { ...p, title: p.name }
        if (p) {
          state.items = state.items.map((i) => (i._id === p._id ? p : i))
          if (state.selectedProduct?._id === p._id) state.selectedProduct = p
        }
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

// Memoized selectors
const selectProductState = (s) => s.products
export const selectAllProducts = createSelector(
  [selectProductState],
  (products) => products.items
)
export const selectSelectedProduct = createSelector(
  [selectProductState],
  (products) => products.selectedProduct
)
export const selectProductFilters = createSelector(
  [selectProductState],
  (products) => products.filters
)
export const selectProductTotal = createSelector(
  [selectProductState],
  (products) => products.total
)
export const selectProductPages = createSelector(
  [selectProductState],
  (products) => products.pages
)
export const selectProductStatus = createSelector(
  [selectProductState],
  (products) => products.status
)
export const selectDetailStatus = createSelector(
  [selectProductState],
  (products) => products.detailStatus
)
export const selectMutationStatus = createSelector(
  [selectProductState],
  (products) => products.mutationStatus
)
export const selectProductError = createSelector(
  [selectProductState],
  (products) => products.error
)
