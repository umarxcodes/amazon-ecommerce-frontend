import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrders, useOrderStatus, useFetchCart } from '../../hooks'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import { formatCurrency, formatDate } from '../../utils/helpers'
import './OrdersPage.css'

const FILTERS = [{ key: 'all', label: 'All' }, { key: '30', label: 'Last 30 days' }, { key: '3', label: 'Last 3 months' }, { key: '2025', label: '2025' }, { key: '2024', label: '2024' }]

export default function OrdersPage() {
  const orders = useOrders()
  const status = useOrderStatus()
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    // orders fetched via ProtectedRoute preload or manual trigger
  }, [])

  const filtered = orders.filter((o) => {
    if (activeFilter === 'all') return true
    if (activeFilter === '30') { const d = new Date(); d.setDate(d.getDate() - 30); return new Date(o.createdAt) >= d }
    if (activeFilter === '3') { const d = new Date(); d.setMonth(d.getMonth() - 3); return new Date(o.createdAt) >= d }
    return String(new Date(o.createdAt).getFullYear()) === activeFilter
  })

  if (status === 'loading') return <LoadingSpinner label="Loading orders..." fullScreen />
  if (!orders.length) return <EmptyState title="No orders yet" description="Your order history will appear here." action={<Link to="/products" className="btn btn--primary">Shop Now</Link>} />

  return (
    <div className="orders-page">
      <h1 className="orders-page__title">Your Orders</h1>
      <div className="orders-page__filters">
        {FILTERS.map((f) => (
          <button key={f.key} type="button" className={`orders-page__filter-btn ${activeFilter === f.key ? 'orders-page__filter-btn--active' : ''}`} onClick={() => setActiveFilter(f.key)}>{f.label}</button>
        ))}
      </div>
      <div className="orders-page__list">
        {filtered.length === 0 ? (
          <EmptyState title="No orders for this period" description="Try a different date range." />
        ) : (
          filtered.map((o) => (
            <div key={o._id} className="order-card">
              <div className="order-card__header">
                <div className="order-card__meta">
                  <span className={`order-card__status order-card__status--${(o.status || 'pending').toLowerCase()}`}>{o.status || 'Pending'}</span>
                  <span className="order-card__date">{formatDate(o.createdAt)}</span>
                </div>
                <span className="order-card__id">Order #{o._id?.slice(-8).toUpperCase()}</span>
              </div>
              <div className="order-card__body">
                <div className="order-card__items">
                  {o.items?.slice(0, 3).map((item) => (
                    <Link key={item.productId || item._id} to={`/products/${item.productId}`} className="order-card__item-img">
                      <img src={item.image || 'https://placehold.co/60x60'} alt={item.title} />
                    </Link>
                  ))}
                </div>
                <div className="order-card__total">Total: <strong>{formatCurrency(o.totalAmount || o.total)}</strong></div>
                <Link to={`/orders/${o._id}`} className="order-card__details">View details</Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
