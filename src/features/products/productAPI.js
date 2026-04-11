/* ===== PRODUCTS API ===== */
/* Product CRUD with pagination and filtering support */
/* Supports multipart form data for image uploads */

import axiosInstance from '../../services/axiosInstance'

export const fetchProductsAPI = async (params) => {
  const { data } = await axiosInstance.get('/products', { params })
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
