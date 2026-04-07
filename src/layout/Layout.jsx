import { Suspense, lazy } from 'react'
import { Outlet } from 'react-router-dom'

// ===*style*===
import './Layout.css'

const Sign = lazy(() => import('../components/Sign_in/Sign_in'))
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
        <Sign />
      </Suspense>
      <Suspense fallback={null}>
        <Footer
          linkGroups={[
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
                'Currency Converter',
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
