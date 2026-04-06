import api from '../../services/axiosInstance'

const useMocks = import.meta.env.VITE_ENABLE_MOCKS === 'true'

export async function syncCartAPI(payload) {
  if (useMocks) {
    return {
      success: true,
      ...payload,
    }
  }

  const { data } = await api.put('/cart', payload)
  return data
}

export async function createCheckoutSessionAPI(payload) {
  if (useMocks) {
    return {
      success: true,
      checkoutUrl: '',
      ...payload,
    }
  }

  const { data } = await api.post('/checkout/session', payload)
  return data
}
