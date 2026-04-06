import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { logout } from '../../features/auth/authSlice'
import { addToast } from '../../features/ui/uiSlice'
import { setProductFilters } from '../../features/products/productSlice'
import Button from '../UI/Button'

const fallbackCategories = ['Electronics', 'Fashion', 'Home', 'Beauty', 'Books']

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { items, filters } = useAppSelector((state) => state.products)
  const cartCount = useAppSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  )
  const [searchValue, setSearchValue] = useState(filters.search)

  useEffect(() => {
    setSearchValue(filters.search)
  }, [filters.search])

  const categories = [...new Set(items.map((product) => product.category).filter(Boolean))]
  const navCategories = (categories.length ? categories : fallbackCategories).slice(0, 6)

  const handleLogout = () => {
    dispatch(logout())
    dispatch(
      addToast({
        title: 'Signed out',
        message: 'Your session has been cleared safely.',
        type: 'info',
      })
    )
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    dispatch(setProductFilters({ search: searchValue.trim(), page: 1 }))
    if (location.pathname !== '/') {
      navigate('/')
    }
  }

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <div className="header-topbar">
        <div className="container header-topbar__inner">
          <span>Free shipping over $250</span>
          <span>Fast checkout with saved cart state</span>
          <span>Protected customer and admin flows</span>
        </div>
      </div>

      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="Go to homepage">
          <span className="brand-mark">SF</span>
          <div>
            <strong>StoreFront</strong>
            <span>Premium everyday essentials</span>
          </div>
        </Link>

        <form className="header-search" onSubmit={handleSearchSubmit} role="search">
          <span className="header-search__icon" aria-hidden="true">
            Search
          </span>
          <input
            aria-label="Search products"
            type="search"
            placeholder="Search products, brands, and categories"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
          <Button size="sm" type="submit">
            Search
          </Button>
        </form>

        <nav aria-label="Primary" className="main-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/orders">Orders</NavLink>
          {user?.role === 'admin' ? <NavLink to="/admin/products">Admin</NavLink> : null}
        </nav>

        <div className="header-actions">
          <Link className="cart-pill" to="/cart" aria-label={`Open cart with ${cartCount} items`}>
            <span className="cart-pill__icon" aria-hidden="true">
              Cart
            </span>
            <strong>{cartCount}</strong>
          </Link>

          {user ? (
            <>
              <div className="user-pill">
                <strong>{user.name}</strong>
                <span>{user.role === 'admin' ? 'Admin access' : 'Signed in'}</span>
              </div>
              <Button variant="ghost" type="button" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost">
                Sign in
              </Button>
              <Button as={Link} to="/register">
                Create account
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="category-bar">
        <div className="container category-bar__inner">
          {navCategories.map((category) => (
            <button
              key={category}
              className="category-link"
              type="button"
              onClick={() => {
                dispatch(setProductFilters({ category, page: 1 }))
                if (location.pathname !== '/') {
                  navigate('/')
                }
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
