/* ===== PRODUCTS API ===== */
/* Product CRUD with pagination and filtering support */
/* Supports multipart form data for image uploads */

import axiosInstance from '../../services/axiosInstance'

const CATEGORY_QUERY_MAP = {
  electronics: 'Electronics',
  computers: 'Computers & Accessories',
  'computers & accessories': 'Computers & Accessories',
  gaming: 'Gaming',
  clothing: 'Clothing',
  'home & kitchen': 'Home & Kitchen',
  books: 'Books',
  beauty: 'Health & Beauty',
  'health & beauty': 'Health & Beauty',
  sports: 'Sports & Outdoors',
  'sports & outdoors': 'Sports & Outdoors',
  toys: 'Toys & Games',
  'toys & games': 'Toys & Games',
  automotive: 'Automotive',
  'grocery & gourmet': 'Grocery & Gourmet',
}

const SORT_QUERY_MAP = {
  featured: undefined,
  'price-asc': 'price',
  'price-desc': '-price',
  rating: '-ratings',
}

const normalizeCategory = (category) => {
  if (!category || category === 'all') return undefined

  const normalizedCategory = String(category).trim()
  const mappedCategory =
    CATEGORY_QUERY_MAP[normalizedCategory.toLowerCase()] ?? normalizedCategory

  return mappedCategory
}

const buildProductQueryParams = (params = {}) => {
  const query = {}
  const normalizedSearch = params.search?.trim()
  const normalizedCategory = normalizeCategory(params.category)
  const normalizedSort = params.sort ?? SORT_QUERY_MAP[params.sortBy]

  if (normalizedSearch) query.search = normalizedSearch
  if (normalizedCategory) query.category = normalizedCategory
  if (params.minPrice !== '' && params.minPrice !== undefined) {
    query.minPrice = params.minPrice
  }
  if (params.maxPrice !== '' && params.maxPrice !== undefined) {
    query.maxPrice = params.maxPrice
  }
  if (params.rating !== '' && params.rating !== undefined) {
    query.rating = params.rating
  }
  if (normalizedSort) query.sort = normalizedSort
  if (params.page) query.page = params.page
  if (params.limit) query.limit = params.limit

  return query
}

export const fetchProductsAPI = async (params) => {
  const queryParams = buildProductQueryParams(params)
  console.log('[fetchProductsAPI] Input params:', params)
  console.log('[fetchProductsAPI] Built query params:', queryParams)

  const { data } = await axiosInstance.get('/products', {
    params: queryParams,
  })

  console.log('[fetchProductsAPI] Response:', data)
  return data
}

export const fetchProductByIdAPI = async (id) => {
  const { data } = await axiosInstance.get(`/products/${id}`)
  return data
}

export const createProductAPI = async (payload) => {
  const isMultipart = payload instanceof FormData
  const config = isMultipart ? { headers: { 'Content-Type': undefined } } : {}
  if (isMultipart) {
    // Remove the default Content-Type so axios sets it with boundary
    delete config.headers['Content-Type']
  }
  const { data } = await axiosInstance.post('/products', payload, config)
  return data
}

export const updateProductAPI = async (payload) => {
  const { id, formData, ...body } = payload
  // If formData is provided, use it directly (multipart update)
  if (formData instanceof FormData) {
    const { data } = await axiosInstance.put(`/products/${id}`, formData, {
      headers: {},
    })
    return data
  }
  const isMultipart = body instanceof FormData
  const config = isMultipart ? { headers: {} } : {}
  const { data } = await axiosInstance.put(`/products/${id}`, body, config)
  return data
}

export const deleteProductAPI = async (id) => {
  const { data } = await axiosInstance.delete(`/products/${id}`)
  return data
}
