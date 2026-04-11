/* ===== PROTECTED ROUTE GUARD ===== */
/* Redirects unauthenticated users to login page */
/* Used for: Cart, Checkout, Orders, Account */

import { Navigate, Outlet } from 'react-router-dom'
import { useIsAuthenticated } from '../hooks'

export default function ProtectedRoute() {
  const isAuthenticated = useIsAuthenticated()
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
