/* ===== 404 NOT FOUND PAGE ===== */
/* Displays when user navigates to non-existent routes */
/* Provides links back to home, products, or login */

import { Link } from 'react-router-dom'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <div className="not-found__container">
        <div className="not-found__logo">
          <img
            src="https://res.cloudinary.com/dlul8f6xz/image/upload/v1775646248/amazon_logo_vwm0jl.png"
            alt="Amazon"
          />
        </div>
        <div className="not-found__content">
          <h1 className="not-found__code">404</h1>
          <p className="not-found__title">Page Not Found</p>
          <p className="not-found__description">
            The page you are looking for doesn't exist or has been moved. Please
            check the URL or return to our homepage.
          </p>
          <Link to="/" className="not-found__button">
            Go Back to Amazon
          </Link>
          <div className="not-found__links">
            <Link to="/products">Browse Products</Link>
            <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
