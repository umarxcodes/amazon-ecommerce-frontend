import { useEffect } from 'react'
import {
  useAppDispatch,
  useOrders,
  useOrderStatus,
  useOrderError,
} from '../hooks/customHooks'
import { fetchOrders } from '../features/orders/orderSlice'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import EmptyState from '../components/UI/EmptyState'
import OrderCard from '../features/orders/components/OrderCard'

export default function Orders() {
  const dispatch = useAppDispatch()
  const items = useOrders()
  const status = useOrderStatus()
  const error = useOrderError()

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  return (
    <div className="container page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Orders</span>
          <h1>Track your purchase history</h1>
        </div>
        <p>
          Order history and detail routes are protected behind authenticated
          access.
        </p>
      </div>

      {status === 'loading' ? (
        <LoadingSpinner label="Fetching orders..." />
      ) : null}
      {status === 'failed' ? (
        <EmptyState title="Unable to load orders" description={error} />
      ) : null}
      {status === 'succeeded' && !items.length ? (
        <EmptyState
          title="No orders yet"
          description="Complete checkout to create your first order."
        />
      ) : null}

      <div className="stack-list">
        {items.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  )
}
