// =====*** IMPORTS ***=====
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Container from '../UI/Container'

// =====*** COMPONENT ***=====
export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('')

  // =====*** HANDLERS ***=====
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // TODO: wire up search routing
      console.log('Searching:', searchQuery)
    }
  }

  // =====*** RENDER UI ***=====
  return (
    <header className="site-header">
      {/* Top utility bar */}
      <div className="header-topbar">
        <div className="header-topbar__inner container">
          <span>🌍 Deliver to Seattle 98101</span>
          <nav className="main-nav" aria-label="Utility navigation">
            <a href="/prime">Prime</a>
            <a href="/deals">Today&apos;s Deals</a>
            <a href="/customer-service">Customer Service</a>
            <a href="/registry">Registry</a>
            <a href="/gift-cards">Gift Cards</a>
            <a href="/sell">Sell</a>
          </nav>
        </div>
      </div>

      {/* Main header */}
      <div className="header-inner container">
        {/* Logo */}
        <Link to="/" className="brand" aria-label="Amazon Home">
          <div className="brand-mark" aria-hidden="true">
            A
          </div>
          <strong>amazon</strong>
        </Link>

        {/* Search bar */}
        <form className="header-search" onSubmit={handleSearch} role="search">
          <span className="header-search__icon" aria-hidden="true">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search Amazon"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search"
          />
        </form>

        {/* Right actions */}
        <div className="main-nav">
          <Link to="/login" className="user-pill">
            <span>
              Hello, <strong>Sign in</strong>
            </span>
          </Link>
          <Link to="/orders" className="user-pill">
            <span>
              Returns <strong>& Orders</strong>
            </span>
          </Link>
          <Link to="/cart" className="cart-pill">
            <span className="cart-pill__icon" aria-hidden="true">
              🛒
            </span>
            <strong>Cart</strong>
          </Link>
        </div>
      </div>

      {/* Category bar */}
      <div className="category-bar">
        <div className="category-bar__inner container">
          <a href="/all" className="category-link">
            ☰ All
          </a>
          <a href="/deals" className="category-link">
            Today&apos;s Deals
          </a>
          <a href="/fresh" className="category-link">
            Amazon Fresh
          </a>
          <a href="/pharmacy" className="category-link">
            Pharmacy
          </a>
          <a href="/registry" className="category-link">
            Registry
          </a>
          <a href="/gift-cards" className="category-link">
            Gift Cards
          </a>
          <a href="/customer-service" className="category-link">
            Customer Service
          </a>
          <a href="/music" className="category-link">
            Music
          </a>
          <a href="/fashion" className="category-link">
            Fashion
          </a>
        </div>
      </div>
    </header>
  )
}
