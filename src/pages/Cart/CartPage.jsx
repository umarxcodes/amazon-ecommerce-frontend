import { useEffect, useState } from 'react'
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
} from '../../hooks/customHooks'
import { addToast } from '../../features/ui/uiSlice'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import EmptyState from '../../components/UI/EmptyState'
import { formatCurrency } from '../../utils/helpers'
import './CartPage.css'

function CartItemRow({ item }) {
  const updateQty = useUpdateQty()
  const removeItem = useRemoveItem()
  const dispatch = useAppDispatch()

  const handleQuantityChange = (newQty) => {
    if (newQty < 1) {
      handleDelete()
      return
    }
    updateQty({ productId: item.productId, quantity: newQty })
  }

  const handleDelete = () => {
    removeItem(item.productId)
    dispatch(
      addToast({
        title: 'Item removed',
        message: `${item.title || item.name} has been removed from your cart.`,
        type: 'info',
      })
    )
  }

  const lineTotal = item.price * item.quantity

  return (
    <div className="cart-item-row">
      <div className="cart-item-row__image">
        <Link to={`/products/${item.productId}`}>
          <img
            src={item.image || '/placeholder-product.png'}
            alt={item.title || item.name}
            width="120"
            height="120"
          />
        </Link>
      </div>

      <div className="cart-item-row__info">
        <Link
          to={`/products/${item.productId}`}
          className="cart-item-row__title"
        >
          {item.title || item.name}
        </Link>
        <span className="cart-item-row__stock">In Stock</span>
        <span className="cart-item-row__shipped">
          Shipped from: {item.seller || 'Amazon.com'}
        </span>
        <div className="cart-item-row__actions">
          <Link
            to="#"
            className="cart-action-link"
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
          >
            Delete
          </Link>
          <span className="cart-action-link cart-action-link--disabled">
            Save for later
          </span>
          <span className="cart-action-link cart-action-link--disabled">
            Compare with similar items
          </span>
          <span className="cart-action-link cart-action-link--disabled">
            Share
          </span>
        </div>
      </div>

      <div className="cart-item-row__center">
        <div className="cart-qty-control">
          <button
            type="button"
            className="cart-qty-btn cart-qty-btn--remove"
            onClick={handleDelete}
            aria-label="Remove item"
            title="Delete"
          >
            🗑️
          </button>
          <input
            type="number"
            className="cart-qty-input"
            value={item.quantity}
            min="1"
            onChange={(e) => handleQuantityChange(Number(e.target.value))}
            aria-label={`Quantity for ${item.title || item.name}`}
          />
          <button
            type="button"
            className="cart-qty-btn cart-qty-btn--add"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="cart-item-row__price">
        <strong>{formatCurrency(lineTotal)}</strong>
      </div>
    </div>
  )
}

function OrderSummary({ itemCount, subtotal, onCheckout, checkoutDisabled }) {
  return (
    <div className="order-summary-box">
      <h3 className="order-summary-box__subtotal">
        Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''}):{' '}
        <strong>{formatCurrency(subtotal)}</strong>
      </h3>
      <p className="order-summary-box__free-delivery">
        Your order qualifies for FREE Delivery
      </p>
      <button
        type="button"
        className="order-summary-box__checkout"
        onClick={onCheckout}
        disabled={checkoutDisabled}
      >
        Proceed to checkout
      </button>
      <div className="order-summary-box__or">
        <span>Or</span>
      </div>
      <Link to="/products" className="order-summary-box__continue">
        Continue shopping
      </Link>
    </div>
  )
}

export default function CartPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const items = useCartItems()
  const cartCount = useCartCount()
  const cartTotal = useCartTotal()
  const cartStatus = useCartStatus()
  const shippingAddress = useShippingAddress()
  const isAuthenticated = useIsAuthenticated()
  const fetchCart = useFetchCart()
  const createOrder = useCreateOrder()
  const startCheckoutFn = useStartCheckout()
  const createOrderStatus = useCreateOrderStatus()

  const [shippingDismissed, setShippingDismissed] = useState(false)

  // Fetch cart from backend on mount if logged in
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    }
  }, [isAuthenticated, fetchCart])

  const handleCheckout = async () => {
    if (!shippingAddress.addressLine1 || !shippingAddress.city) {
      dispatch(
        addToast({
          title: 'Shipping address required',
          message: 'Please set your shipping address before checkout.',
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
      const orderId =
        result.payload.order?._id || result.payload._id || result.payload.id
      if (orderId) {
        dispatch(startCheckoutFn(orderId))
      }
    } else {
      dispatch(
        addToast({
          title: 'Order creation failed',
          message:
            result.payload || 'Unable to create order. Please try again.',
          type: 'error',
        })
      )
    }
  }

  if (cartStatus === 'loading' && !items.length) {
    return (
      <div className="cart-page">
        <LoadingSpinner label="Loading your cart..." />
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="cart-page">
        <EmptyState
          title="Your Amazon Cart is empty"
          description="Your shopping cart is waiting. Give it purpose — add some items."
          action={
            <Link to="/products" className="cart-empty__btn">
              Continue Shopping
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="cart-page">
      {/* Shipping notice banner */}
      {!shippingDismissed && (
        <div className="cart-shipping-notice">
          <p>
            We're showing items that ship to your location. To see items that
            ship to a different country, change your delivery address.
          </p>
          <div className="cart-shipping-notice__actions">
            <button
              type="button"
              className="cart-shipping-notice__dismiss"
              onClick={() => setShippingDismissed(true)}
            >
              Dismiss
            </button>
            <Link to="/checkout" className="cart-shipping-notice__change">
              Change Address
            </Link>
          </div>
        </div>
      )}

      <div className="cart-page__inner">
        {/* Left column — Cart items */}
        <div className="cart-main">
          <h1 className="cart-main__title">Shopping Cart</h1>
          <div className="cart-items-list">
            {items.map((item) => (
              <CartItemRow key={item.productId || item._id} item={item} />
            ))}
          </div>

          <div className="cart-bottom-subtotal">
            Subtotal ({cartCount} item{cartCount !== 1 ? 's' : ''}):{' '}
            <strong>{formatCurrency(cartTotal)}</strong>
          </div>
        </div>

        {/* Right column — Sticky order summary */}
        <div className="cart-sidebar">
          <OrderSummary
            itemCount={cartCount}
            subtotal={cartTotal}
            onCheckout={handleCheckout}
            checkoutDisabled={createOrderStatus === 'loading'}
          />
        </div>
      </div>

      {/* Logged out section */}
      {!isAuthenticated && (
        <div className="cart-logged-out-section">
          <h3>See personalized recommendations</h3>
          <Link to="/login" className="cart-signin-btn">
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
