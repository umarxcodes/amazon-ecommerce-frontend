import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ToastViewport from '../UI/ToastViewport'

export default function AppShell() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main" id="main-content">
        <Outlet />
      </main>
      <Footer />
      <ToastViewport />
    </div>
  )
}
