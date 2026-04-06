import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  createProductAPI,
  deleteProductAPI,
  fetchProductByIdAPI,
  fetchProductsAPI,
  updateProductAPI,
} from './productAPI'
import { getErrorMessage } from '../../utils/helpers'

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

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (params, thunkApi) => {
  try {
    return await fetchProductsAPI(params)
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error, 'Unable to fetch products'))
  }
})

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, thunkApi) => {
    try {
      return await fetchProductByIdAPI(productId)
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error, 'Unable to fetch product details'))
    }
  }
)

export const createProduct = createAsyncThunk('products/createProduct', async (payload, thunkApi) => {
  try {
    return await createProductAPI(payload)
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error, 'Unable to create product'))
  }
})

export const updateProduct = createAsyncThunk('products/updateProduct', async (payload, thunkApi) => {
  try {
    return await updateProductAPI(payload)
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error, 'Unable to update product'))
  }
})

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (productId, thunkApi) => {
  try {
    await deleteProductAPI(productId)
    return productId
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error, 'Unable to delete product'))
  }
})

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProductFilters(state, action) {
      state.filters = {
        ...state.filters,
        ...action.payload,
      }
    },
    resetSelectedProduct(state) {
      state.selectedProduct = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.products || action.payload.data || []
        state.total = action.payload.total || state.items.length
        state.pages = action.payload.pages || 1
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(fetchProductById.pending, (state) => {
        state.detailStatus = 'loading'
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded'
        state.selectedProduct = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detailStatus = 'failed'
        state.error = action.payload
      })
      .addCase(createProduct.pending, (state) => {
        state.mutationStatus = 'loading'
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        state.items.unshift(action.payload.product || action.payload)
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload
      })
      .addCase(updateProduct.pending, (state) => {
        state.mutationStatus = 'loading'
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updated = action.payload.product || action.payload
        state.mutationStatus = 'succeeded'
        state.items = state.items.map((item) => (item._id === updated._id ? updated : item))
        if (state.selectedProduct?._id === updated._id) {
          state.selectedProduct = updated
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload
      })
      .addCase(deleteProduct.pending, (state) => {
        state.mutationStatus = 'loading'
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        state.items = state.items.filter((item) => item._id !== action.payload)
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload
      })
  },
})

export const { setProductFilters, resetSelectedProduct } = productSlice.actions
export default productSlice.reducer
