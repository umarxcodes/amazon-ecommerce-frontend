import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthToken } from '../hooks/customHooks'

export default function ProtectedRoute() {
  const location = useLocation()
  const token = useAuthToken()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
