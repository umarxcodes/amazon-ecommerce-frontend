import { Suspense, lazy } from 'react'
import { Outlet } from 'react-router-dom'

// ===*style*===
import './Layout.css'

const Header = lazy(() => import('../components/Header/Header'))
const Footer = lazy(() => import('../components/Footer/Footer'))

// ===*Layout Component*===

export default function Layout() {
  return (
    <>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <main className="main-body-layout">
        <Outlet />
      </main>
      <Suspense fallback={null}>
        <Footer
          columns={[
            {
              title: 'Get to Know Us',
              links: [
                'Careers',
                'Blog',
                'About Amazon',
                'Investor Relations',
                'Amazon Devices',
              ],
            },
            {
              title: 'Make Money with Us',
              links: [
                'Sell products on Amazon',
                'Become an Affiliate',
                'Advertise Your Products',
                'Self-Publish with Us',
              ],
            },
            {
              title: 'Amazon Payment Products',
              links: [
                'Amazon Business Card',
                'Shop with Points',
                'Reload Your Balance',
                'Amazon Currency Converter',
              ],
            },
            {
              title: 'Let Us Help You',
              links: [
                'Your Account',
                'Returns Centre',
                'Recalls and Product Safety Alerts',
                'Help',
              ],
            },
          ]}
        />
      </Suspense>
    </>
  )
}
