import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://amazon-ecommerce-backend.vercel.app/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Attach JWT token to every request automatically
axiosInstance.interceptors.request.use((config) => {
  const session = localStorage.getItem('session')
  if (session) {
    const { token } = JSON.parse(session)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message || error.message

    if (status === 401) {
      localStorage.removeItem('session')
      window.location.href = '/login'
    }

    return Promise.reject(new Error(message))
  }
)

export default axiosInstance
