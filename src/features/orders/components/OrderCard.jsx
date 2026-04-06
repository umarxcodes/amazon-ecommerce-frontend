import { Link } from 'react-router-dom'
import { formatCurrency, formatDate } from '../../../utils/helpers'

export default function OrderCard({ order }) {
  return (
    <article className="order-card">
      <div>
        <span className="chip">{order.status}</span>
        <h3>Order #{order._id}</h3>
        <p>Placed on {formatDate(order.createdAt)}</p>
      </div>

      <div className="order-card__meta">
        <strong>{formatCurrency(order.totalAmount)}</strong>
        <Link to={`/orders/${order._id}`} className="ghost-button">
          View details
        </Link>
      </div>
    </article>
  )
}
