import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  useCartCount,
  useCurrentUser,
  useIsAuthenticated,
  useAppDispatch,
} from '../../hooks/customHooks'
import { logout } from '../../features/auth/authSlice'
import { clearCart } from '../../features/cart/cartSlice'
import { addToast } from '../../features/ui/uiSlice'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './Header.css'

export default function Header() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const cartCount = useCartCount()
  const user = useCurrentUser()
  const isAuthenticated = useIsAuthenticated()
  const [searchInput, setSearchInput] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchInput.trim())}`)
    } else {
      navigate('/products')
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCart())
    setDropdownOpen(false)
    dispatch(
      addToast({
        title: 'Signed out',
        message: 'You have been signed out successfully.',
        type: 'info',
      })
    )
    navigate('/')
  }

  return (
    <header id="top">
      <div className="navbar-top">
        <div className="container">
          {/* Amazon Logo */}
          <NavLink className="amazon-logo-link" to="/">
            <div className="nav-logo">
              <img
                src="https://res.cloudinary.com/dlul8f6xz/image/upload/v1775646248/amazon_logo_vwm0jl.png"
                alt="Amazon Logo"
                className="logo"
              />
            </div>
          </NavLink>

          {/* Delivery Location */}
          <div className="delivery-location">
            <div className="location-icon">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div className="location-text">
              <div className="deliver-to">Deliver to</div>
              <div className="location">Pakistan</div>
            </div>
          </div>

          {/* Search Bar */}
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-container">
              <div className="search-select">
                <select className="search-dropdown" defaultValue="All">
                  <option value="All">All Departments</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Computers">Computers</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Home & Kitchen">Home & Kitchen</option>
                  <option value="Books">Books</option>
                  <option value="Beauty">Beauty</option>
                </select>
                <span className="dropdown-arrow">
                  <i className="fas fa-caret-down"></i>
                </span>
              </div>
              <input
                type="text"
                className="search-input"
                placeholder="Search Amazon"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                aria-label="Search Amazon"
              />
              <button
                type="submit"
                className="search-button"
                aria-label="Search"
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>

          {/* Account & Lists */}
          <div
            className="account-section"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
            style={{ position: 'relative' }}
          >
            {isAuthenticated ? (
              <>
                <NavLink
                  className="sign-in-page"
                  to="#"
                  onClick={(e) => e.preventDefault()}
                >
                  <div className="account-line1">
                    Hello, {user?.name || 'User'}
                  </div>
                  <div className="account-line2">
                    Account & Lists
                    <i className="fas fa-caret-down"></i>
                  </div>
                </NavLink>
                {dropdownOpen && (
                  <div className="account-dropdown">
                    <NavLink to="/orders" className="account-dropdown__link">
                      My Orders
                    </NavLink>
                    <NavLink to="/checkout" className="account-dropdown__link">
                      Your Account
                    </NavLink>
                    <button
                      className="account-dropdown__link account-dropdown__signout"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <NavLink className="sign-in-page" to="/login">
                <div className="account-line1">
                  Hello, <span>Sign In</span>
                </div>
                <div className="account-line2">
                  Account & Lists
                  <i className="fas fa-caret-down"></i>
                </div>
              </NavLink>
            )}
          </div>

          {/* Returns & Orders */}
          <NavLink className="returns-section" to="/orders">
            <div className="returns-line1">Returns</div>
            <div className="returns-line2">& Orders</div>
          </NavLink>

          {/* Cart */}
          <NavLink className="cart-icon" to="/cart">
            <div className="cart-section">
              <img
                src="https://res.cloudinary.com/dlul8f6xz/image/upload/v1775645116/cart-icon_1_edned4.png"
                alt="cartIcon"
              />
              <div className="cart-count">{cartCount}</div>
              <span className="cart-link-span">Cart</span>
            </div>
          </NavLink>
        </div>
      </div>

      {/* Secondary Navigation Bar */}
      <div className="navbar-secondary">
        <div className="container">
          <div className="nav-left">
            <div className="all-menu">
              <i className="fas fa-bars"></i>
              <span>All</span>
            </div>
            <NavLink className="nav-item" to="/products">
              Today's Deals
            </NavLink>
            <div className="nav-item">Customer Service</div>
            <div className="nav-item">Registry</div>
            <div className="nav-item">Gift Cards</div>
            <div className="nav-item">Sell</div>
          </div>
          <div className="nav-right">
            <div className="nav-item">Shop deals in Electronics</div>
          </div>
        </div>
      </div>
    </header>
  )
}
