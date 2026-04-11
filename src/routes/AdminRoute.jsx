/* ===== ADMIN ROUTE GUARD ===== */
/* Redirects non-admin users to home page */
/* Used for: Admin Products Management, Admin Users Management */

import { Navigate, Outlet } from 'react-router-dom'
import { useIsAuthenticated, useIsAdmin } from '../hooks'

export default function AdminRoute() {
  const isAuthenticated = useIsAuthenticated()
  const isAdmin = useIsAdmin()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
