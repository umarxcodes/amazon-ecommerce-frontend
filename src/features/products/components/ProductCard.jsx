/* ===== PRODUCT CARD COMPONENT ===== */
/* Amazon-style product card matching Amazon.com design */

import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import StarRating from '../../../components/shared/StarRating'
import './ProductCard.css'

function ProductCard({
  product,
  onAddToCart,
  onRemove,
  showRemoveButton = false,
}) {
  const [imgErr, setImgErr] = useState(false)
  const stock = product.stock ?? 0
  const inStock = stock > 0
  const title = product.title ?? product.name ?? 'Product'
  const thumbSrc = product.images?.[0] ?? product.image ?? ''

  // Calculate discount if salePrice exists
  const price = product.price ?? 0
  const listPrice =
    product.listPrice ?? (price > 0 ? Math.round(price * 1.3) : 0)
  const hasDiscount = listPrice > price
  const discountPercent = hasDiscount
    ? Math.round(((listPrice - price) / listPrice) * 100)
    : 0

  // Delivery date estimate
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + (inStock ? 3 : 0))
  const deliveryStr = inStock
    ? `FREE delivery ${deliveryDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`
    : ''

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-card__img-wrap">
        {hasDiscount && (
          <span className="product-card__discount">-{discountPercent}%</span>
        )}
        <img
          src={imgErr || !thumbSrc ? 'https://placehold.co/300x300' : thumbSrc}
          alt={title}
          onError={() => setImgErr(true)}
          loading="lazy"
          width="300"
          height="300"
        />
      </Link>

      <Link to={`/products/${product._id}`} className="product-card__title">
        {title}
      </Link>

      <div className="product-card__rating">
        <StarRating
          rating={product.ratings ?? product.rating ?? 0}
          count={product.numReviews ?? product.reviewsCount ?? 0}
        />
        <span className="product-card__reviews-count">
          {product.numReviews ?? product.reviewsCount ?? 0}
        </span>
      </div>

      <div className="product-card__price-row">
        {hasDiscount && <span className="product-card__price-symbol">$</span>}
        <span
          className={`product-card__price-value ${hasDiscount ? 'product-card__price-value--sale' : ''}`}
        >
          {price.toFixed(2)}
        </span>
      </div>

      {hasDiscount && (
        <div className="product-card__list-price">
          List: <s>${listPrice.toFixed(2)}</s>
        </div>
      )}

      {deliveryStr && (
        <div className="product-card__delivery">
          <span className="product-card__delivery-icon">🚚</span>
          <span className="product-card__delivery-text">{deliveryStr}</span>
        </div>
      )}

      {product.prime && (
        <div className="product-card__prime">
          <span className="product-card__prime-check">✓</span> prime
        </div>
      )}

      {!inStock && (
        <span className="product-card__out">Currently unavailable</span>
      )}
      {inStock && stock < 5 && (
        <span className="product-card__stock">Only {stock} left in stock</span>
      )}

      {inStock && (
        <button
          type="button"
          className="product-card__add-btn"
          onClick={(e) => {
            e.preventDefault()
            onAddToCart?.({
              productId: product._id,
              title,
              image: thumbSrc,
              price: product.salePrice ?? product.price ?? 0,
              quantity: 1,
            })
          }}
        >
          Add to Cart
        </button>
      )}

      {showRemoveButton && onRemove && (
        <button
          type="button"
          className="product-card__remove-btn"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onRemove(product)
          }}
        >
          <i className="fas fa-trash-alt" /> Remove
        </button>
      )}
    </div>
  )
}

export default memo(ProductCard)
