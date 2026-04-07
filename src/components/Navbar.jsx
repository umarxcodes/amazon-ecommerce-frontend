import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import amazonLogo from '../assets/images/amazon_logo.png'
import usFlag from '../assets/images/uSA.png'

const departments = [
  'All',
  'Arts & Crafts',
  'Beauty',
  'Books',
  'Computers',
  "Today's Deals",
  'Fashion',
  'Home',
]

const secondaryLinks = [
  'All',
  "Today's Deals",
  'Prime Video',
  'Buy Again',
  'Customer Service',
  'Registry',
  'Gift Cards',
  'Sell',
]

function Icon({ children }) {
  return (
    <span className="amazon-home-icon" aria-hidden="true">
      {children}
    </span>
  )
}

export default function Navbar() {
  const user = useSelector((state) => state.auth?.user)
  const cartCount = useSelector((state) =>
    (state.cart?.items ?? []).reduce((total, item) => total + item.quantity, 0)
  )
  const [department, setDepartment] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <header className="amazon-home-nav" id="top">
      <div className="amazon-home-nav__top">
        <div className="amazon-home-shell amazon-home-nav__inner">
          <Link
            className="amazon-home-nav__panel amazon-home-nav__logo"
            to="/"
            aria-label="Amazon home"
          >
            <img src={amazonLogo} alt="Amazon" />
          </Link>

          <button className="amazon-home-nav__panel amazon-home-nav__delivery" type="button">
            <Icon>
              <svg viewBox="0 0 24 24" focusable="false">
                <path
                  d="M12 2.5a6.5 6.5 0 0 0-6.5 6.5c0 4.93 6.5 12.5 6.5 12.5s6.5-7.57 6.5-12.5A6.5 6.5 0 0 0 12 2.5Zm0 9a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
                  fill="currentColor"
                />
              </svg>
            </Icon>
            <span>
              <small>Deliver to</small>
              <strong>New York 10001</strong>
            </span>
          </button>

          <form className="amazon-home-nav__search" onSubmit={handleSearchSubmit} role="search">
            <label className="amazon-home-nav__category">
              <span className="sr-only">Choose a department</span>
              <select value={department} onChange={(event) => setDepartment(event.target.value)}>
                {departments.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <input
              aria-label="Search Amazon"
              type="search"
              placeholder="Search Amazon"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />

            <button className="amazon-home-nav__search-button" type="submit" aria-label="Search">
              <svg viewBox="0 0 24 24" focusable="false">
                <path
                  d="M10.5 3a7.5 7.5 0 1 0 4.69 13.35l4.73 4.73 1.41-1.41-4.73-4.73A7.5 7.5 0 0 0 10.5 3Zm0 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </form>

          <button className="amazon-home-nav__panel amazon-home-nav__locale" type="button">
            <img src={usFlag} alt="" />
            <strong>EN</strong>
            <span className="amazon-home-nav__caret">▾</span>
          </button>

          <Link className="amazon-home-nav__panel amazon-home-nav__action" to="/Login">
            <span>Hello, {user?.name?.split(' ')[0] ?? 'sign in'}</span>
            <strong>
              Account &amp; Lists <span className="amazon-home-nav__caret">▾</span>
            </strong>
          </Link>

          <Link className="amazon-home-nav__panel amazon-home-nav__action" to="/orders">
            <span>Returns</span>
            <strong>&amp; Orders</strong>
          </Link>

          <Link className="amazon-home-nav__panel amazon-home-nav__cart" to="/CartPage">
            <Icon>
              <svg viewBox="0 0 24 24" focusable="false">
                <path
                  d="M7 18a2 2 0 1 0 2 2 2 2 0 0 0-2-2Zm10 0a2 2 0 1 0 2 2 2 2 0 0 0-2-2ZM7.24 14h9.71a2 2 0 0 0 1.94-1.51L21 5H6.21l-.44-2H2v2h2.16l2.05 9.42A2 2 0 0 0 8.17 16H19v-2H8.17Z"
                  fill="currentColor"
                />
              </svg>
            </Icon>
            <span className="amazon-home-nav__cart-count">{cartCount}</span>
            <strong>Cart</strong>
          </Link>
        </div>
      </div>

      <nav className="amazon-home-nav__secondary" aria-label="Shop departments">
        <div className="amazon-home-shell amazon-home-nav__secondary-inner">
          {secondaryLinks.map((link) => (
            <button key={link} className="amazon-home-nav__secondary-link" type="button">
              {link === 'All' ? (
                <>
                  <span aria-hidden="true">☰</span>
                  {link}
                </>
              ) : (
                link
              )}
            </button>
          ))}

          <a className="amazon-home-nav__secondary-promo" href="#top-categories">
            Shop deals in Electronics
          </a>
        </div>
      </nav>
    </header>
  )
}
