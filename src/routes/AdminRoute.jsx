import { Navigate, Outlet } from 'react-router-dom'
import { useIsAdmin } from '../hooks/customHooks'

export default function AdminRoute() {
  const isAdmin = useIsAdmin()

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
