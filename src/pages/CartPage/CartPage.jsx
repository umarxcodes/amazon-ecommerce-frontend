/* ===== SHOPPING CART PAGE ===== */
/* Amazon-styled shopping cart with proper layout */
/* Protected route — requires authentication */

import { useEffect, memo, useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  useAppDispatch,
  useCartItems,
  useCartCount,
  useCartTotal,
  useCartStatus,
  useShippingAddress,
  useFetchCart,
  useRemoveItem,
  useCreateOrder,
  useStartCheckout,
} from '../../hooks'
import {
  clearBackendCart,
  clearCart as clearCartAction,
} from '../../features/cart/cartSlice'
import { addToast } from '../../features/ui/uiSlice'
import { formatCurrency } from '../../utils/helpers'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import './CartPage.css'

const CartItemRow = memo(function CartItemRow({ item }) {
  const dispatch = useAppDispatch()
  const removeItem = useRemoveItem()

  const handleDelete = useCallback(async () => {
    const result = await dispatch(removeItem(item.productId))
    if (removeItem.fulfilled.match(result)) {
      dispatch(
        addToast({
          title: 'Removed',
          message: `${item.title ?? 'Product'} removed from cart.`,
          type: 'info',
        })
      )
    } else {
      dispatch(
        addToast({
          title: 'Failed',
          message: result.payload ?? 'Could not remove item.',
          type: 'error',
        })
      )
    }
  }, [dispatch, item.productId, item.title, removeItem])

  return (
    <div className="cart-item">
      <Link to={`/products/${item.productId}`} className="cart-item__img-link">
        <img
          src={item.image ?? 'https://placehold.co/180x180'}
          alt={item.title ?? 'Product'}
          loading="lazy"
          width="180"
          height="180"
        />
      </Link>

      <div className="cart-item__info">
        <Link to={`/products/${item.productId}`} className="cart-item__title">
          {item.title}
        </Link>
        <div className="cart-item__meta">
          {item.inStock !== false ? (
            <span className="cart-item__stock">In Stock</span>
          ) : (
            <span className="cart-item__outofstock">Currently unavailable</span>
          )}
          {item.prime && <span className="cart-item__prime">✓ prime</span>}
        </div>
        <div className="cart-item__actions">
          <select
            className="cart-item__qty-select"
            value={item.quantity}
            onChange={(e) => {
              // Quantity change handled via backend in future
            }}
            aria-label="Quantity"
          >
            {Array.from(
              { length: Math.min(item.quantity + 10, 30) },
              (_, i) => i + 1
            ).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="cart-item__divider" />
          <button
            type="button"
            className="cart-item__action-link"
            onClick={handleDelete}
          >
            Delete
          </button>
          <span className="cart-item__divider" />
          <button type="button" className="cart-item__action-link">
            Save for later
          </button>
          <span className="cart-item__divider" />
          <button type="button" className="cart-item__action-link">
            Compare
          </button>
        </div>
      </div>

      <div className="cart-item__price-col">
        <div className="cart-item__price-label">Price</div>
        <div className="cart-item__price">
          <strong>{formatCurrency((item.price ?? 0) * item.quantity)}</strong>
        </div>
      </div>
    </div>
  )
})

export default function CartPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const items = useCartItems()
  const cartCount = useCartCount()
  const cartTotal = useCartTotal()
  const status = useCartStatus()
  const shippingAddress = useShippingAddress()
  const fetchCart = useFetchCart()
  const createOrderThunk = useCreateOrder()
  const startCheckout = useStartCheckout()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const handleCheckout = useCallback(async () => {
    if (!shippingAddress.addressLine1 || !shippingAddress.city) {
      dispatch(
        addToast({
          title: 'Address required',
          message: 'Please set your shipping address first.',
          type: 'error',
        })
      )
      navigate('/checkout')
      return
    }

    setIsCheckingOut(true)
    try {
      const result = await dispatch(
        createOrderThunk({
          shippingAddress: {
            fullName: shippingAddress.fullName,
            addressLine1: shippingAddress.addressLine1,
            city: shippingAddress.city,
            state: shippingAddress.state,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country,
          },
          items,
          totalAmount: cartTotal,
        })
      )

      if (createOrderThunk.fulfilled.match(result)) {
        const order =
          result.payload.order ?? result.payload.data ?? result.payload
        const id = order?._id ?? order?.id
        if (id) {
          startCheckout(id)
        } else {
          dispatch(
            addToast({
              title: 'Order created',
              message: 'Redirecting to payment...',
              type: 'success',
            })
          )
          navigate('/orders')
        }
      } else {
        const msg = result.payload ?? 'Unable to create order.'
        if (
          msg.toLowerCase().includes('empty') ||
          msg.toLowerCase().includes('no item')
        ) {
          dispatch(
            addToast({
              title: 'Cart is empty',
              message: 'Add some items to your cart before checking out.',
              type: 'error',
            })
          )
        } else {
          dispatch(
            addToast({
              title: 'Order failed',
              message: msg,
              type: 'error',
            })
          )
        }
      }
    } finally {
      setIsCheckingOut(false)
    }
  }, [
    dispatch,
    shippingAddress,
    items,
    cartTotal,
    createOrderThunk,
    startCheckout,
    navigate,
  ])

  const handleClearCart = useCallback(async () => {
    if (!window.confirm('Remove all items from your cart?')) return
    setIsClearing(true)
    try {
      const result = await dispatch(clearBackendCart())
      if (clearBackendCart.fulfilled.match(result)) {
        dispatch(clearCartAction())
        dispatch(
          addToast({
            title: 'Cart cleared',
            message: 'All items have been removed from your cart.',
            type: 'info',
          })
        )
      } else {
        dispatch(
          addToast({
            title: 'Failed',
            message: result.payload ?? 'Could not clear cart.',
            type: 'error',
          })
        )
      }
    } finally {
      setIsClearing(false)
    }
  }, [dispatch])

  if (status === 'loading' && !items.length)
    return <LoadingSpinner label="Loading cart..." fullScreen />

  if (!items.length)
    return (
      <div className="cart-page">
        <div className="cart-empty-state">
          <img
            src="https://res.cloudinary.com/dlul8f6xz/image/upload/v1775646248/amazon_logo_vwm0jl.png"
            alt="Amazon"
            className="cart-empty-state__logo"
          />
          <h2>Your Amazon Cart is empty</h2>
          <p className="cart-empty-state__desc">
            Check your Saved for Later items or start adding items to your Cart.
          </p>
          <Link to="/products" className="cart-empty-state__btn">
            Shop today&apos;s deals
          </Link>
        </div>
      </div>
    )

  return (
    <div className="cart-page">
      <div className="cart-page__header">
        <h1 className="cart-page__title">Shopping Cart</h1>
        <button
          type="button"
          className="cart-page__clear-btn"
          onClick={handleClearCart}
          disabled={isClearing}
        >
          {isClearing ? 'Clearing...' : 'Deselect all items'}
        </button>
      </div>

      <div className="cart-page__content">
        <div className="cart-page__items">
          <div className="cart-items-list">
            {items.map((item) => (
              <CartItemRow key={item.productId ?? item._id} item={item} />
            ))}
          </div>

          <div className="cart-page__subtotal">
            <span>
              Subtotal ({cartCount} item{cartCount !== 1 ? 's' : ''}):{' '}
              <strong>{formatCurrency(cartTotal)}</strong>
            </span>
          </div>

          <Link to="/products" className="cart-page__continue-shopping">
            ← Continue shopping
          </Link>
        </div>

        <aside className="cart-summary-box">
          <div className="cart-summary-box__subtotal">
            Subtotal ({cartCount} item{cartCount !== 1 ? 's' : ''}):{' '}
            <strong>{formatCurrency(cartTotal)}</strong>
          </div>

          <div className="cart-summary-box__gift">
            <label className="cart-summary-box__gift-label">
              <input type="checkbox" />
              <span>This order contains a gift</span>
            </label>
          </div>

          <button
            type="button"
            className="cart-summary-box__checkout-btn"
            onClick={() => navigate('/checkout')}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
          </button>
        </aside>
      </div>
    </div>
  )
}
