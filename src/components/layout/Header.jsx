/* ===== HEADER COMPONENT ===== */
/* Amazon-style navigation header with search, account, and cart */
/* Provides site-wide navigation and user account dropdown */

import { useEffect, useState } from 'react'
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import {
  useCartCount,
  useCurrentUser,
  useIsAuthenticated,
  useIsAdmin,
  useAppDispatch,
  useLogout,
} from '../../hooks'
import { clearCart } from '../../features/cart/cartSlice'
import { addToast } from '../../features/ui/uiSlice'
import './Header.css'

export default function Header() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const cartCount = useCartCount()
  const user = useCurrentUser()
  const isAuthenticated = useIsAuthenticated()
  const isAdmin = useIsAdmin()
  const logout = useLogout()
  const [searchInput, setSearchInput] = useState(
    searchParams.get('search') ?? ''
  )
  const [searchCategory, setSearchCategory] = useState(
    searchParams.get('category') ?? 'all'
  )
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    setSearchInput(searchParams.get('search') ?? '')
    setSearchCategory(searchParams.get('category') ?? 'all')
  }, [searchParams])

  const handleSearch = (e) => {
    e.preventDefault()
    const q = searchInput.trim()
    const category = searchCategory === 'all' ? '' : searchCategory
    const params = new URLSearchParams()

    if (q) params.set('search', q)
    if (category) params.set('category', category)

    const query = params.toString()
    navigate(query ? `/products?${query}` : '/products')
  }

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
    <header id="top">
      <div className="navbar-top">
        <div className="nav-container">
          <NavLink className="nav-logo-link" to="/">
            <img
              src="https://res.cloudinary.com/dlul8f6xz/image/upload/v1776423136/amazon-logo-white_qyvohr.png"
              alt="Amazon"
              className="nav-logo"
            />
          </NavLink>

          <div className="nav-deliver-to">
            <i className="nav-deliver-to__icon fas fa-map-marker-alt" />
            <div>
              <span className="nav-deliver-to__label">Deliver to</span>
              <span className="nav-deliver-to__location">Pakistan</span>
            </div>
          </div>

          <form className="nav-search" onSubmit={handleSearch}>
            <select
              className="nav-search__select"
              value={searchCategory}
              aria-label="Search department"
              onChange={(e) => setSearchCategory(e.target.value)}
            >
              <option value="all">All</option>
              <option value="Electronics">Electronics</option>
              <option value="Computers">Computers</option>
              <option value="Gaming">Gaming</option>
              <option value="Clothing">Clothing</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Books">Books</option>
              <option value="Beauty">Beauty</option>
            </select>
            <input
              type="text"
              className="nav-search__input"
              placeholder="Search Amazon"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search Amazon"
            />
            <button
              type="submit"
              className="nav-search__btn"
              aria-label="Search"
            >
              <i className="fas fa-search" />
            </button>
          </form>

          <div
            className="nav-account"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  className="nav-account__trigger"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span>Hello, {user?.name ?? 'User'}</span>
                  <span>Account & Lists ▾</span>
                </button>
                {dropdownOpen && (
                  <div className="nav-account__dropdown">
                    <NavLink to="/orders" className="nav-account__link">
                      My Orders
                    </NavLink>
                    <NavLink to="/account" className="nav-account__link">
                      Your Account
                    </NavLink>
                    {isAdmin && (
                      <>
                        <hr
                          style={{
                            margin: '0.5rem 0',
                            border: 'none',
                            borderTop: '1px solid #e3e6e6',
                          }}
                        />
                        <NavLink
                          to="/admin/products"
                          className="nav-account__link"
                        >
                          <i
                            className="fas fa-box"
                            style={{ marginRight: '0.375rem' }}
                          />
                          Manage Products
                        </NavLink>
                        <NavLink
                          to="/admin/users"
                          className="nav-account__link"
                        >
                          <i
                            className="fas fa-users"
                            style={{ marginRight: '0.375rem' }}
                          />
                          Manage Users
                        </NavLink>
                      </>
                    )}
                    <button
                      type="button"
                      className="nav-account__link nav-account__signout"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <NavLink className="nav-account__trigger" to="/login">
                <span>
                  Hello, <b>Sign in</b>
                </span>
                <span>Account & Lists ▾</span>
              </NavLink>
            )}
          </div>

          <NavLink className="nav-orders" to="/orders">
            <span>Returns</span>
            <span>& Orders</span>
          </NavLink>

          <NavLink className="nav-cart" to="/cart">
            <img
              src="https://res.cloudinary.com/dlul8f6xz/image/upload/v1776423160/cart-icon_cyyvqp.png"
              alt=""
            />
            <span className="nav-cart__count">{cartCount}</span>
            <span>Cart</span>
          </NavLink>
        </div>
      </div>

      <nav className="navbar-secondary">
        <div className="nav-container">
          <div className="nav-secondary-left">
            <button type="button" className="nav-all-btn">
              <i className="fas fa-bars" /> <span>All</span>
            </button>
            <NavLink className="nav-secondary-link" to="/products">
              Today&apos;s Deals
            </NavLink>
            <NavLink className="nav-secondary-link" to="/gaming">
              Gaming
            </NavLink>
            <span className="nav-secondary-link">Customer Service</span>
            <span className="nav-secondary-link">Registry</span>
            <span className="nav-secondary-link">Gift Cards</span>
            <span className="nav-secondary-link">Sell</span>
          </div>
          <div className="nav-secondary-right">
            <span className="nav-secondary-link">
              Shop deals in Electronics
            </span>
          </div>
        </div>
      </nav>
    </header>
  )
}
