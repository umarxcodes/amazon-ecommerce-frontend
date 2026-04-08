import api from '../../services/axiosInstance'
import { mockProducts } from '../../data/mockProducts'

const useMocks = import.meta.env.VITE_ENABLE_MOCKS === 'true'
let mockCatalog = [...mockProducts]

export async function fetchProductsAPI(params = {}) {
  if (useMocks) {
    return {
      products: mockCatalog,
      total: mockCatalog.length,
      page: Number(params.page || 1),
      pages: 1,
    }
  }

  const { data } = await api.get('/products', { params })
  return data
}

export async function fetchProductByIdAPI(productId) {
  if (useMocks) {
    return mockCatalog.find((product) => product._id === productId)
  }

  const { data } = await api.get(`/products/${productId}`)
  return data
}

export async function createProductAPI(payload) {
  if (useMocks) {
    const product = {
      _id: `mock-${crypto.randomUUID()}`,
      rating: 4.5,
      reviewsCount: 0,
      featured: false,
      ...payload,
    }
    mockCatalog = [product, ...mockCatalog]
    return product
  }

  const { data } = await api.post('/products', payload)
  return data
}

export async function updateProductAPI({ productId, payload }) {
  if (useMocks) {
    const current = mockCatalog.find((product) => product._id === productId)
    const updatedProduct = { ...current, ...payload, _id: productId }
    mockCatalog = mockCatalog.map((product) =>
      product._id === productId ? updatedProduct : product
    )
    return updatedProduct
  }

  const { data } = await api.put(`/products/${productId}`, payload)
  return data
}

export async function deleteProductAPI(productId) {
  if (useMocks) {
    mockCatalog = mockCatalog.filter((product) => product._id !== productId)
    return {
      success: true,
    }
  }

  const { data } = await api.delete(`/products/${productId}`)
  return data
}
