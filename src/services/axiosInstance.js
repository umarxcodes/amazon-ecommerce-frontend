import axios from 'axios'
import { clearSession, loadSession } from '../utils/helpers'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const session = loadSession()

  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession()
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.'

    return Promise.reject(new Error(message))
  }
)

export default api
