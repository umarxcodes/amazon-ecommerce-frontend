/*
📁 FILE: Footer.jsx
📌 PURPOSE: Amazon-style footer with links and branding
======================================
*/

// =====*** IMPORTS ***=====
import './Footer.css'

// =====*** COMPONENT: FooterColumn ***=====
function FooterColumn({ title, links }) {
  return (
    <div className="footer-column">
      <h3>{title}</h3>
      <ul>
        {links.map((link) => (
          <li key={link}>
            <a href="#">{link}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

// =====*** COMPONENT ***=====
export default function Footer({ linkGroups }) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="amazon-footer">
      {/* Back to Top */}
      <div
        className="footer-back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Back to top
      </div>

      {/* Main Footer */}
      <div className="footer-main">
        <div className="footer-container">
          {linkGroups?.map((group) => (
            <FooterColumn key={group.title} {...group} />
          ))}
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="footer-logo">
            <img
              src="/src/assets/images/amazon_logo.png"
              alt="Amazon Logo"
              className="footer-amazon-logo"
            />
          </div>
          <div className="footer-locale">
            <div className="locale-selector">
              <i className="fas fa-globe"></i>
              <span>English</span>
            </div>
            <div className="currency-selector">
              <span className="currency-symbol">$</span>
              <span>USD - U.S. Dollar</span>
            </div>
            <div className="country-selector">
              <img
                src="https://images-na.ssl-images-amazon.com/images/G/01/x-locale/cs/help/images/gateway/us_flag._CB370028093_.gif"
                alt="USA"
                className="country-flag"
              />
              <span>United States</span>
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
            <a href="#">6pm</a>
            <span>Score deals on fashion brands</span>
          </div>
          <div className="footer-links-group">
            <a href="#">IMDb</a>
            <span>Movies, TV & Celebrities</span>
          </div>
          <div className="footer-links-group">
            <a href="#">Box Office Mojo</a>
            <span>Movie Box Office Data</span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-copyright">
        <div className="copyright-container">
          <div className="copyright-links">
            <a href="#">Conditions of Use</a>
            <a href="#">Privacy Notice</a>
            <a href="#">Interest-Based Ads</a>
          </div>
          <div className="copyright-text">
            © 1996-{currentYear}, Amazon.com, Inc. or its affiliates
          </div>
        </div>
      </div>
    </footer>
  )
}
