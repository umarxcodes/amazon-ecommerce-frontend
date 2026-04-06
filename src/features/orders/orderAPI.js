import api from '../../services/axiosInstance'
import { mockOrders } from '../../utils/mockData'

const useMocks = import.meta.env.VITE_ENABLE_MOCKS === 'true'

export async function fetchOrdersAPI() {
  if (useMocks) {
    return {
      orders: mockOrders,
    }
  }

  const { data } = await api.get('/orders')
  return data
}

export async function fetchOrderByIdAPI(orderId) {
  if (useMocks) {
    return mockOrders.find((order) => order._id === orderId)
  }

  const { data } = await api.get(`/orders/${orderId}`)
  return data
}
