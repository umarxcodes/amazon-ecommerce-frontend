import axiosInstance from '../../services/axiosInstance'

export const fetchCartAPI = async () => {
  const { data } = await axiosInstance.get('/cart')
  return data.cart || data.data || data
}

export const addToCartAPI = async ({ productId, quantity }) => {
  const { data } = await axiosInstance.post('/cart', { productId, quantity })
  return data.cart || data.data || data
}

export const updateCartItemAPI = async ({ productId, quantity }) => {
  const { data } = await axiosInstance.put(`/cart/${productId}`, { quantity })
  return data.cart || data.data || data
}

export const removeCartItemAPI = async (productId) => {
  const { data } = await axiosInstance.delete(`/cart/${productId}`)
  return data.cart || data.data || data
}

export const clearCartAPI = async () => {
  const { data } = await axiosInstance.delete('/cart')
  return data.cart || data.data || data
}

// Keep this for local-only sync fallback
export const syncCartAPI = async (payload) => {
  return payload
}

export const createCheckoutSessionAPI = async (orderId) => {
  const { data } = await axiosInstance.post('/payment/checkout', { orderId })
  return data
}
