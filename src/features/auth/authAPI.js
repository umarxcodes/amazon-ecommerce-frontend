/* ===== AUTHENTICATION API ===== */
/* Login, Register, and Profile fetch endpoints */

import axiosInstance from '../../services/axiosInstance'

export const loginAPI = async (credentials) => {
  const { data } = await axiosInstance.post('/auth/login', credentials)
  return data
}

export const registerAPI = async (credentials) => {
  const { data } = await axiosInstance.post('/auth/register', credentials)
  return data
}

export const fetchProfileAPI = async () => {
  const { data } = await axiosInstance.get('/auth/profile')
  return data
}
