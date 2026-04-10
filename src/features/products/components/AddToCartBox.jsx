/* ===== ADD TO CART BUYBOX ===== */
/* Right-side purchase box with price, quantity selector, and Buy buttons */
/* Amazon-style checkout box with security indicators */

import { useState } from 'react'
import { useAppDispatch, useIsAuthenticated } from '../../../hooks'
import { addToast } from '../../ui/uiSlice'
import { formatCurrency } from '../../../utils/helpers'
import Button from '../../../components/shared/Button'
import './AddToCartBox.css'

export default function AddToCartBox({ product, onAddToCart }) {
  const [qty, setQty] = useState(1)
  const dispatch = useAppDispatch()
  const isAuthenticated = useIsAuthenticated()
  const inStock = product.stock > 0
  const price = product.salePrice || product.price

  const handleAdd = () => {
    if (!isAuthenticated) {
      dispatch(
        addToast({
          title: 'Sign in required',
          message: 'Please sign in to add items to your cart.',
          type: 'info',
        })
      )
      return
    }
    onAddToCart({
      productId: product._id,
      title: product.title,
      image: product.image,
      price,
      quantity: qty,
    })
  }

  const handleBuy = () => {
    handleAdd()
  }

  return (
    <div className="buybox">
      <div className="buybox__price">
        <strong>{formatCurrency(price)}</strong>
        {product.salePrice && product.salePrice < product.price && (
          <div className="buybox__was">
            Was: <s>{formatCurrency(product.price)}</s>
          </div>
        )}
      </div>

      {inStock && (
        <div className="buybox__qty">
          <label htmlFor="buybox-qty">Qty:</label>
          <select
            id="buybox-qty"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="buybox__qty-select"
          >
            {Array.from(
              { length: Math.min(product.stock, 10) },
              (_, i) => i + 1
            ).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="buybox__actions">
        <Button
          variant="primary"
          fullWidth
          disabled={!inStock}
          onClick={handleAdd}
        >
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
        <Button
          variant="accent"
          fullWidth
          disabled={!inStock}
          onClick={handleBuy}
        >
          Buy Now
        </Button>
      </div>

      {product.stock > 0 && product.stock < 5 && (
        <div className="buybox__stock-warning">
          Only {product.stock} left in stock — order soon
        </div>
      )}

      <div className="buybox__delivery">
        <strong>FREE delivery</strong> <span>Wed, Apr 15</span>
      </div>

      <div className="buybox__secure">🔒 Secure transaction</div>
    </div>
  )
}
