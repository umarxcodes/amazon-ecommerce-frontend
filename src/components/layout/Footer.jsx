/* ===== FOOTER COMPONENT ===== */
/* Amazon-style footer with navigation links and legal information */
/* Displays company info, help links, and back-to-top button */

import { Link } from 'react-router-dom'
import './Footer.css'

const FOOTER_COLUMNS = [
  {
    title: 'Get to Know Us',
    links: [
      'Careers',
      'Blog',
      'About Amazon',
      'Investor Relations',
      'Amazon Devices',
    ],
  },
  {
    title: 'Make Money with Us',
    links: [
      'Sell products on Amazon',
      'Become an Affiliate',
      'Advertise Your Products',
      'Self-Publish with Us',
    ],
  },
  {
    title: 'Amazon Payment Products',
    links: [
      'Amazon Business Card',
      'Shop with Points',
      'Reload Your Balance',
      'Amazon Currency Converter',
    ],
  },
  {
    title: 'Let Us Help You',
    links: [
      'Your Account',
      'Returns Centre',
      'Recalls and Product Safety Alerts',
      'Help',
    ],
  },
]

export default function Footer() {
  return (
    <footer className="footer">
      <a href="#top" className="footer__back-to-top">
        Back to top
      </a>
      <div className="footer__columns">
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title} className="footer__column">
            <h3 className="footer__column-title">{col.title}</h3>
            <ul className="footer__links">
              {col.links.map((link) => (
                <li key={link}>
                  <Link className="footer__link" to="/products">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer__bottom">
        <img
          src="https://res.cloudinary.com/dlul8f6xz/image/upload/v1775646248/amazon_logo_vwm0jl.png"
          alt="Amazon"
          className="footer__logo"
        />
        <div className="footer__legal">
          <span>© 1996–2026, Amazon.com, Inc. or its affiliates</span>
          <div className="footer__legal-links">
            <a href="#">Conditions of Use</a>
            <a href="#">Privacy Notice</a>
            <a href="#">Interest-Based Ads</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
