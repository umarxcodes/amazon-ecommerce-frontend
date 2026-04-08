import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  useAppDispatch,
  useCartItems,
  useProducts,
} from '../../hooks/customHooks'
import {
  removeFromCart,
  updateCartQuantity,
} from '../../features/cart/cartSlice'
import { addToCart } from '../../features/cart/cartSlice'
import { addToast } from '../../features/ui/uiSlice'
import { formatCurrency } from '../../utils/helpers'

function CartItemRow({ item, checked, onToggle }) {
  const dispatch = useAppDispatch()

  const handleQuantityChange = (quantity) => {
    if (quantity < 1) {
      dispatch(removeFromCart(item.productId))
    } else {
      dispatch(updateCartQuantity({ productId: item.productId, quantity }))
    }
  }

  const handleDelete = () => {
    dispatch(removeFromCart(item.productId))
    dispatch(
      addToast({
        title: 'Item removed',
        message: `${item.title} has been removed from your cart.`,
        type: 'info',
      })
    )
  }

  const lineTotal = item.price * item.quantity
  const quantities = Array.from({ length: 10 }, (_, i) => i + 1)

  return (
    <div className="cart-item-row">
      <div className="cart-item-row__check">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="cart-checkbox"
          aria-label={`Select ${item.title}`}
        />
      </div>

      <div className="cart-item-row__image">
        <Link to={`/products/${item.productId}`}>
          <img src={item.image} alt={item.title} />
        </Link>
      </div>

      <div className="cart-item-row__info">
        <Link
          to={`/products/${item.productId}`}
          className="cart-item-row__title"
        >
          {item.title}
        </Link>
        <span className="cart-item-row__stock">In Stock</span>
        <label className="cart-item-row__gift">
          <input type="checkbox" className="cart-checkbox" />
          <span>This is a gift</span>
          <span className="cart-item-row__gift-learn">Learn more</span>
        </label>
      </div>

      <div className="cart-item-row__qty">
        <select
          value={item.quantity}
          onChange={(e) => handleQuantityChange(Number(e.target.value))}
          className="cart-qty-select"
          aria-label={`Quantity for ${item.title}`}
        >
          {quantities.map((n) => (
            <option key={n} value={n}>
              Qty: {n}
            </option>
          ))}
          {item.quantity > 10 && (
            <option value={item.quantity}>Qty: {item.quantity}</option>
          )}
        </select>
      </div>

      <div className="cart-item-row__price">
        <div className="cart-item-row__unit">
          <span>Unit price:</span>
          <strong>{formatCurrency(item.price)}</strong>
        </div>
        <div className="cart-item-row__total">
          <span>Total:</span>
          <strong>{formatCurrency(lineTotal)}</strong>
        </div>
      </div>

      <div className="cart-item-row__actions">
        <button
          type="button"
          className="cart-delete-link"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

function CheckoutBox({ itemCount, subtotal, onProceed }) {
  const [isGift, setIsGift] = useState(false)

  return (
    <div className="cart-checkout-box">
      <div className="cart-checkout-box__subtotal">
        <span>
          Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''}):
        </span>
        <strong>{formatCurrency(subtotal)}</strong>
      </div>

      <label className="cart-checkout-box__gift">
        <input
          type="checkbox"
          checked={isGift}
          onChange={(e) => setIsGift(e.target.checked)}
          className="cart-checkbox"
        />
        <span>This order contains a gift</span>
      </label>

      <button
        type="button"
        className="cart-checkout-box__proceed-btn"
        onClick={onProceed}
      >
        Proceed to checkout
      </button>
    </div>
  )
}

