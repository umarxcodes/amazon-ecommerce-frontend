/* ===== ACCOUNT PAGE ===== */
/* User account dashboard with quick links to orders, addresses, payments */
/* Shows admin links if user has admin role */

import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  useCurrentUser,
  useIsAuthenticated,
  useIsAdmin,
  useAppDispatch,
  useLogout,
} from '../../hooks'
import { clearCart } from '../../features/cart/cartSlice'
import { addToast } from '../../features/ui/uiSlice'
import Button from '../../components/shared/Button'
import './AccountPage.css'

const SECTIONS = [
  {
    title: 'Your Orders',
    desc: 'Track, return, or buy again',
    link: '/orders',
    icon: 'fas fa-box-open',
  },
  {
    title: 'Payment Settings',
    desc: 'Manage payment methods',
    link: '/checkout',
    icon: 'fas fa-credit-card',
  },
  {
    title: 'Your Addresses',
    desc: 'Edit addresses for orders',
    link: '/checkout',
    icon: 'fas fa-map-marker-alt',
  },
  {
    title: 'Browse Products',
    desc: 'Discover new items daily',
    link: '/products',
    icon: 'fas fa-store',
  },
]

export default function AccountPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useCurrentUser()
  const isAuthenticated = useIsAuthenticated()
  const isAdmin = useIsAdmin()
  const logout = useLogout()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  const handleLogout = () => {
    dispatch(clearCart())
    logout()
    dispatch(
      addToast({
        title: 'Signed out',
        message: 'You have been signed out.',
        type: 'info',
      })
    )
    navigate('/')
  }

  return (
    <div className="account-page">
      <h1 className="account-page__title">Your Account</h1>
      <p className="account-page__subtitle">Hello, {user?.name ?? 'User'}</p>

      <div className="account-page__grid">
        {SECTIONS.map((s) => (
          <Link key={s.title} to={s.link} className="account-section-card">
            <i className={`account-section-card__icon ${s.icon}`} />
            <h3 className="account-section-card__title">{s.title}</h3>
            <p className="account-section-card__desc">{s.desc}</p>
          </Link>
        ))}
      </div>

      {isAdmin && (
        <div className="account-page__admin">
          <h2>
            <i className="fas fa-user-shield" /> Admin Dashboard
          </h2>
          <div className="account-page__admin-links">
            <Link to="/admin/products" className="btn--ghost">
              <i className="fas fa-box" /> Manage Products
            </Link>
            <Link to="/admin/users" className="btn--ghost">
              <i className="fas fa-users" /> Manage Users
            </Link>
          </div>
        </div>
      )}

      <div className="account-page__signout">
        <Button
          variant="danger"
          onClick={handleLogout}
          icon="fas fa-sign-out-alt"
        >
          Sign Out
        </Button>
      </div>
    </div>
  )
}
