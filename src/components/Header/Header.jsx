// styles
import './Header.css'

// NavLink
import { NavLink } from 'react-router-dom'

import '@fortawesome/fontawesome-free/css/all.min.css'

export default function Header() {
  return (
    <header id="top">
      <div className="navbar-top">
        <div className="container">
          <NavLink className="amazon-logo-link" to={'/'}>
            <div className="nav-logo">
              <img
                src="/src/assets/images/amazon_logo.png"
                alt="Amazon Logo"
                className="logo"
              />
            </div>
          </NavLink>

          {/* <!-- Delivery Location --> */}
          <div className="delivery-location">
            <div className="location-icon">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div className="location-text">
              <div className="deliver-to">Deliver to</div>
              <div className="location">Peshawar</div>
            </div>
          </div>

          {/* <!-- Search Bar --> */}
          <form className="search-form">
            <div className="search-container">
              <div className="search-select">
                <select className="search-dropdown" defaultValue="All">
                  <option value="All">All Departments</option>
                  <option value="Arts">Arts & Crafts</option>
                  <option value="Baby">Baby</option>
                  <option value="Beauty">Beauty & Personal Care</option>
                  <option value="Computers">Computers</option>
                  <option value="Deals">Today's Deals</option>
                </select>
                <span className="dropdown-arrow">
                  <i className="fas fa-caret-down"></i>
                </span>
              </div>
              <input
                type="text"
                className="search-input"
                placeholder="Search Amazon"
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
          {/* <!-- Account & Lists --> */}
          <div className="account-section">
            <NavLink className="sign-in-page" to={'/Login'}>
              <div className="account-line1">
                Hello, <span className="Sign_in_span">Sign In</span>
              </div>
              <div className="account-line2">
                Account & Lists
                <i className="fas fa-caret-down"></i>
              </div>
            </NavLink>
          </div>

          {/* <!-- Returns & Orders --> */}
          <div className="returns-section">
            <div className="returns-line1">Returns</div>
            <div className="returns-line2">& Orders</div>
          </div>

          {/* <!-- Cart --> */}
          <NavLink className="cart-icon " to="/CartPage">
            <div className="cart-section">
              <img src="/src/assets/images/cart-icon.png" alt="cartIcon" />
              <div className="cart-count">0</div>
              <span className="cart-link-span">Cart</span>
            </div>
          </NavLink>
        </div>
      </div>

      {/* <!-- Secondary Navigation Bar --> */}
      <div className="navbar-secondary">
        <div className="container">
          <div className="nav-left">
            <div className="all-menu">
              <i className="fas fa-bars"></i>
              <span>All</span>
            </div>
            <div className="nav-item">Today's Deals</div>
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
