/* ===== PRODUCT CARD COMPONENT ===== */
/* Displays single product in catalog/grid views */
/* Shows price, rating, stock status, and Add to Cart button */

import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import StarRating from '../../../components/shared/StarRating'
import './ProductCard.css'

function ProductCard({ product, onAddToCart }) {
  const [imgErr, setImgErr] = useState(false)
  const stock = product.stock ?? 0
  const inStock = stock > 0

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-card__img-wrap">
        <img
          src={
            imgErr || !product.image
              ? 'https://placehold.co/300x300'
              : product.image
          }
          alt={product.title ?? 'Product'}
          onError={() => setImgErr(true)}
          loading="lazy"
          width="300"
          height="300"
        />
        {product.featured && (
          <span className="product-card__badge">Featured</span>
        )}
      </Link>
      <Link to={`/products/${product._id}`} className="product-card__title">
        {product.title}
      </Link>
      <StarRating rating={product.rating} count={product.reviewsCount} />
      <div className="product-card__price">
        <span className="product-card__price-symbol">$</span>
        <span className="product-card__price-value">
          {product.price ? Number(product.price).toFixed(2) : '0.00'}
        </span>
      </div>
      {product.salePrice && product.salePrice < product.price && (
        <div className="product-card__was">
          <s>${Number(product.price).toFixed(2)}</s>
        </div>
      )}
      {product.prime && <span className="product-card__prime">✓ prime</span>}
      {!inStock && (
        <span className="product-card__out">Currently unavailable</span>
      )}
      {inStock && stock < 5 && (
        <span className="product-card__stock">Only {stock} left</span>
      )}
      {inStock && (
        <button
          type="button"
          className="product-card__add-btn"
          onClick={(e) => {
            e.preventDefault()
            onAddToCart?.(product)
          }}
        >
          Add to Cart
        </button>
      )}
    </div>
  )
}

export default memo(ProductCard)
