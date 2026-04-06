import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchUsers, updateUserRole } from '../features/admin/adminSlice'

export default function AdminUsers() {
  const dispatch = useAppDispatch()
  const { users, status } = useAppSelector((state) => state.admin)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  return (
    <div className="container page">
      <section className="stack-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Admin users</span>
            <h1>User management</h1>
          </div>
          <p>Review customer access and update roles from a protected admin surface.</p>
        </div>

        {status === 'loading' ? <p>Loading users...</p> : null}

        <div className="stack-list">
          {users.map((user) => (
            <article className="admin-row" key={user._id}>
              <div>
                <strong>{user.name}</strong>
                <p>{user.email}</p>
              </div>

              <div className="row-actions">
                <span className="chip">{user.role}</span>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() =>
                    dispatch(
                      updateUserRole({
                        userId: user._id,
                        role: user.role === 'admin' ? 'customer' : 'admin',
                      })
                    )
                  }
                >
                  Toggle role
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
