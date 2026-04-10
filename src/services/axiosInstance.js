/* ===== AXIOS HTTP CLIENT ===== */
/* Pre-configured Axios instance with JWT interceptor */
/* Auto-attaches token to requests, handles 401 by redirecting to login */

import axios from 'axios'

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'https://amazon-ecommerce-backend.vercel.app/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT to every request
axiosInstance.interceptors.request.use((config) => {
  const raw = localStorage.getItem('amazon_clone_session')
  if (raw) {
    try {
      const session = JSON.parse(raw)
      if (session?.token)
        config.headers.Authorization = `Bearer ${session.token}`
    } catch {
      /* ignore corrupt session */
    }
  }
  return config
})

// Handle 401 globally — force re-login
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('amazon_clone_session')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default axiosInstance
