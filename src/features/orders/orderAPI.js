import axiosInstance from '../../services/axiosInstance'

export const fetchOrdersAPI = async () => {
  const { data } = await axiosInstance.get('/orders/my')
  return data
}

export const fetchOrderByIdAPI = async (orderId) => {
  const { data } = await axiosInstance.get(`/orders/${orderId}`)
  return data
}

export const createOrderAPI = async (shippingAddress) => {
  const { data } = await axiosInstance.post('/orders', { shippingAddress })
  return data
}

export const createCheckoutSessionAPI = async (orderId) => {
  const { data } = await axiosInstance.post('/payment/checkout', { orderId })
  return data
}
