import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppDispatch, useSelectedOrder, useOrderDetailStatus, useFetchCart } from '../../hooks'
import { fetchOrderById } from '../../features/orders/orderSlice'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import EmptyState from '../../components/shared/EmptyState'
import { formatCurrency, formatDate } from '../../utils/helpers'
import Button from '../../components/shared/Button'
import './OrderDetailPage.css'

export default function OrderDetailPage() {
  const { orderId } = useParams()
  const dispatch = useAppDispatch()
  const order = useSelectedOrder()
  const status = useOrderDetailStatus()

  useEffect(() => { if (orderId) dispatch(fetchOrderById(orderId)) }, [dispatch, orderId])

  if (status === 'loading') return <LoadingSpinner label="Loading order..." fullScreen />
  if (!order) return <EmptyState title="Order not found" description="We couldn't find this order." action={<Link to="/orders" className="btn btn--primary">Back to Orders</Link>} />

  return (
    <div className="order-detail-page">
      <Link to="/orders" className="order-detail-page__back">← Back to Orders</Link>
      <h1 className="order-detail-page__title">Order #{order._id?.slice(-8).toUpperCase()}</h1>

      <div className="order-detail-layout">
        <div className="order-detail__info">
          <div className="order-detail__status">
            <span className={`order-detail__status-badge order-detail__status-badge--${(order.status || 'pending').toLowerCase()}`}>{order.status || 'Pending'}</span>
            <span className="order-detail__date">{formatDate(order.createdAt)}</span>
          </div>

          <div className="order-detail__address">
            <h3>Shipping Address</h3>
            <p>{order.shippingAddress?.fullName || 'N/A'}</p>
            <p>{order.shippingAddress?.addressLine1 || order.address || 'N/A'}</p>
            <p>{order.shippingAddress?.city || order.city || ''}, {order.shippingAddress?.state || ''} {order.shippingAddress?.postalCode || order.postalCode || ''}</p>
            <p>{order.shippingAddress?.country || order.country || 'N/A'}</p>
          </div>

          <div className="order-detail__payment">
            <h3>Payment</h3>
            <p>Stripe — •••• {order.paymentIntentId ? '****' : 'N/A'}</p>
          </div>
        </div>

        <div className="order-detail__items">
          <h3>Items</h3>
          {order.items?.map((item) => (
            <div key={item.productId || item._id} className="order-detail__item">
              <Link to={`/products/${item.productId}`} className="order-detail__item-img">
                <img src={item.image || 'https://placehold.co/80x80'} alt={item.title} />
              </Link>
              <div className="order-detail__item-info">
                <Link to={`/products/${item.productId}`} className="order-detail__item-title">{item.title}</Link>
                <span className="order-detail__item-qty">Qty: {item.quantity}</span>
              </div>
              <span className="order-detail__item-price">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}

          <div className="order-detail__totals">
            <div className="order-detail__totals-row"><span>Subtotal</span><span>{formatCurrency(order.totalAmount || order.total)}</span></div>
            <div className="order-detail__totals-row"><span>Shipping</span><span>{order.shipping === 0 ? 'FREE' : formatCurrency(order.shipping || 0)}</span></div>
            <div className="order-detail__totals-row"><span>Tax</span><span>{formatCurrency(order.tax || 0)}</span></div>
            <div className="order-detail__totals-row order-detail__totals-row--total"><span>Order Total</span><strong>{formatCurrency((order.totalAmount || order.total) + (order.tax || 0))}</strong></div>
          </div>
        </div>
      </div>
    </div>
  )
}
