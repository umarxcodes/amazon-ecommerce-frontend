/* ===== ROOT APP COMPONENT ===== */
/* Wraps the entire application with routes and toast notification system */

import ToastViewport from './features/ui/components/ToastViewport'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <>
      <AppRoutes />
      <ToastViewport />
    </>
  )
}
