/* ===== ADMIN ROUTE GUARD ===== */
/* Redirects non-admin users to home page */
/* Used for: Admin Products Management, Admin Users Management */

import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

export default function AdminRoute() {
  const user = useSelector((s) => s.auth.user)
  const isAdmin = user?.role?.toLowerCase() === 'admin'
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />
}
