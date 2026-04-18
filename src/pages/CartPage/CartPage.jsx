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
  useFetchCart,
  useRemoveItem,
  useUpdateQty,
} from '../../hooks'
import {
  clearBackendCart,
  clearCart as clearCartAction,
} from '../../features/cart/cartSlice'
import { addToast } from '../../features/ui/uiSlice'
import { formatCurrency } from '../../utils/helpers'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import ConfirmationModal from '../../components/shared/ConfirmationModal'
import './CartPage.css'

const CartItemRow = memo(function CartItemRow({ item }) {
  const dispatch = useAppDispatch()
  const removeItem = useRemoveItem()
  const updateQty = useUpdateQty()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const productId = item.productId ?? item.product?._id
  const title =
    item.title ?? item.product?.name ?? item.product?.title ?? 'Product'
  const image =
    item.image ??
    item.product?.images?.[0] ??
    item.product?.image ??
    'https://placehold.co/180x180'
  const price = item.price ?? item.product?.price ?? 0
  const stock = item.stock ?? item.product?.stock ?? 0
  const inStock = item.inStock ?? stock > 0
  const quantity = item.quantity ?? 1

  const handleDelete = useCallback(async () => {
    if (!productId) return
    setIsDeleting(true)
    try {
      const result = await dispatch(removeItem(productId))
      if (removeItem.fulfilled.match(result)) {
        dispatch(
          addToast({
            title: 'Removed',
            message: `${title} removed from cart.`,
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
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }, [dispatch, productId, title, removeItem])

  const handleQtyChange = useCallback(
    async (newQty) => {
      if (!productId) return
      const qty = Number(newQty)
      if (qty < 1) return
      if (stock > 0 && qty > stock) {
        dispatch(
          addToast({
            title: 'Out of stock',
            message: `Only ${stock} available.`,
            type: 'error',
          })
        )
        return
      }
      await dispatch(updateQty({ productId, quantity: qty }))
    },
    [dispatch, productId, stock, updateQty]
  )

  return (
    <div className="cart-item">
      <Link to={`/products/${productId}`} className="cart-item__img-link">
        <img src={image} alt={title} loading="lazy" width="180" height="180" />
      </Link>

      <div className="cart-item__info">
        <Link to={`/products/${productId}`} className="cart-item__title">
          {title}
        </Link>
        <div className="cart-item__meta">
          {inStock ? (
            <span className="cart-item__stock">In Stock</span>
          ) : (
            <span className="cart-item__outofstock">Currently unavailable</span>
          )}
          {item.prime && <span className="cart-item__prime">✓ prime</span>}
        </div>
        <div className="cart-item__actions">
          <select
            className="cart-item__qty-select"
            value={quantity}
            onChange={(e) => handleQtyChange(e.target.value)}
            aria-label="Quantity"
          >
            {Array.from(
              { length: Math.min(quantity + 10, 30) },
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
            onClick={() => setShowDeleteModal(true)}
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
          <strong>{formatCurrency(price * quantity)}</strong>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Remove from Cart"
        message={`Are you sure you want to remove "${title}" from your cart?`}
        confirmText={isDeleting ? 'Removing...' : 'Remove'}
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
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
  const fetchCart = useFetchCart()
  const [isClearing, setIsClearing] = useState(false)
  const [showClearModal, setShowClearModal] = useState(false)

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const handleCheckout = useCallback(async () => {
    if (items.length === 0) {
      dispatch(
        addToast({
          title: 'Cart is empty',
          message: 'Add some items to your cart before checking out.',
          type: 'error',
        })
      )
      return
    }
    navigate('/checkout')
  }, [dispatch, items.length, navigate])

  const handleClearCart = useCallback(async () => {
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
      setShowClearModal(false)
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
          <Link to="/" className="cart-empty-state__btn">
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
          onClick={() => setShowClearModal(true)}
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

          <Link to="/" className="cart-page__continue-shopping">
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
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
        </aside>
      </div>

      <ConfirmationModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleClearCart}
        title="Clear Cart"
        message="Are you sure you want to remove all items from your cart?"
        confirmText={isClearing ? 'Clearing...' : 'Clear All'}
        cancelText="Cancel"
        variant="danger"
        isLoading={isClearing}
      />
    </div>
  )
}
