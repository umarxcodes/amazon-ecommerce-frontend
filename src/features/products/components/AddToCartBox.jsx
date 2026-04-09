import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../cart/cartSlice'
import { addToast } from '../../ui/uiSlice'
import { formatCurrency } from '../../../utils/helpers'
import Button from '../../../components/UI/Button'

export default function AddToCartBox({ product }) {
  const dispatch = useDispatch()
  const [quantity, setQuantity] = useState(1)
  const price = product.salePrice || product.price
  const inStock = product.stock > 0

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product._id,
        title: product.title,
        image: product.image,
        category: product.category,
        price,
        quantity,
      })
    )
    dispatch(
      addToast({
        title: 'Added to cart',
        message: `${product.title}${quantity > 1 ? ` (x${quantity})` : ''} is ready for checkout.`,
        type: 'success',
      })
    )
  }

  const handleBuyNow = () => {
    handleAddToCart()
  }

  return (
    <div className="pdp-buybox">
      <div className="pdp-buybox__price">
        <span className="pdp-buybox__price-label">Price</span>
        <strong>{formatCurrency(price)}</strong>
        {product.salePrice && product.salePrice < product.price && (
          <>
            <span className="pdp-buybox__was">
              Was: {formatCurrency(product.price)}
            </span>
            <span className="pdp-buybox__save">
              You save: {formatCurrency(product.price - product.salePrice)}
            </span>
          </>
        )}
      </div>

      {inStock && (
        <div className="pdp-buybox__quantity">
          <label htmlFor="pdp-qty">Quantity:</label>
          <select
            id="pdp-qty"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="pdp-buybox__qty-select"
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

      <div className="pdp-buybox__actions">
        <Button
          type="button"
          variant="primary"
          fullWidth
          disabled={!inStock}
          onClick={handleAddToCart}
        >
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
        <Button
          type="button"
          variant="accent"
          fullWidth
          disabled={!inStock}
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
      </div>

      <div className="pdp-buybox__stock">
        <span
          className={`pdp-buybox__stock-dot ${
            inStock ? 'pdp-buybox__stock-dot--in' : 'pdp-buybox__stock-dot--out'
          }`}
        />
        <span>
          {inStock ? `${product.stock} in stock` : 'Currently unavailable'}
        </span>
      </div>

      <div className="pdp-buybox__delivery">
        <strong>FREE delivery</strong>
        <span>Wed, Apr 15</span>
      </div>

      <div className="pdp-buybox__secure">
        <span>🔒</span>
        <span>Secure transaction</span>
      </div>
    </div>
  )
}
