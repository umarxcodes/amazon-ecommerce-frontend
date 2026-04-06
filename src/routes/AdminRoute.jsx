import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'

export default function AdminRoute() {
  const user = useAppSelector((state) => state.auth.user)

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
