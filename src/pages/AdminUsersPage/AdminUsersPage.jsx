import { useEffect, useState } from 'react'
import {
  useAppDispatch,
  useAllUsers,
  useUsersStatus,
  useAdminMutationStatus,
} from '../../hooks/customHooks'
import {
  fetchUsers,
  updateUserRole,
  deactivateUser,
} from '../../features/admin/adminSlice'
import { addToast } from '../../features/ui/uiSlice'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import EmptyState from '../../components/UI/EmptyState'
import Modal from '../../components/UI/Modal'

export default function AdminUsersPage() {
  const dispatch = useAppDispatch()
  const users = useAllUsers()
  const status = useUsersStatus()
  const mutationStatus = useAdminMutationStatus()

  const [roleChangeConfirm, setRoleChangeConfirm] = useState(null)
  const [deactivateConfirm, setDeactivateConfirm] = useState(null)
  const [newRole, setNewRole] = useState('USER')

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const handleRoleChange = async () => {
    if (!roleChangeConfirm) return
    const result = await dispatch(
      updateUserRole({ id: roleChangeConfirm, role: newRole })
    )
    if (updateUserRole.fulfilled.match(result)) {
      dispatch(
        addToast({
          title: 'Role updated',
          message: `User role has been changed to ${newRole}.`,
          type: 'success',
        })
      )
    } else {
      dispatch(
        addToast({
          title: 'Update failed',
          message: result.payload || 'Unable to update user role.',
          type: 'error',
        })
      )
    }
    setRoleChangeConfirm(null)
  }

  const handleDeactivate = async () => {
    if (!deactivateConfirm) return
    const result = await dispatch(deactivateUser(deactivateConfirm))
    if (deactivateUser.fulfilled.match(result)) {
      dispatch(
        addToast({
          title: 'User deactivated',
          message: 'The user has been deactivated.',
          type: 'success',
        })
      )
    } else {
      dispatch(
        addToast({
          title: 'Deactivation failed',
          message: result.payload || 'Unable to deactivate user.',
          type: 'error',
        })
      )
    }
    setDeactivateConfirm(null)
  }

  const openRoleModal = (userId, currentRole) => {
    setRoleChangeConfirm(userId)
    setNewRole(currentRole === 'ADMIN' ? 'USER' : 'ADMIN')
  }

  if (status === 'loading' && !users.length) {
    return <LoadingSpinner label="Loading users..." />
  }

  return (
    <div className="admin-users-page">
      <div className="admin-page-container">
        <div className="admin-page-header">
          <h1>Manage Users ({users.length})</h1>
        </div>

        {users.length === 0 ? (
          <EmptyState
            title="No users found"
            description="There are no registered users yet."
          />
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="admin-table__avatar">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`admin-table__badge admin-table__badge--${user.role?.toLowerCase() || 'user'}`}
                      >
                        {user.role || 'USER'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`admin-table__status admin-table__status--${user.isActive !== false ? 'active' : 'inactive'}`}
                      >
                        {user.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="admin-table__actions">
                      <button
                        type="button"
                        className="admin-table__btn admin-table__btn--edit"
                        onClick={() => openRoleModal(user._id, user.role)}
                        title="Change Role"
                      >
                        🔄 Role
                      </button>
                      <button
                        type="button"
                        className="admin-table__btn admin-table__btn--delete"
                        onClick={() => setDeactivateConfirm(user._id)}
                        title="Deactivate"
                        disabled={user.isActive === false}
                      >
                        🚫 Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Change Modal */}
      <Modal
        open={!!roleChangeConfirm}
        title="Change User Role"
        description={`Are you sure you want to change this user's role to ${newRole}?`}
        onClose={() => setRoleChangeConfirm(null)}
      >
        <div className="admin-form__actions">
          <button
            type="button"
            className="admin-form__cancel"
            onClick={() => setRoleChangeConfirm(null)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="admin-form__submit"
            onClick={handleRoleChange}
            disabled={mutationStatus === 'loading'}
          >
            {mutationStatus === 'loading' ? 'Updating...' : 'Confirm'}
          </button>
        </div>
      </Modal>

      {/* Deactivate Modal */}
      <Modal
        open={!!deactivateConfirm}
        title="Deactivate User"
        description="Are you sure you want to deactivate this user? They will no longer be able to log in."
        onClose={() => setDeactivateConfirm(null)}
      >
        <div className="admin-form__actions">
          <button
            type="button"
            className="admin-form__cancel"
            onClick={() => setDeactivateConfirm(null)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="admin-form__submit admin-form__submit--danger"
            onClick={handleDeactivate}
            disabled={mutationStatus === 'loading'}
          >
            {mutationStatus === 'loading' ? 'Deactivating...' : 'Deactivate'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
