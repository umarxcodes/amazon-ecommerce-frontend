// ===*CSS*===

import './Footer.css'

import { NavLink } from 'react-router-dom'

// ===* Footer Component *===
export default function Footer() {

  // ===* Scroll to Top Function *===
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })

  }

  // ===*Date  For Footer *===

  const date = new Date().getFullYear()

  return (
    <footer className="amazon-footer">
      {/* Back to Top Button */}
      <div className="footer-back-to-top" onClick={scrollToTop}>
        Back to top
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-container">
          {/* Get to Know Us */}
          <div className="footer-column">
            <h3>Get to Know Us</h3>
            <ul>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">About Amazon</a>
              </li>
              <li>
                <a href="#">Investor Relations</a>
              </li>
              <li>
                <a href="#">Amazon Devices</a>
              </li>
              <li>
                <a href="#">Amazon Science</a>
              </li>
            </ul>
          </div>

          {/* Make Money with Us */}
          <div className="footer-column">
            <h3>Make Money with Us</h3>
            <ul>
              <li>  
                <a href="#">Sell products on Amazon</a>
              </li>
              <li>
                <a href="#">Sell on Amazon Business</a>
              </li>
              <li>
                <a href="#">Sell apps on Amazon</a>
              </li>
              <li>
                <a href="#">Become an Affiliate</a>
              </li>
              <li>
                <a href="#">Advertise Your Products</a>
              </li>
              <li>
                <a href="#">Self-Publish with Us</a>
              </li>
              <li>
                <a href="#">Host an Amazon Hub</a>
              </li>
              <li>
                <a href="#"> See More Make Money with Us</a>
              </li>
            </ul>
          </div>

          {/* Amazon Payment Products */}
          <div className="footer-column">
            <h3>Amazon Payment Products</h3>
            <ul>
              <li>
                <a href="#">Amazon Business Card</a>
              </li>
              <li>
                <a href="#">Shop with Points</a>
              </li>
              <li>
                <a href="#">Reload Your Balance</a>
              </li>
              <li>
                <a href="#">Amazon Currency Converter</a>
              </li>
            </ul>
          </div>

          {/* Let Us Help You */}
          <div className="footer-column">
            <h3>Let Us Help You</h3>
            <ul>
              <li>
                <a href="#">Amazon and COVID-19</a>
              </li>
              <li>
                <a href="#">Your Account</a>
              </li>
              <li>
                <a href="#">Your Orders</a>
              </li>
              <li>
                <a href="#">Shipping Rates & Policies</a>
              </li>
              <li>
                <a href="#">Returns & Replacements</a>
              </li>
              <li>
                <a href="#">Manage Your Content and Devices</a>
              </li>
              <li>
                <a href="#">Help</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          {/* Amazon Logo */}
          <div className="footer-logo">
            <NavLink to="/">
              <img
                src="/src/assets/images/amazon_logo.png"
                alt="Amazon Logo"
                className="footer-amazon-logo"
              />
            </NavLink>
          </div>

          {/* Language and Country Selector */}
          <div className="footer-locale">
            <div className="locale-selector">
              <i className="fas fa-globe"></i>
              <select className="search-dropdown">
                <option value="English">English</option>
                <option value="Urdu">Urdu</option>
              </select>
              <i className="fas fa-caret-down"></i>
            </div>

            <div className="currency-selector">
              <span className="currency-symbol">$</span>
              <span className="currency-text">USD - U.S. Dollar</span>
              <i className="fas fa-caret-down"></i>
            </div>

            <div className="country-selector">
              <img
                src="/src/assets/images/uSA.png"
                alt="USA Flag"
                className="country-flag"
              />
              <span className="country-text">United States</span>
              <i className="fas fa-caret-down"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="footer-links">
        <div className="footer-links-container">
          <div className="footer-links-group">
            <a href="#">Amazon Music</a>
            <span>Stream millions of songs</span>
          </div>

          <div className="footer-links-group">
            <a href="#">Amazon Advertising</a>
            <span>Find, attract, and engage customers</span>
          </div>

          <div className="footer-links-group">
            <a href="#">Amazon Drive</a>
            <span>Cloud storage from Amazon</span>
          </div>

          <div className="footer-links-group">
            <a href="#">6pm</a>
            <span>Score deals on fashion brands</span>
          </div>

          <div className="footer-links-group">
            <a href="#">AbeBooks</a>
            <span>Books, art & collectibles</span>
          </div>

          <div className="footer-links-group">
            <a href="#">ACX</a>
            <span>Audiobook Publishing Made Easy</span>
          </div>

          <div className="footer-links-group">
            <a href="#">Sell on Amazon</a>
            <span>Start a Selling Account</span>
          </div>

          <div className="footer-links-group">
            <a href="#">Amazon Business</a>
            <span>Everything For Your Business</span>
          </div>

          <div className="footer-links-group">
            <a href="#">Amazon Fresh</a>
            <span>Groceries & More Right To Your Door</span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-copyright">
        <div className="copyright-container">
          <div className="copyright-links">
            <a href="#">Conditions of Use</a>
            <a href="#">Privacy Notice</a>
            <a href="#">Your Ads Privacy Choices</a>
          </div>
          <div className="copyright-text">
            © 1996-{date}, Amazon.com, Inc. or its affiliates
          </div>
        </div>
      </div>
    </footer>
  )
}
