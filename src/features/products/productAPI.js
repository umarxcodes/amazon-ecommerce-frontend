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
  const { data } = await axiosInstance.post('/products', payload, {
    headers: isMultipart ? { 'Content-Type': 'multipart/form-data' } : {},
  })
  return data
}

export const updateProductAPI = async (payload) => {
  const { id, formData, ...body } = payload
  // If formData is provided, use it directly (multipart update)
  if (formData instanceof FormData) {
    const { data } = await axiosInstance.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  }
  const isMultipart = body instanceof FormData
  const { data } = await axiosInstance.put(`/products/${id}`, body, {
    headers: isMultipart ? { 'Content-Type': 'multipart/form-data' } : {},
  })
  return data
}

export const deleteProductAPI = async (id) => {
  const { data } = await axiosInstance.delete(`/products/${id}`)
  return data
}
