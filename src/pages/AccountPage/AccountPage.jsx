import { Link, useNavigate } from 'react-router-dom'
import {
  useCurrentUser,
  useIsAuthenticated,
  useIsAdmin,
  useAppDispatch,
} from '../../hooks'
import { logout } from '../../features/auth/authSlice'
import { clearCart } from '../../features/cart/cartSlice'
import { addToast } from '../../features/ui/uiSlice'
import Button from '../../components/shared/Button'
import SurfaceCard from '../../components/shared/SurfaceCard'
import './AccountPage.css'

const SECTIONS = [
  {
    title: 'Your Orders',
    desc: 'Track, return, or buy again',
    link: '/orders',
    icon: '📦',
  },
  {
    title: 'Payment Settings',
    desc: 'Manage payment methods',
    link: '/checkout',
    icon: '💳',
  },
  {
    title: 'Your Addresses',
    desc: 'Edit addresses for orders',
    link: '/checkout',
    icon: '📍',
  },
  {
    title: 'Browse Products',
    desc: 'Discover new items daily',
    link: '/products',
    icon: '🛍️',
  },
]

export default function AccountPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useCurrentUser()
  const isAuthenticated = useIsAuthenticated()
  const isAdmin = useIsAdmin()

  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCart())
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
      <p className="account-page__subtitle">Hello, {user?.name || 'User'}</p>

      <div className="account-page__grid">
        {SECTIONS.map((s) => (
          <Link key={s.title} to={s.link} className="account-section-card">
            <span className="account-section-card__icon">{s.icon}</span>
            <h3 className="account-section-card__title">{s.title}</h3>
            <p className="account-section-card__desc">{s.desc}</p>
          </Link>
        ))}
      </div>

      {isAdmin && (
        <div className="account-page__admin">
          <h2>Admin</h2>
          <div className="account-page__admin-links">
            <Link to="/admin/products" className="btn btn--ghost">
              Manage Products
            </Link>
            <Link to="/admin/users" className="btn btn--ghost">
              Manage Users
            </Link>
          </div>
        </div>
      )}

      <div className="account-page__signout">
        <Button variant="danger" onClick={handleLogout}>
          Sign Out
        </Button>
      </div>
    </div>
  )
}
