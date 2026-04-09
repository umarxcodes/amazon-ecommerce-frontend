import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  useAppDispatch,
  useCartItems,
  useCartCount,
  useCartTotal,
  useCartStatus,
  useShippingAddress,
  useIsAuthenticated,
  useFetchCart,
  useUpdateQty,
  useRemoveItem,
  useCreateOrder,
  useStartCheckout,
  useCreateOrderStatus,
} from '../../hooks'
import { addToast } from '../../features/ui/uiSlice'
import { formatCurrency } from '../../utils/helpers'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import Button from '../../components/ui/Button'
import './CartPage.css'

function CartItemRow({ item }) {
  const updateQty = useUpdateQty()
  const removeItem = useRemoveItem()
  const dispatch = useAppDispatch()

  const handleQty = (qty) => {
    if (qty < 1) {
      handleDelete()
      return
    }
    updateQty({ productId: item.productId, quantity: qty })
  }
  const handleDelete = () => {
    removeItem(item.productId)
    dispatch(
      addToast({
        title: 'Removed',
        message: `${item.title} removed from cart.`,
        type: 'info',
      })
    )
  }

  return (
    <div className="cart-item">
      <Link to={`/products/${item.productId}`} className="cart-item__img">
        <img
          src={item.image || 'https://placehold.co/120x120'}
          alt={item.title}
        />
      </Link>
      <div className="cart-item__info">
        <Link to={`/products/${item.productId}`} className="cart-item__title">
          {item.title}
        </Link>
        <span className="cart-item__stock">In Stock</span>
        <div className="cart-item__actions">
          <button
            type="button"
            className="cart-item__action-link"
            onClick={handleDelete}
          >
            Delete
          </button>
          <span className="cart-item__action-link cart-item__action-link--disabled">
            Save for later
          </span>
        </div>
      </div>
      <div className="cart-item__qty">
        <button
          type="button"
          className="cart-item__qty-btn"
          onClick={() => handleQty(item.quantity - 1)}
          aria-label="Decrease"
        >
          −
        </button>
        <input
          type="number"
          className="cart-item__qty-input"
          value={item.quantity}
          min="1"
          onChange={(e) => handleQty(Number(e.target.value))}
          aria-label="Quantity"
        />
        <button
          type="button"
          className="cart-item__qty-btn"
          onClick={() => handleQty(item.quantity + 1)}
          aria-label="Increase"
        >
          +
        </button>
      </div>
      <div className="cart-item__price">
        <strong>{formatCurrency(item.price * item.quantity)}</strong>
      </div>
    </div>
  )
}

export default function CartPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const items = useCartItems()
  const cartCount = useCartCount()
  const cartTotal = useCartTotal()
  const status = useCartStatus()
  const shippingAddress = useShippingAddress()
  const isAuthenticated = useIsAuthenticated()
  const fetchCart = useFetchCart()
  const createOrder = useCreateOrder()
  const startCheckout = useStartCheckout()
  const createOrderStatus = useCreateOrderStatus()

  useEffect(() => {
    if (isAuthenticated) fetchCart()
  }, [isAuthenticated, fetchCart])

  const handleCheckout = async () => {
    if (!shippingAddress.addressLine1 || !shippingAddress.city) {
      dispatch(
        addToast({
          title: 'Address required',
          message: 'Please set your shipping address.',
          type: 'error',
        })
      )
      navigate('/checkout')
      return
    }
    const result = await dispatch(
      createOrder({
        address: shippingAddress.addressLine1,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      })
    )
    if (createOrder.fulfilled.match(result)) {
      const id =
        result.payload.order?._id || result.payload._id || result.payload.id
      if (id) startCheckout(id)
    } else {
      dispatch(
        addToast({
          title: 'Order failed',
          message: result.payload || 'Unable to create order.',
          type: 'error',
        })
      )
    }
  }

  if (status === 'loading' && !items.length)
    return <LoadingSpinner label="Loading cart..." fullScreen />
  if (!items.length)
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add some items to get started."
        action={
          <Link to="/products" className="btn btn--primary">
            Shop Now
          </Link>
        }
      />
    )

  return (
    <div className="cart-page">
      <h1 className="cart-page__title">Shopping Cart</h1>
      <div className="cart-page__inner">
        <div className="cart-page__items">
          {items.map((item) => (
            <CartItemRow key={item.productId || item._id} item={item} />
          ))}
        </div>
        <aside className="cart-page__summary">
          <div className="cart-summary">
            <h3>
              Subtotal ({cartCount} item{cartCount !== 1 ? 's' : ''}):{' '}
              <strong>{formatCurrency(cartTotal)}</strong>
            </h3>
            <p className="cart-summary__free-delivery">
              FREE Delivery eligible
            </p>
            <Button
              variant="primary"
              fullWidth
              disabled={createOrderStatus === 'loading'}
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        </aside>
      </div>
      {!isAuthenticated && (
        <div className="cart-page__signin">
          <h3>See personalized recommendations</h3>
          <Link to="/login" className="btn btn--primary">
            Sign in
          </Link>
          <p>
            New customer? <Link to="/register">Start here.</Link>
          </p>
        </div>
      )}
    </div>
  )
}
