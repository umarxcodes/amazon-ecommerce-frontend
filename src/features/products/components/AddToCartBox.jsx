/* ===== ADD TO CART BUYBOX ===== */
/* Right-side purchase box with price, quantity selector, and Buy buttons */
/* Amazon-style checkout box with security indicators */

import { useState, useCallback } from 'react'
import { useIsAuthenticated } from '../../../hooks'
import { useAppDispatch } from '../../../hooks'
import { addToast } from '../../../features/ui/uiSlice'
import { formatCurrency } from '../../../utils/helpers'
import Button from '../../../components/shared/Button'
import './AddToCartBox.css'

export default function AddToCartBox({ product, onAddToCart }) {
  const [qty, setQty] = useState(1)
  const isAuthenticated = useIsAuthenticated()
  const dispatch = useAppDispatch()
  const stock = product?.stock ?? 0
  const inStock = stock > 0
  const price = product?.salePrice ?? product?.price
  const title = product?.title ?? product?.name ?? 'Product'
  const mainImage = product?.images?.[0] ?? product?.image ?? ''

  const handleAdd = useCallback(() => {
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
    onAddToCart?.({
      productId: product?._id,
      title,
      image: mainImage,
      price,
      quantity: qty,
    })
  }, [
    isAuthenticated,
    dispatch,
    onAddToCart,
    product?._id,
    title,
    mainImage,
    price,
    qty,
  ])

  const handleBuy = useCallback(() => {
    if (!isAuthenticated) {
      dispatch(
        addToast({
          title: 'Sign in required',
          message: 'Please sign in to buy now.',
          type: 'info',
        })
      )
      return
    }
    handleAdd()
  }, [handleAdd, isAuthenticated, dispatch])

  return (
    <div className="buybox">
      <div className="buybox__price">
        <strong>{formatCurrency(price)}</strong>
        {product?.salePrice && product?.salePrice < product?.price && (
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
            {Array.from({ length: Math.min(stock, 10) }, (_, i) => i + 1).map(
              (n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              )
            )}
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

      {inStock && stock < 5 && (
        <div className="buybox__stock-warning">
          Only {stock} left in stock — order soon
        </div>
      )}

      <div className="buybox__delivery">
        <strong>FREE delivery</strong> <span>Wed, Apr 15</span>
      </div>

      <div className="buybox__secure">🔒 Secure transaction</div>
    </div>
  )
}
