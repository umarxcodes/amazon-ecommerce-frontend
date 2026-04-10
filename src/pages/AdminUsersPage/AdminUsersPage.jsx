import { useEffect, useCallback } from 'react'
import {
  useAppDispatch,
  useAllUsers,
  useUsersStatus,
  useAdminMutationStatus,
  useDeactivateUser,
} from '../../hooks'
import {
  fetchUsers,
  updateUserRole,
  deactivateUser,
} from '../../features/admin/adminSlice'
import { addToast } from '../../features/ui/uiSlice'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import EmptyState from '../../components/shared/EmptyState'
import Button from '../../components/shared/Button'
import './AdminUsersPage.css'

function UserTableRow({ user, onRoleChange, onDeactivate, isMutating }) {
  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>
        <select
          value={user.role || 'user'}
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
  const deactivateUserFn = useDeactivateUser()

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const handleRoleChange = useCallback(
    async (user, newRole) => {
      const result = await dispatch(
        updateUserRole({ id: user._id, role: newRole })
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
    [dispatch]
  )

  const handleDeactivate = useCallback(
    async (id) => {
      if (!window.confirm('Deactivate this user?')) return
      const result = await dispatch(deactivateUser(id))
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
    [dispatch, deactivateUser]
  )

  if (status === 'loading')
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
