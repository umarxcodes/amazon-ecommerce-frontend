import { useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  useAppDispatch,
  useSelectedOrder,
  useOrderDetailStatus,
  useAddToCart,
} from '../hooks/customHooks'
import { fetchOrderById } from '../features/orders/orderSlice'
import { addToast } from '../features/ui/uiSlice'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import EmptyState from '../components/UI/EmptyState'
import { formatCurrency, formatDate } from '../utils/helpers'
import './OrderDetail.css'

export default function OrderDetail() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const order = useSelectedOrder()
  const status = useOrderDetailStatus()
  const addToCart = useAddToCart()

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId))
    }
  }, [dispatch, orderId])

  const handleBuyAgain = (item) => {
    addToCart({ productId: item.productId, quantity: 1 })
    dispatch(
      addToast({
        title: 'Added to cart',
        message: `${item.name || item.title} has been added to your cart.`,
        type: 'success',
      })
    )
  }

  if (status === 'loading') {
    return <LoadingSpinner label="Loading order details..." />
  }

  if (status === 'failed' || !order) {
    return (
      <EmptyState
        title="Order not found"
        description="We couldn't find the order you're looking for."
        action={
          <button className="btn-primary" onClick={() => navigate('/orders')}>
            Back to Orders
          </button>
        }
      />
    )
  }

  const orderItems = order.items || order.products || []
  const subtotal = orderItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  )
  const tax = order.tax || subtotal * 0.08
  const total = order.total || subtotal + tax

  return (
    <div className="order-detail-page">
      <div className="order-detail-container">
        {/* Order header */}
        <div className="order-detail-header">
          <h1 className="order-detail-header__title">
            Order #{order._id?.slice(-8) || order.id}
          </h1>
          <span
            className={`order-status-badge order-status-badge--${order.status?.toLowerCase() || 'pending'}`}
          >
            {order.status || 'Pending'}
          </span>
          <p className="order-detail-header__date">
            Ordered on {formatDate(order.createdAt || order.orderDate)}
          </p>
        </div>

        {/* Delivery address */}
        <div className="order-detail-section">
          <h3 className="order-detail-section__title">Delivery Address</h3>
          <div className="order-detail-address">
            {order.shippingAddress ? (
              <>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city},{' '}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </>
            ) : (
              <p>Address not available</p>
            )}
          </div>
        </div>

        {/* Payment method */}
        <div className="order-detail-section">
          <h3 className="order-detail-section__title">Payment Method</h3>
          <div className="order-detail-payment">
            <p>
              <strong>Stripe</strong> — Card
            </p>
          </div>
        </div>

        {/* Order items */}
        <div className="order-detail-section">
          <h3 className="order-detail-section__title">Order Items</h3>
          <div className="order-detail-items">
            {orderItems.map((item, index) => (
              <div key={item._id || index} className="order-detail-item">
                <Link
                  to={`/products/${item.productId || item._id}`}
                  className="order-detail-item__image"
                >
                  <img
                    src={item.image || '/placeholder-product.png'}
                    alt={item.name || item.title}
                    width="80"
                    height="80"
                  />
                </Link>
                <div className="order-detail-item__info">
                  <Link
                    to={`/products/${item.productId || item._id}`}
                    className="order-detail-item__name"
                  >
                    {item.name || item.title}
                  </Link>
                  <span className="order-detail-item__qty">
                    Qty: {item.quantity || 1}
                  </span>
                </div>
                <div className="order-detail-item__price">
                  {formatCurrency(item.price || 0)}
                </div>
                <button
                  type="button"
                  className="order-detail-item__buy-again"
                  onClick={() => handleBuyAgain(item)}
                >
                  Buy it again
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Order totals */}
        <div className="order-detail-totals">
          <div className="order-detail-totals__row">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="order-detail-totals__row">
            <span>Shipping:</span>
            <span className="order-detail-totals__free">Free</span>
          </div>
          <div className="order-detail-totals__row">
            <span>Tax:</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="order-detail-totals__row order-detail-totals__row--total">
            <span>Total:</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
        </div>

        {/* Track Package */}
        <div className="order-detail-actions">
          <button type="button" className="order-detail-actions__btn">
            Track Package
          </button>
        </div>
      </div>
    </div>
  )
}
