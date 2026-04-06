import api from '../../services/axiosInstance'
import { mockUsers } from '../../utils/mockData'

const useMocks = import.meta.env.VITE_ENABLE_MOCKS === 'true'
let mockTeam = [...mockUsers]

export async function fetchUsersAPI() {
  if (useMocks) {
    return {
      users: mockTeam,
    }
  }

  const { data } = await api.get('/admin/users')
  return data
}

export async function updateUserRoleAPI({ userId, role }) {
  if (useMocks) {
    const currentUser = mockTeam.find((user) => user._id === userId)
    const updatedUser = { ...currentUser, role }
    mockTeam = mockTeam.map((user) => (user._id === userId ? updatedUser : user))
    return updatedUser
  }

  const { data } = await api.patch(`/admin/users/${userId}`, { role })
  return data
}
