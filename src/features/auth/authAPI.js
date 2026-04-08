import api from '../../services/axiosInstance'
import { mockUsers } from '../../data/mockProducts'

const useMocks = import.meta.env.VITE_ENABLE_MOCKS === 'true'

export async function loginUser(credentials) {
  if (useMocks) {
    return {
      token: 'mock-jwt-token',
      user: {
        _id: 'u-2',
        name: 'John Admin',
        email: credentials.email,
        role: credentials.email === 'admin@example.com' ? 'admin' : 'customer',
      },
    }
  }

  const { data } = await api.post('/auth/login', credentials)
  return data
}

export async function registerUser(payload) {
  if (useMocks) {
    return {
      token: 'mock-jwt-token',
      user: {
        _id: 'u-3',
        name: payload.name,
        email: payload.email,
        role: 'customer',
      },
    }
  }

  const { data } = await api.post('/auth/register', payload)
  return data
}

export async function fetchProfile() {
  if (useMocks) {
    return {
      user: mockUsers[1],
    }
  }

  const { data } = await api.get('/auth/me')
  return data
}
