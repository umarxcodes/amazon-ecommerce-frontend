import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchOrderById } from '../features/orders/orderSlice'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import EmptyState from '../components/UI/EmptyState'
import { formatCurrency, formatDate } from '../utils/helpers'

export default function OrderDetail() {
  const { orderId } = useParams()
  const dispatch = useAppDispatch()
  const { selectedOrder, detailStatus, error } = useAppSelector((state) => state.orders)

  useEffect(() => {
    dispatch(fetchOrderById(orderId))
  }, [dispatch, orderId])

  if (detailStatus === 'loading') {
    return <LoadingSpinner label="Loading order detail..." />
  }

  if (detailStatus === 'failed') {
    return <EmptyState title="Order not found" description={error} />
  }

  if (!selectedOrder) return null

  return (
    <div className="container page">
      <section className="stack-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Order detail</span>
            <h1>Order #{selectedOrder._id}</h1>
          </div>
          <p>Placed on {formatDate(selectedOrder.createdAt)}</p>
        </div>

        <div className="detail-panel">
          <div className="summary-row">
            <span>Status</span>
            <strong>{selectedOrder.status}</strong>
          </div>
          <div className="summary-row">
            <span>Total</span>
            <strong>{formatCurrency(selectedOrder.totalAmount)}</strong>
          </div>
          <div className="summary-row">
            <span>Ship to</span>
            <strong>{selectedOrder.shippingAddress?.fullName}</strong>
          </div>
        </div>

        <div className="stack-list">
          {selectedOrder.items.map((item) => (
            <article className="order-line" key={item.productId}>
              <span>{item.title}</span>
              <span>Qty {item.quantity}</span>
              <strong>{formatCurrency(item.price)}</strong>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
