import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../../../utils/helpers'
import StarRating from '../../../components/ui/StarRating'
import './ProductCard.css'

function ProductCard({ product, onAddToCart }) {
  const [imgErr, setImgErr] = useState(false)
  const inStock = product.stock > 0

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-card__img-wrap">
        <img
          src={
            imgErr
              ? 'https://placehold.co/300x300'
              : product.image || 'https://placehold.co/300x300'
          }
          alt={product.title}
          onError={() => setImgErr(true)}
          loading="lazy"
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
          <s>{formatCurrency(product.price)}</s>
        </div>
      )}
      {product.prime && <span className="product-card__prime">✓ prime</span>}
      {!inStock && (
        <span className="product-card__out">Currently unavailable</span>
      )}
      {inStock && product.stock < 5 && (
        <span className="product-card__stock">Only {product.stock} left</span>
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
