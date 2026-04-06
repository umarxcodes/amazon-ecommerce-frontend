import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container page">
      <div className="empty-state">
        <h1>404</h1>
        <p>The page you requested is not part of this storefront.</p>
        <Link to="/" className="primary-button">
          Return home
        </Link>
      </div>
    </div>
  )
}
