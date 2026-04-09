import { Link } from 'react-router-dom'
import { formatCurrency } from '../../../utils/helpers'

export default function CarouselProductCard({ product }) {
  const price = product.salePrice || product.price || 0

  return (
    <Link to={`/products/${product._id}`} className="carousel-product-card">
      <div className="carousel-product-card__image">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
        />
      </div>
      <div className="carousel-product-card__content">
        <h3 className="carousel-product-card__title">
          {product.title}
        </h3>
        <div className="carousel-product-card__price">
          {formatCurrency(price)}
        </div>
      </div>
    </Link>
  )
}
