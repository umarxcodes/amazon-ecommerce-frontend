/* ===== ADMIN USERS PAGE ===== */
/* Admin-only user management (role changes, deactivate users) */
/* Admin Route - requires admin role */

import { useEffect, useCallback } from 'react'
import {
  useAppDispatch,
  useAllUsers,
  useUsersStatus,
  useAdminMutationStatus,
  useFetchUsers,
  useUpdateUserRole,
  useDeactivateUser,
} from '../../hooks'
import { updateUserRole, deactivateUser } from '../../features/admin/adminSlice'
import { addToast } from '../../features/ui/uiSlice'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import EmptyState from '../../components/shared/EmptyState'
import Button from '../../components/shared/Button'
import './AdminUsersPage.css'

const UserTableRow = function UserTableRow({
  user,
  onRoleChange,
  onDeactivate,
  isMutating,
}) {
  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>
        <select
          value={user.role ?? 'user'}
          onChange={(e) => onRoleChange(user, e.target.value)}
          className="admin-table__select"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </td>
      <td>
        <span
          className={`admin-table__status-badge ${
            user.active
              ? 'admin-table__status-badge--active'
              : 'admin-table__status-badge--inactive'
          }`}
        >
          {user.active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="admin-table__actions">
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDeactivate(user._id)}
          disabled={isMutating}
        >
          Deactivate
        </Button>
      </td>
    </tr>
  )
}

export default function AdminUsersPage() {
  const dispatch = useAppDispatch()
  const users = useAllUsers()
  const status = useUsersStatus()
  const mutationStatus = useAdminMutationStatus()
  const fetchUsers = useFetchUsers()
  const updateUserRoleFn = useUpdateUserRole()
  const deactivateUserFn = useDeactivateUser()

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleRoleChange = useCallback(
    async (user, newRole) => {
      const result = await dispatch(
        updateUserRoleFn({ id: user._id, role: newRole })
      )
      if (updateUserRole.fulfilled.match(result)) {
        dispatch(
          addToast({
            title: 'Updated',
            message: `Role set to ${newRole}.`,
            type: 'success',
          })
        )
      }
    },
    [dispatch, updateUserRoleFn]
  )

  const handleDeactivate = useCallback(
    async (id) => {
      if (!window.confirm('Deactivate this user?')) return
      const result = await dispatch(deactivateUserFn(id))
      if (deactivateUser.fulfilled.match(result)) {
        dispatch(
          addToast({
            title: 'Deactivated',
            message: 'User has been deactivated.',
            type: 'info',
          })
        )
      }
    },
    [dispatch, deactivateUserFn]
  )

  if (status === 'loading' && !users.length)
    return <LoadingSpinner label="Loading users..." fullScreen />

  if (!users.length)
    return (
      <EmptyState
        title="No users found"
        description="User management will appear here."
      />
    )

  return (
    <div className="admin-page">
      <h1>Manage Users</h1>
      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserTableRow
                key={user._id}
                user={user}
                onRoleChange={handleRoleChange}
                onDeactivate={handleDeactivate}
                isMutating={mutationStatus === 'loading'}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
