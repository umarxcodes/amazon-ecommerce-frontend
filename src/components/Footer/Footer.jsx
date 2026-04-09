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
export default function Footer({ columns, services }) {
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
          {columns?.map((group) => (
            <FooterColumn
              key={group.title}
              title={group.title}
              links={group.links}
            />
          ))}
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="footer-logo">
            <img
              src="https://res.cloudinary.com/dlul8f6xz/image/upload/v1775646248/amazon_logo_vwm0jl.png"
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
              <span className="currency-symbol">PKR</span>
              <span>Pakistani Rupee</span>
            </div>
            <div className="country-selector">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZSSWew2B0nqzF4FUO7I-wnRaKpo1KANswquusvLqfyQ&s"
                alt="USA"
                className="country-flag"
              />
              <span>Pakistan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="footer-links">
        <div className="footer-links-container">
          {services?.map((service) => (
            <div key={service.title} className="footer-links-group">
              <a href="#">{service.title}</a>
              <span>{service.description}</span>
            </div>
          ))}
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
