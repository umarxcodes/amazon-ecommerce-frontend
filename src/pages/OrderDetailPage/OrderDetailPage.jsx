/* ===== ORDER DETAIL PAGE ===== */
/* Shows full order information (items, status, shipping, payment) */
/* Protected route — handles 403/404 errors, shows paymentStatus */

import { useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  useAppDispatch,
  useSelectedOrder,
  useOrderDetailStatus,
  useOrderError,
  useFetchOrderById,
  useStartCheckout,
  useOrderCheckoutStatus,
} from '../../hooks'
import { resetOrderStatus } from '../../features/orders/orderSlice'
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
  const error = useOrderError()
  const navigate = useNavigate()
  const fetchOrderById = useFetchOrderById()
  const startCheckout = useStartCheckout()
  const checkoutStatus = useOrderCheckoutStatus()

  useEffect(() => {
    if (orderId) {
      dispatch(resetOrderStatus())
      fetchOrderById(orderId)
    }
  }, [dispatch, orderId, fetchOrderById])

  useEffect(() => {
    return () => {
      dispatch(resetOrderStatus())
    }
  }, [dispatch])

  // Handle retry payment
  const handleRetryPayment = useCallback(() => {
    if (orderId) {
      startCheckout(orderId)
    }
  }, [startCheckout, orderId])

  // Handle loading state
  if (status === 'loading')
    return <LoadingSpinner label="Loading order..." fullScreen />

  // Handle error states
  if (status === 'failed') {
    const isForbidden =
      error?.toLowerCase().includes('forbidden') ||
      error?.toLowerCase().includes('access denied') ||
      error?.toLowerCase().includes('unauthorized')
    const isNotFound =
      error?.toLowerCase().includes('not found') ||
      error?.toLowerCase().includes('invalid')

    return (
      <EmptyState
        title={
          isForbidden
            ? 'Access denied'
            : isNotFound
              ? 'Order not found'
              : 'Error loading order'
        }
        description={
          isForbidden
            ? 'You do not have permission to view this order.'
            : isNotFound
              ? "We couldn't find this order. It may have been removed."
              : (error ?? 'An unexpected error occurred.')
        }
        action={
          <Button variant="primary" onClick={() => navigate('/orders')}>
            Back to Orders
          </Button>
        }
      />
    )
  }

  if (!order) {
    if (status === 'loading' || status === 'idle') {
      return <LoadingSpinner label="Loading order..." fullScreen />
    }

    return (
      <EmptyState
        title="Order not found"
        description="We couldn't find this order."
        action={
          <Link to="/orders" className="btn btn--primary">
            Back to Orders
          </Link>
        }
      />
    )
  }

  // Check if payment was cancelled (via URL params)
  const checkoutError = checkoutStatus === 'failed' ? error : null
  const paymentSuccess = checkoutStatus === 'succeeded'

  const paymentStatus =
    order?.isPaid || order?.paymentResult?.status === 'paid'
      ? 'paid'
      : 'pending'
  const orderTotal =
    order.totalPrice ?? order.totalAmount ?? order.total ?? 0

  return (
    <div className="order-detail-page">
      <Link to="/orders" className="order-detail-page__back">
        ← Back to Orders
      </Link>
      <h1 className="order-detail-page__title">
        Order #{order._id?.slice(-8).toUpperCase() ?? 'N/A'}
      </h1>

      {/* Payment success/cancel messages */}
      {paymentSuccess && (
        <div className="order-detail-page__payment-success" role="alert">
          <i
            className="fas fa-check-circle"
            style={{ color: '#007600', marginRight: '0.5rem' }}
          />
          <strong>Payment successful!</strong> Your order has been paid.
        </div>
      )}
      {checkoutError && (
        <div className="order-detail-page__payment-cancelled" role="alert">
          <i
            className="fas fa-times-circle"
            style={{ color: '#b12704', marginRight: '0.5rem' }}
          />
          {checkoutError}
        </div>
      )}

      <div className="order-detail-layout">
        <div className="order-detail__info">
          <div className="order-detail__status">
            <span
              className={`order-detail__status-badge order-detail__status-badge--${(order.status || 'pending').toLowerCase()}`}
            >
              {order.status || 'Pending'}
            </span>
            <span className="order-detail__date">
              {formatDate(order.createdAt)}
            </span>
          </div>

          <div className="order-detail__address">
            <h3>Shipping Address</h3>
            <p>
              {order.shippingAddress?.fullName ??
                order.shippingAddress?.address ??
                'N/A'}
            </p>
            <p>
              {order.shippingAddress?.addressLine1 ??
                order.shippingAddress?.address ??
                'N/A'}
            </p>
            <p>
              {order.shippingAddress?.city ?? ''}{' '}
              {order.shippingAddress?.state ?? ''}{' '}
              {order.shippingAddress?.postalCode ?? ''}
            </p>
            <p>{order.shippingAddress?.country ?? 'N/A'}</p>
          </div>

          <div className="order-detail__payment">
            <h3>Payment</h3>
            <p>
              Status:{' '}
              <strong
                className={
                  paymentStatus === 'paid'
                    ? 'order-detail__payment--paid'
                    : paymentStatus === 'pending'
                      ? 'order-detail__payment--pending'
                      : 'order-detail__payment--failed'
                }
              >
                {paymentStatus === 'paid'
                  ? '✓ Paid'
                  : paymentStatus === 'pending'
                    ? '⏳ Pending'
                    : '✕ Failed'}
              </strong>
            </p>
            {order.paymentResult?.id && (
              <p>Stripe — •••• {order.paymentResult.id.slice(-4)}</p>
            )}
            {paymentStatus !== 'paid' && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleRetryPayment}
                disabled={checkoutStatus === 'loading'}
              >
                {checkoutStatus === 'loading' ? 'Processing...' : 'Pay Now'}
              </Button>
            )}
          </div>
        </div>

        <div className="order-detail__items">
          <h3>Items</h3>
          {order.items?.map((item) => {
            const productId =
              item.product?.toString?.() || item.productId || undefined
            const productLink = productId ? `/products/${productId}` : null
            return (
              <div key={item._id ?? productId} className="order-detail__item">
                {productLink ? (
                  <Link to={productLink} className="order-detail__item-img">
                    <img
                      src={item.image ?? 'https://placehold.co/80x80'}
                      alt={item.title ?? 'Product'}
                      loading="lazy"
                      width="80"
                      height="80"
                    />
                  </Link>
                ) : (
                  <div className="order-detail__item-img">
                    <img
                      src={item.image ?? 'https://placehold.co/80x80'}
                      alt={item.title ?? 'Product'}
                      loading="lazy"
                      width="80"
                      height="80"
                    />
                  </div>
                )}
                <div className="order-detail__item-info">
                  {productLink ? (
                    <Link to={productLink} className="order-detail__item-title">
                      {item.title}
                    </Link>
                  ) : (
                    <span className="order-detail__item-title">
                      {item.title}
                    </span>
                  )}
                  <span className="order-detail__item-qty">
                    Qty: {item.quantity}
                  </span>
                </div>
                <span className="order-detail__item-price">
                  {formatCurrency((item.price ?? 0) * (item.quantity ?? 0))}
                </span>
              </div>
            )
          })}

          <div className="order-detail__totals">
            <div className="order-detail__totals-row">
              <span>Subtotal</span>
              <span>
                {formatCurrency(orderTotal)}
              </span>
            </div>
            <div className="order-detail__totals-row">
              <span>Shipping</span>
              <span>
                {order.shipping === 0
                  ? 'FREE'
                  : formatCurrency(order.shipping ?? 0)}
              </span>
            </div>
            <div className="order-detail__totals-row">
              <span>Tax</span>
              <span>{formatCurrency(order.tax ?? 0)}</span>
            </div>
            <div className="order-detail__totals-row order-detail__totals-row--total">
              <span>Order Total</span>
              <strong>
                {formatCurrency(
                  (order.totalAmount ?? order.total ?? 0) + (order.tax ?? 0)
                )}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
