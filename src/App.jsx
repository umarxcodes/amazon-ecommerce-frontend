/* ===== ROOT APP COMPONENT ===== */
/* Wraps the entire application with routes, toast notifications, and auth restore */

import ToastViewport from './features/ui/components/ToastViewport'
import AuthRestore from './features/auth/AuthRestore'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <>
      <AuthRestore />
      <AppRoutes />
      <ToastViewport />
    </>
  )
}
