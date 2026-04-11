/* ===== ADMIN USERS PAGE ===== */
/* Admin-only user management (role changes, deactivate users, create admin) */
/* Admin Route — requires admin role */

import { useEffect, useState, useCallback } from 'react'
import {
  useAppDispatch,
  useAllUsers,
  useUsersStatus,
  useAdminMutationStatus,
  useFetchUsers,
  useUpdateUserRole,
  useDeactivateUser,
  useCreateAdmin,
} from '../../hooks'
import {
  updateUserRole,
  deactivateUser,
  createAdmin,
} from '../../features/admin/adminSlice'
import { addToast } from '../../features/ui/uiSlice'
import { adminCreateSchema } from '../../features/admin/adminSchemas'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import EmptyState from '../../components/shared/EmptyState'
import Button from '../../components/shared/Button'
import './AdminUsersPage.css'

function AdminCreateForm({ onClose, isSubmitting }) {
  const dispatch = useAppDispatch()
  const createAdminFn = useCreateAdmin()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})

  const updateField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const validateField = useCallback(
    async (key, value) => {
      try {
        await adminCreateSchema.validateAt(key, { ...form, [key]: value })
        setErrors((prev) => {
          const next = { ...prev }
          delete next[key]
          return next
        })
      } catch (err) {
        setErrors((prev) => ({ ...prev, [key]: err.message }))
      }
    },
    [form]
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await adminCreateSchema.validate(form, { abortEarly: false })
    } catch (err) {
      const fieldErrors = {}
      err.inner.forEach((e) => {
        fieldErrors[e.path] = e.message
      })
      setErrors(fieldErrors)
      return
    }

    const result = await dispatch(createAdminFn(form))
    if (createAdmin.fulfilled.match(result)) {
      dispatch(
        addToast({
          title: 'Admin created',
          message: `${form.name} has been created as an admin.`,
          type: 'success',
        })
      )
      setForm({ name: '', email: '', password: '' })
      setErrors({})
      // Refetch users to show the new admin
      if (onClose) onClose(true)
    } else {
      const msg = result.payload ?? 'Could not create admin.'
      if (
        msg.toLowerCase().includes('already exists') ||
        msg.toLowerCase().includes('duplicate')
      ) {
        setErrors({ email: 'Email already exists.' })
      } else {
        setErrors({ form: msg })
      }
      dispatch(
        addToast({
          title: 'Failed',
          message: msg,
          type: 'error',
        })
      )
    }
  }

  return (
    <div className="admin-modal__backdrop" onClick={() => onClose(false)}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Create Admin User</h2>
        {errors.form && (
          <div className="admin-modal__error-banner">{errors.form}</div>
        )}
        <form onSubmit={handleSubmit} className="admin-modal__form" noValidate>
          <div className="admin-modal__field">
            <label htmlFor="admin-name">Name *</label>
            <input
              id="admin-name"
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              onBlur={() => validateField('name', form.name)}
              required
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <span className="admin-modal__error">{errors.name}</span>
            )}
          </div>

          <div className="admin-modal__field">
            <label htmlFor="admin-email">Email *</label>
            <input
              id="admin-email"
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              onBlur={() => validateField('email', form.email)}
              required
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <span className="admin-modal__error">{errors.email}</span>
            )}
          </div>

          <div className="admin-modal__field">
            <label htmlFor="admin-password">Password *</label>
            <input
              id="admin-password"
              type="password"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              onBlur={() => validateField('password', form.password)}
              required
              minLength={6}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <span className="admin-modal__error">{errors.password}</span>
            )}
          </div>

          <div className="admin-modal__actions">
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Admin'}
            </Button>
            <Button
              variant="ghost"
              type="button"
              onClick={() => onClose(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

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
          disabled={isMutating}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </td>
      <td>
        <span
          className={`admin-table__status-badge ${
            (user.active ?? user.isActive)
              ? 'admin-table__status-badge--active'
              : 'admin-table__status-badge--inactive'
          }`}
        >
          {(user.active ?? user.isActive) ? 'Active' : 'Inactive'}
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
  const [showCreateAdmin, setShowCreateAdmin] = useState(false)

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
      } else {
        dispatch(
          addToast({
            title: 'Failed',
            message: result.payload ?? 'Could not update role.',
            type: 'error',
          })
        )
      }
    },
    [dispatch, updateUserRoleFn]
  )

  const handleDeactivate = useCallback(
    async (id) => {
      if (
        !window.confirm('Deactivate this user? This action cannot be undone.')
      )
        return
      const result = await dispatch(deactivateUserFn(id))
      if (deactivateUser.fulfilled.match(result)) {
        dispatch(
          addToast({
            title: 'Deactivated',
            message: 'User has been deactivated.',
            type: 'info',
          })
        )
      } else {
        dispatch(
          addToast({
            title: 'Failed',
            message: result.payload ?? 'Could not deactivate user.',
            type: 'error',
          })
        )
      }
    },
    [dispatch, deactivateUserFn]
  )

  const handleCreateAdminClose = useCallback(
    (created) => {
      setShowCreateAdmin(false)
      if (created) {
        fetchUsers()
      }
    },
    [fetchUsers]
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
      <div className="admin-page__header">
        <h1>Manage Users</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="accent" onClick={() => setShowCreateAdmin(true)}>
            Create Admin
          </Button>
        </div>
      </div>
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

      {showCreateAdmin && (
        <AdminCreateForm
          onClose={handleCreateAdminClose}
          isSubmitting={mutationStatus === 'loading'}
        />
      )}
    </div>
  )
}
