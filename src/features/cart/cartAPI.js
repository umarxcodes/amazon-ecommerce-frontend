/* ===== CART API ===== */
/* Fetch, add, update, remove cart items, and checkout */

import axiosInstance from '../../services/axiosInstance'

export const fetchCartAPI = async () => {
  const { data } = await axiosInstance.get('/cart')
  return data
}

export const addToCartAPI = async (payload) => {
  const { data } = await axiosInstance.post('/cart', payload)
  return data
}

export const updateCartItemAPI = async ({ productId, quantity }) => {
  const { data } = await axiosInstance.put(`/cart/${productId}`, { quantity })
  return data
}

export const removeCartItemAPI = async (productId) => {
  const { data } = await axiosInstance.delete(`/cart/${productId}`)
  return data
}

export const clearCartAPI = async () => {
  const { data } = await axiosInstance.delete('/cart/clear')
  return data
}

export const createCheckoutSessionAPI = async (body) => {
  // Backend: POST /payment/checkout with { orderId }
  const { data } = await axiosInstance.post('/payment/checkout', body)
  return data
}
