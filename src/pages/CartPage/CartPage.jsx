/* ===== SHOPPING CART PAGE ===== */
/* Displays cart items with quantity controls */
/* Protected route - requires authentication */

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
  useUpdateQty,
  useRemoveItem,
  useCreateOrder,
  useStartCheckout,
} from '../../hooks'
import { addToast } from '../../features/ui/uiSlice'
import { formatCurrency } from '../../utils/helpers'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import EmptyState from '../../components/shared/EmptyState'
import Button from '../../components/shared/Button'
import './CartPage.css'

const CartItemRow = memo(function CartItemRow({ item }) {
  const dispatch = useAppDispatch()
  const updateQty = useUpdateQty()
  const removeItem = useRemoveItem()

  const handleQtyChange = useCallback(
    (qty) => {
      if (qty < 1) {
        removeItem(item.productId)
        dispatch(
          addToast({
            title: 'Removed',
            message: `${item.title ?? 'Product'} removed from cart.`,
            type: 'info',
          })
        )
        return
      }
      updateQty({ productId: item.productId, quantity: qty })
    },
    [dispatch, item.productId, item.title, removeItem, updateQty]
  )

  const handleDelete = useCallback(() => {
    removeItem(item.productId)
    dispatch(
      addToast({
        title: 'Removed',
        message: `${item.title ?? 'Product'} removed from cart.`,
        type: 'info',
      })
    )
  }, [dispatch, item.productId, item.title, removeItem])

  return (
    <div className="cart-item">
      <Link to={`/products/${item.productId}`} className="cart-item__img-link">
        <img
          src={item.image ?? 'https://placehold.co/120x120'}
          alt={item.title ?? 'Product'}
          loading="lazy"
          width="120"
          height="120"
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
            className="cart-item__action-btn"
            onClick={handleDelete}
          >
            Delete
          </button>
          <span className="cart-item__action-disabled">Save for later</span>
        </div>
      </div>

      <div className="cart-item__quantity">
        <button
          type="button"
          className="cart-item__qty-btn"
          onClick={() => handleQtyChange(item.quantity - 1)}
          aria-label="Decrease quantity"
        >
          &#8722;
        </button>
        <input
          type="number"
          className="cart-item__qty-input"
          value={item.quantity}
          min="1"
          onChange={(e) => handleQtyChange(Number(e.target.value))}
          aria-label="Quantity"
        />
        <button
          type="button"
          className="cart-item__qty-btn"
          onClick={() => handleQtyChange(item.quantity + 1)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <div className="cart-item__price">
        <strong>{formatCurrency((item.price ?? 0) * item.quantity)}</strong>
      </div>
    </div>
  )
})

const CartSummary = memo(function CartSummary({
  cartCount,
  cartTotal,
  disabled,
  onCheckout,
}) {
  return (
    <aside className="cart-summary">
      <h3 className="cart-summary__title">
        Subtotal ({cartCount} item{cartCount !== 1 ? 's' : ''}):{' '}
        <strong>{formatCurrency(cartTotal)}</strong>
      </h3>
      <p className="cart-summary__delivery">FREE Delivery eligible</p>
      <Button
        variant="primary"
        fullWidth
        disabled={disabled}
        onClick={onCheckout}
      >
        {disabled ? 'Processing...' : 'Proceed to Checkout'}
      </Button>
    </aside>
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
  const createOrder = useCreateOrder()
  const startCheckout = useStartCheckout()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

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
        createOrder({
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

      if (createOrder.fulfilled.match(result)) {
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
        dispatch(
          addToast({
            title: 'Order failed',
            message: result.payload ?? 'Unable to create order.',
            type: 'error',
          })
        )
      }
    } finally {
      setIsCheckingOut(false)
    }
  }, [
    dispatch,
    shippingAddress,
    items,
    cartTotal,
    createOrder,
    startCheckout,
    navigate,
  ])

  if (status === 'loading' && !items.length)
    return <LoadingSpinner label="Loading cart..." fullScreen />

  if (!items.length)
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add some items to get started."
        action={
          <Link to="/" className="btn btn--primary">
            Shop Now
          </Link>
        }
      />
    )

  return (
    <div className="cart-page">
      <h1 className="cart-page__title">Shopping Cart</h1>

      <div className="cart-page__content">
        <div className="cart-page__items">
          {items.map((item) => (
            <CartItemRow key={item.productId ?? item._id} item={item} />
          ))}
        </div>

        <CartSummary
          cartCount={cartCount}
          cartTotal={cartTotal}
          disabled={isCheckingOut}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  )
}
