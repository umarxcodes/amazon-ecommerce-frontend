/* ===== PROTECTED ROUTE GUARD ===== */
/* Redirects unauthenticated users to login page with redirect back */
/* Used for: Cart, Checkout, Orders, Account */

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useIsAuthenticated } from '../hooks'

export default function ProtectedRoute() {
  const isAuthenticated = useIsAuthenticated()
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    )
  }

  return <Outlet />
}
