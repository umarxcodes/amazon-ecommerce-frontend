import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useOrders, useOrderStatus, useFetchCart } from '../../hooks'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import EmptyState from '../../components/shared/EmptyState'
import { formatCurrency, formatDate } from '../../utils/helpers'
import './OrdersPage.css'

const ORDER_FILTERS = [
  { key: 'all', label: 'All Orders' },
  { key: '30', label: 'Last 30 days' },
  { key: '90', label: 'Last 3 months' },
  { key: '2025', label: '2025' },
  { key: '2024', label: '2024' },
]

const STATUS_CLASS_MAP = {
  delivered: 'order-card__status--delivered',
  shipped: 'order-card__status--shipped',
  pending: 'order-card__status--pending',
  cancelled: 'order-card__status--cancelled',
}

function OrderCard({ order }) {
  const status = (order.status || 'pending').toLowerCase()
  const statusClass = STATUS_CLASS_MAP[status] || STATUS_CLASS_MAP.pending

  return (
    <div className="order-card">
      <div className="order-card__header">
        <div className="order-card__meta">
          <span className={`order-card__status ${statusClass}`}>
            {order.status || 'Pending'}
          </span>
          <span className="order-card__date">
            {formatDate(order.createdAt)}
          </span>
        </div>
        <span className="order-card__id">
          Order #{order._id?.slice(-8).toUpperCase()}
        </span>
      </div>

      <div className="order-card__body">
        <div className="order-card__items">
          {order.items?.slice(0, 3).map((item) => (
            <Link
              key={item.productId || item._id}
              to={`/products/${item.productId}`}
              className="order-card__item-img"
            >
              <img
                src={item.image || 'https://placehold.co/60x60'}
                alt={item.title}
                loading="lazy"
              />
            </Link>
          ))}
        </div>

        <div className="order-card__total">
          Total:{' '}
          <strong>{formatCurrency(order.totalAmount || order.total)}</strong>
        </div>

        <Link to={`/orders/${order._id}`} className="order-card__details-btn">
          View details
        </Link>
      </div>
    </div>
  )
}

export default function OrdersPage() {
  const orders = useOrders()
  const status = useOrderStatus()
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    // Orders fetched via ProtectedRoute preload or manual trigger
  }, [])

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (activeFilter === 'all') return true

      const orderDate = new Date(order.createdAt)
      const now = new Date()

      if (activeFilter === '30') {
        const cutoff = new Date()
        cutoff.setDate(now.getDate() - 30)
        return orderDate >= cutoff
      }

      if (activeFilter === '90') {
        const cutoff = new Date()
        cutoff.setMonth(now.getMonth() - 3)
        return orderDate >= cutoff
      }

      return String(orderDate.getFullYear()) === activeFilter
    })
  }, [orders, activeFilter])

  if (status === 'loading')
    return <LoadingSpinner label="Loading orders..." fullScreen />

  if (!orders.length)
    return (
      <EmptyState
        title="No orders yet"
        description="Your order history will appear here."
        action={
          <Link to="/products" className="btn btn--primary">
            Shop Now
          </Link>
        }
      />
    )

  return (
    <div className="orders-page">
      <h1 className="orders-page__title">Your Orders</h1>

      <div
        className="orders-page__filters"
        role="tablist"
        aria-label="Filter orders"
      >
        {ORDER_FILTERS.map((filter) => (
          <button
            key={filter.key}
            type="button"
            role="tab"
            aria-selected={activeFilter === filter.key}
            className={`orders-page__filter-btn ${
              activeFilter === filter.key
                ? 'orders-page__filter-btn--active'
                : ''
            }`}
            onClick={() => setActiveFilter(filter.key)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="orders-page__list">
        {filteredOrders.length === 0 ? (
          <EmptyState
            title="No orders for this period"
            description="Try a different date range."
          />
        ) : (
          filteredOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))
        )}
      </div>
    </div>
  )
}
