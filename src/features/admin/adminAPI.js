/* ===== ADMIN API ===== */
/* User management and admin-only operations */
/* Requires admin role for access */

import axiosInstance from '../../services/axiosInstance'

export const fetchUsersAPI = async () => {
  const { data } = await axiosInstance.get('/admin/users')
  return data
}
export const updateUserRoleAPI = async ({ id, role }) => {
  const { data } = await axiosInstance.patch(`/admin/users/${id}/role`, {
    role,
  })
  return data
}
export const deactivateUserAPI = async (id) => {
  const { data } = await axiosInstance.patch(`/admin/users/${id}/deactivate`)
  return data
}
export const createAdminAPI = async (payload) => {
  const { data } = await axiosInstance.post('/admin/create-admin', payload)
  return data
}
