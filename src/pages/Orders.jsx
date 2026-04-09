import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useOrders, useOrderStatus } from '../hooks/customHooks'
import { fetchOrders } from '../features/orders/orderSlice'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import EmptyState from '../components/UI/EmptyState'
import { formatCurrency, formatDate } from '../utils/helpers'
import './Orders.css'

const FILTER_TABS = [
  { label: 'All Orders', value: 'all' },
  { label: 'Past 30 Days', value: '30days' },
  { label: 'Past 3 Months', value: '3months' },
  { label: '2025', value: '2025' },
  { label: '2024', value: '2024' },
]

function OrderCard({ order }) {
  const items = order.items || order.products || []
  const thumbnails = items.slice(0, 3)
  const total =
    order.total ||
    items.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    )

  return (
    <div className="order-card">
      <div className="order-card__header">
        <div className="order-card__header-left">
          <span className="order-card__label">Order placed</span>
          <span className="order-card__date">
            {formatDate(order.createdAt || order.orderDate)}
          </span>
        </div>
        <div className="order-card__header-right">
          <span className="order-card__total">
            Total: {formatCurrency(total)}
          </span>
          <span className="order-card__ship-to">
            Ship to: {order.user?.name || 'Customer'}
          </span>
        </div>
      </div>

      <div className="order-card__body">
        <div className="order-card__thumbnails">
          {thumbnails.map((item, i) => (
            <Link
              key={i}
              to={`/products/${item.productId || item._id}`}
              className="order-card__thumb"
            >
              <img
                src={item.image || '/placeholder-product.png'}
                alt={item.name || item.title}
                width="80"
                height="80"
              />
            </Link>
          ))}
          {items.length > 3 && (
            <Link to={`/orders/${order._id}`} className="order-card__more">
              +{items.length - 3} more
            </Link>
          )}
        </div>

        <div className="order-card__actions">
          <Link to={`/orders/${order._id}`} className="order-card__view">
            View order details
          </Link>
          <span className="order-card__order-id">
            Order #{order._id?.slice(-8) || order.id}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Orders() {
  const dispatch = useAppDispatch()
  const orders = useOrders()
  const status = useOrderStatus()
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === 'all') return true
    const orderDate = new Date(order.createdAt || order.orderDate)
    const now = new Date()

    if (activeFilter === '30days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      return orderDate >= thirtyDaysAgo
    }
    if (activeFilter === '3months') {
      const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      return orderDate >= threeMonthsAgo
    }
    // Year filter
    if (activeFilter) {
      return orderDate.getFullYear() === Number(activeFilter)
    }
    return true
  })

  if (status === 'loading' && !orders.length) {
    return <LoadingSpinner label="Loading your orders..." />
  }

  if (!orders.length) {
    return (
      <EmptyState
        title="No orders yet"
        description="Looks like you haven't placed any orders yet."
        action={
          <Link to="/products" className="btn-primary">
            Start Shopping
          </Link>
        }
      />
    )
  }

  return (
    <div className="orders-page">
      <div className="orders-page__container">
        <div className="orders-page__header">
          <h1 className="orders-page__title">
            Your Orders ({filteredOrders.length})
          </h1>
        </div>

        {/* Filter tabs */}
        <div className="orders-page__filters">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={`orders-page__filter ${activeFilter === tab.value ? 'orders-page__filter--active' : ''}`}
              onClick={() => setActiveFilter(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders list */}
        <div className="orders-page__list">
          {filteredOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      </div>
    </div>
  )
}
