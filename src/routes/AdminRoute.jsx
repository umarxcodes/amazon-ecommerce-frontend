import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

export default function AdminRoute() {
  const user = useSelector((s) => s.auth.user)
  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />
}
