/*
📁 FILE: ProductCard.jsx
📌 PURPOSE: Reusable product card with image, rating, price, and badge
======================================
*/

// =====*** IMPORTS ***=====
import { Link } from 'react-router-dom'

// =====*** HELPERS ***=====
function renderStars(rating) {
  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.3
  const stars = []
  for (let i = 0; i < 5; i++) {
    if (i < full) stars.push('\u2605')
    else if (i === full && hasHalf) stars.push('\u2606')
    else stars.push('\u2606')
  }
  return stars.join('')
}

function formatPrice(price) {
  return `$${price.toFixed(2)}`
}

// =====*** COMPONENT ***=====
/**
 * @param {object} props
 * @param {object} props.product - Product data object
 */
export default function ProductCard({ product }) {
  const {
    id,
    title,
    brand,
    image,
    price,
    salePrice,
    rating,
    reviewsCount,
    badge,
  } = product
  const discount = salePrice
    ? Math.round(((price - salePrice) / price) * 100)
    : 0

  return (
    <Link to={`/product/${id}`} className="product-card">
      {/* Image */}
      <div className="product-card__image">
        <img src={image} alt={title} loading="lazy" />
        {badge && <span className="badge">{badge}</span>}
      </div>

      {/* Content */}
      <div className="product-card__content">
        <h3 className="product-card__title">{title}</h3>
        <p className="product-card__brand">{brand}</p>

        {/* Rating */}
        <div className="rating-row">
          <span
            className="rating-stars"
            aria-label={`Rating: ${rating} out of 5`}
          >
            {renderStars(rating)}
          </span>
          <span>({reviewsCount.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="price-row">
          {salePrice && salePrice < price && (
            <>
              <span className="discount-percent">-{discount}%</span>
              <strong>{formatPrice(salePrice)}</strong>
              <span>{formatPrice(price)}</span>
            </>
          )}
          {!salePrice && <strong>{formatPrice(price)}</strong>}
        </div>
      </div>
    </Link>
  )
}
