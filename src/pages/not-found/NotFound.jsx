import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import './NotFound.css'

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <h1 className="not-found__code">404</h1>
      <p className="not-found__text">Page not found</p>
      <Link to="/" className="btn btn--primary">Back to Home</Link>
    </div>
  )
}
