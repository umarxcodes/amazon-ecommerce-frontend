/*
📁 FILE: Cart.jsx
📌 PURPOSE: Amazon-style shopping cart page
======================================
*/

import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { removeFromCart, updateCartQuantity } from '../features/cart/cartSlice'
import { formatCurrency } from '../utils/helpers'
import './Cart.css'

export default function Cart() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const items = useAppSelector((state) => state.cart.items)

  const subtotal = items.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) {
      dispatch(removeFromCart(productId))
    } else {
      dispatch(updateCartQuantity({ productId, quantity }))
    }
  }

  if (!items.length) {
    return (
      <div className="cart-empty-page">
        <div className="cart-empty-container">
          <h2>Your Amazon Cart is empty</h2>
          <p>Shop today's deals</p>
          <Link to="/" className="cart-continue-btn">
            Continue shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-left">
          <h1 className="cart-title">Shopping Cart</h1>
          <div className="cart-items">
            {items.map((item) => (
              <div className="cart-item" key={item.productId}>
                <Link to={`/products/${item.productId}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="cart-item-image"
                  />
                </Link>

                <div className="cart-item-details">
                  <Link
                    to={`/products/${item.productId}`}
                    className="cart-item-title"
                  >
                    {item.title}
                  </Link>
                  <div className="cart-item-category">{item.category}</div>
                  <div className="cart-item-stock">In Stock</div>

                  <div className="cart-item-actions">
                    <div className="cart-quantity-control">
                      <label>Qty:</label>
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.productId,
                            parseInt(e.target.value)
                          )
                        }
                        className="cart-quantity-dropdown"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>
                    <span className="cart-divider">|</span>
                    <button
                      type="button"
                      className="cart-delete-btn"
                      onClick={() => dispatch(removeFromCart(item.productId))}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="cart-item-price">
                  <strong>{formatCurrency(item.price)}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-subtotal">
            Subtotal ({items.reduce((acc, item) => acc + item.quantity, 0)}{' '}
            items):
            <strong> {formatCurrency(subtotal)}</strong>
          </div>
        </div>

        <div className="cart-right">
          <div className="cart-summary-box">
            <div className="cart-summary-subtotal">
              Subtotal ({items.reduce((acc, item) => acc + item.quantity, 0)}{' '}
              items):
              <br />
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <button
              className="cart-proceed-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
