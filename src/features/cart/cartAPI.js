import axiosInstance from '../../services/axiosInstance'

export const fetchCartAPI = async () => { const { data } = await axiosInstance.get('/cart'); return data }
export const addToCartAPI = async (payload) => { const { data } = await axiosInstance.post('/cart', payload); return data }
export const updateCartItemAPI = async (payload) => { const { data } = await axiosInstance.put('/cart', payload); return data }
export const removeCartItemAPI = async (productId) => { const { data } = await axiosInstance.delete(`/cart/${productId}`); return data }
export const clearCartAPI = async () => { const { data } = await axiosInstance.delete('/cart'); return data }
export const syncCartAPI = async (body) => { const { data } = await axiosInstance.post('/cart/sync', body); return data }
export const createCheckoutSessionAPI = async (body) => { const { data } = await axiosInstance.post('/payment/checkout', body); return data }