function CompareSection({ items, currentIds }) {
  const dispatch = useAppDispatch()
  const suggestions = items.filter((p) => !currentIds.has(p._id)).slice(0, 4)

  if (!suggestions.length) return null

  return (
    <div className="cart-compare">
      <h2 className="cart-compare__title">Compare with similar items</h2>
      <div className="cart-compare__scroll">
        {suggestions.map((product) => (
          <div key={product._id} className="cart-compare__card">
            <Link to={`/products/${product._id}`}>
              <img src={product.image} alt={product.title} loading="lazy" />
            </Link>
            <div className="cart-compare__card-info">
              <Link
                to={`/products/${product._id}`}
                className="cart-compare__card-title"
              >
                {product.title}
              </Link>
              <div className="cart-compare__rating">
                <span className="cart-compare__stars">
                  {'★'.repeat(Math.round(product.rating || 0))}
                  {'☆'.repeat(5 - Math.round(product.rating || 0))}
                </span>
                <span>{(product.reviewsCount || 0).toLocaleString()}</span>
              </div>
              <div className="cart-compare__price">
                {formatCurrency(product.salePrice || product.price)}
              </div>
              <div className="cart-compare__prime">
                <span className="cart-compare__prime-badge">✓</span>
                <span>
                  Get it by <strong>Tomorrow</strong>
                </span>
              </div>
              <button
                type="button"
                className="cart-compare__add-btn"
                onClick={() => {
                  dispatch(
                    addToCart({
                      productId: product._id,
                      title: product.title,
                      image: product.image,
                      category: product.category,
                      price: product.salePrice || product.price,
                      quantity: 1,
                    })
                  )
                  dispatch(
                    addToast({
                      title: 'Added to cart',
                      message: `${product.title} has been added.`,
                      type: 'success',
                    })
                  )
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BrowsingHistory() {
  const allProducts = useProducts()
  const recent = allProducts.slice(0, 6)

  if (!recent.length) return null

  return (
    <div className="cart-browsing">
      <h2 className="cart-browsing__title">Your Browsing History</h2>
      <div className="cart-browsing__scroll">
        {recent.map((product) => (
          <Link
            key={product._id}
            to={`/products/${product._id}`}
            className="cart-browsing__card"
          >
            <img src={product.image} alt={product.title} loading="lazy" />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function CartPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const items = useCartItems()
  const allProducts = useProducts()

  const [checkedItems, setCheckedItems] = useState(
    items.reduce((acc, item) => ({ ...acc, [item.productId]: true }), {})
  )

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const currentIds = new Set(items.map((i) => i.productId))

  const toggleItem = (productId) => {
    setCheckedItems((prev) => ({ ...prev, [productId]: !prev[productId] }))
  }

  const toggleAll = () => {
    const allChecked = items.every((item) => checkedItems[item.productId])
    setCheckedItems(
      items.reduce(
        (acc, item) => ({ ...acc, [item.productId]: !allChecked }),
        {}
      )
    )
  }

  if (!items.length) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <h1 className="cart-empty__title">Your Amazon Cart is empty</h1>
          <p className="cart-empty__text">
            Your shopping cart is waiting. Give it purpose — add some items.
          </p>
          <Link to="/" className="cart-empty__btn">
            Continue shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="cart-page__inner">
        {/* Left column */}
        <div className="cart-main">
          <div className="cart-header">
            <div className="cart-header__left">
              <h1 className="cart-header__title">Shopping Cart</h1>
              <label className="cart-header__select-all">
                <input
                  type="checkbox"
                  className="cart-checkbox"
                  checked={items.every((i) => checkedItems[i.productId])}
                  onChange={toggleAll}
                />
                <span>Select all</span>
              </label>
            </div>
            <div className="cart-header__right">
              <span className="cart-header__price-label">Price</span>
            </div>
          </div>

          <div className="cart-items-list">
            {items.map((item) => (
              <CartItemRow
                key={item.productId}
                item={item}
                checked={!!checkedItems[item.productId]}
                onToggle={() => toggleItem(item.productId)}
              />
            ))}
          </div>

          <div className="cart-bottom-subtotal">
            Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''}):{' '}
            <strong>{formatCurrency(subtotal)}</strong>
          </div>

          <CompareSection items={allProducts} currentIds={currentIds} />
          <BrowsingHistory />
        </div>

        {/* Right column — sticky checkout */}
        <div className="cart-sidebar">
          <CheckoutBox
            itemCount={itemCount}
            subtotal={subtotal}
            onProceed={() => navigate('/checkout')}
          />
        </div>
      </div>
    </div>
  )
}
