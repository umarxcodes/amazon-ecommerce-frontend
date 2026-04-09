import axiosInstance from '../../services/axiosInstance'

export const fetchProductsAPI = async (params = {}) => {
  const { data } = await axiosInstance.get('/products', { params })
  // backend returns: { success, total, page, pages, results, products }
  return data
}

export const fetchProductByIdAPI = async (productId) => {
  const { data } = await axiosInstance.get(`/products/${productId}`)
  return data.product || data.data || data
}

export const createProductAPI = async (formData) => {
  const { data } = await axiosInstance.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const updateProductAPI = async ({ id, formData }) => {
  const { data } = await axiosInstance.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const deleteProductAPI = async (productId) => {
  const { data } = await axiosInstance.delete(`/products/${productId}`)
  return data
}
