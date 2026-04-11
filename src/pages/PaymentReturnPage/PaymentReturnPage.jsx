/* ===== PAYMENT RETURN PAGE ===== */
/* Handles redirect after returning from Stripe (success or cancel) */
/* Shows payment status and allows retry if needed */

import { useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  useAppDispatch,
  useSelectedOrder,
  useOrderDetailStatus,
  useOrderError,
  useOrderCheckoutStatus,
  useFetchOrderById,
  useStartCheckout,
} from '../../hooks'
import { resetOrderStatus } from '../../features/orders/orderSlice'
import { addToast } from '../../features/ui/uiSlice'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import EmptyState from '../../components/shared/EmptyState'
import Button from '../../components/shared/Button'
import '../OrderDetailPage/OrderDetailPage.css'

export default function PaymentReturnPage() {
  const { orderId } = useParams()
  const [searchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const order = useSelectedOrder()
  const status = useOrderDetailStatus()
  const error = useOrderError()
  const checkoutStatus = useOrderCheckoutStatus()
  const navigate = useNavigate()
  const fetchOrderById = useFetchOrderById()
  const startCheckout = useStartCheckout()

  // Determine if this is a success or cancel return
  const isCancel = useMemo(
    () => searchParams.get('canceled') === 'true' || searchParams.has('cancel'),
    [searchParams]
  )

  useEffect(() => {
    if (orderId) {
      dispatch(resetOrderStatus())
      fetchOrderById(orderId)
    }
  }, [dispatch, orderId, fetchOrderById])

  useEffect(() => {
    if (status === 'succeeded' && order) {
      const paymentStatus = order.paymentStatus ?? (order.isPaid ? 'paid' : 'pending')
      if (paymentStatus === 'paid' && !isCancel) {
        dispatch(
          addToast({
            title: 'Payment successful',
            message: 'Your payment has been processed successfully.',
            type: 'success',
          })
        )
      } else if (isCancel) {
        dispatch(
          addToast({
            title: 'Payment cancelled',
            message: 'Payment was cancelled. You can retry from the order details page.',
            type: 'info',
          })
        )
      }
    }
  }, [status, order, isCancel, dispatch])

  const handleRetryPayment = useCallback(() => {
    if (orderId) {
      startCheckout(orderId)
    }
  }, [startCheckout, orderId])

  const handleViewOrder = useCallback(() => {
    navigate(`/orders/${orderId}`)
  }, [navigate, orderId])

  const handleBackToOrders = useCallback(() => {
    navigate('/orders')
  }, [navigate])

  if (status === 'loading')
    return <LoadingSpinner label="Loading order..." fullScreen />

  if (status === 'failed') {
    return (
      <EmptyState
        title="Error loading order"
        description={error ?? 'An unexpected error occurred.'}
        action={
          <Button variant="primary" onClick={handleBackToOrders}>
            Back to Orders
          </Button>
        }
      />
    )
  }

  if (!order) {
    return (
      <EmptyState
        title="Order not found"
        description="We couldn't find this order."
        action={
          <Button variant="primary" onClick={handleBackToOrders}>
            Back to Orders
          </Button>
        }
      />
    )
  }

  const paymentStatus = order.paymentStatus ?? (order.isPaid ? 'paid' : 'pending')

  return (
    <div className="order-detail-page">
      <h1 className="order-detail-page__title">
        Payment — Order #{order._id?.slice(-8).toUpperCase() ?? 'N/A'}
      </h1>

      {paymentStatus === 'paid' && !isCancel && (
        <div className="order-detail-page__payment-success" role="alert">
          <i className="fas fa-check-circle" style={{ color: '#007600', marginRight: '0.5rem' }} />
          <strong>Payment successful!</strong> Your order has been paid.
        </div>
      )}

      {isCancel && paymentStatus !== 'paid' && (
        <div className="order-detail-page__payment-cancelled" role="alert">
          <i className="fas fa-times-circle" style={{ color: '#b12704', marginRight: '0.5rem' }} />
          Payment cancelled. You can retry below.
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
          </div>

          <div className="order-detail__payment">
            <h3>Payment Status</h3>
            <p>
              Status:{' '}
              <strong
                className={
                  paymentStatus === 'paid'
                    ? 'order-detail__payment--paid'
                    : 'order-detail__payment--pending'
                }
              >
                {paymentStatus === 'paid' ? '✓ Paid' : '⏳ Pending'}
              </strong>
            </p>
            {paymentStatus !== 'paid' && (
              <Button
                variant="primary"
                onClick={handleRetryPayment}
                disabled={checkoutStatus === 'loading'}
              >
                {checkoutStatus === 'loading' ? 'Processing...' : 'Retry Payment'}
              </Button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="ghost" onClick={handleViewOrder}>
              View Order Details
            </Button>
            <Button variant="ghost" onClick={handleBackToOrders}>
              Back to Orders
            </Button>
          </div>
        </div>

        <div className="order-detail__items">
          <h3>Items</h3>
          {order.items?.map((item) => (
            <div
              key={item.productId ?? item._id}
              className="order-detail__item"
            >
              <div className="order-detail__item-info" style={{ flex: 1 }}>
                <span className="order-detail__item-title">
                  {item.title ?? 'Product'}
                </span>
                <span className="order-detail__item-qty">
                  Qty: {item.quantity}
                </span>
              </div>
              <span className="order-detail__item-price">
                ${(item.price ?? 0) * (item.quantity ?? 0)}
              </span>
            </div>
          ))}

          <div className="order-detail__totals">
            <div className="order-detail__totals-row order-detail__totals-row--total">
              <span>Order Total</span>
              <strong>
                ${(order.totalAmount ?? order.total ?? 0) + (order.tax ?? 0)}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
