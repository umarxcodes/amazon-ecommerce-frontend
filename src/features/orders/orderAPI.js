import axiosInstance from '../../services/axiosInstance'

export const fetchOrdersAPI = async () => { const { data } = await axiosInstance.get('/orders/my'); return data }
export const fetchOrderByIdAPI = async (id) => { const { data } = await axiosInstance.get(`/orders/${id}`); return data }
export const createOrderAPI = async (payload) => { const { data } = await axiosInstance.post('/orders', payload); return data }
export const startCheckoutAPI = async (orderId) => { const { data } = await axiosInstance.post(`/payment/checkout/${orderId}`); return data }
