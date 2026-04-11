/* ===== AXIOS HTTP CLIENT ===== */
/* Pre-configured Axios instance with JWT interceptor */
/* Auto-attaches token from Redux store, handles 401 by clearing auth */

import axios from 'axios'
import { store } from '../app/store'
import { logout } from '../features/auth/authSlice'
import { clearSession } from '../utils/helpers'

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'https://amazon-ecommerce-backend.vercel.app/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT to every request — read from Redux store for single source of truth
axiosInstance.interceptors.request.use((config) => {
  const token = store.getState()?.auth?.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally — clear auth state and dispatch logout
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearSession()
      store.dispatch(logout())
      // Use history API for SPA navigation (no full reload)
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default axiosInstance
