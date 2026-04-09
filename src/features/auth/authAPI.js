import axiosInstance from '../../services/axiosInstance'

export const loginUser = async (credentials) => {
  const { data } = await axiosInstance.post('/auth/login', credentials)
  // backend returns: { success, message, data: { accessToken, user } }
  return {
    token: data.data.accessToken,
    user: data.data.user,
  }
}

export const registerUser = async (payload) => {
  const { data } = await axiosInstance.post('/auth/register', payload)
  return data.data
}

export const fetchProfile = async () => {
  // No /auth/me endpoint exists — return null, profile is loaded from store
  return null
}
