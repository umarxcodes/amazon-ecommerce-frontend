/* ===== ORDERS API ===== */
/* Create, fetch user orders, and initiate payment checkout */

import axiosInstance from '../../services/axiosInstance'

export const fetchOrdersAPI = async () => {
  const { data } = await axiosInstance.get('/orders/my')
  return data
}

export const fetchOrderByIdAPI = async (id) => {
  const { data } = await axiosInstance.get(`/orders/${id}`)
  return data
}

export const createOrderAPI = async (payload) => {
  const { data } = await axiosInstance.post('/orders', payload)
  return data
}

export const cancelOrderAPI = async (orderId) => {
  const { data } = await axiosInstance.post(`/orders/${orderId}/cancel`)
  return data
}

export const startCheckoutAPI = async (orderId) => {
  // Backend expects POST /payment/checkout with { orderId } in body
  const { data } = await axiosInstance.post('/payment/checkout', { orderId })
  return data
}

export const confirmCheckoutAPI = async (payload) => {
  const { data } = await axiosInstance.post('/payment/confirm', payload)
  return data
}
