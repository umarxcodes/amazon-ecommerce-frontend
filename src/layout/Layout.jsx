import { Suspense, lazy } from 'react'
import { Outlet } from 'react-router-dom'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import './Layout.css'

const Header = lazy(() => import('../components/layout/Header'))
const Footer = lazy(() => import('../components/layout/Footer'))

export default function Layout() {
  return (
    <>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Header />
      </Suspense>
      <main className="main-content">
        <Outlet />
      </main>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Footer />
      </Suspense>
    </>
  )
}
