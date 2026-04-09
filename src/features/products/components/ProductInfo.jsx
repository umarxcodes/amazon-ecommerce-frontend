import { Link } from 'react-router-dom'
import StarRating from '../../../components/ui/StarRating'
import ProductPricing from './ProductPricing'
import ProductTabs from './ProductTabs'
import './ProductInfo.css'

const DEFAULT_FEATURES = [
  'Fast dispatch — ships within 24 hours',
  '30-day free returns on eligible orders',
  'Secure checkout with Stripe protection',
  'Manufacturer warranty included',
]

export default function ProductInfo({ product }) {
  const features = product.features || DEFAULT_FEATURES
  const inStock = product.stock > 0

  return (
    <div className="product-info">
      <nav className="product-info__breadcrumbs">
        <Link to="/">Home</Link> <span>/</span>
        <Link to={`/products?category=${product.category}`}>{product.category}</Link> <span>/</span>
        <span className="product-info__breadcrumbs--current">{product.title}</span>
      </nav>

      <span className="product-info__category">{product.category}</span>
      <h1 className="product-info__title">{product.title}</h1>

      {product.brand && (
        <Link to={`/products?brand=${product.brand}`} className="product-info__brand">
          Visit the <strong>{product.brand}</strong> Store
        </Link>
      )}

      <StarRating rating={product.rating} count={product.reviewsCount} size="lg" />

      <hr className="product-info__divider" />

      <ProductPricing product={product} />

      <ul className="product-info__features">
        {features.map((f, i) => <li key={i}>{f}</li>)}
      </ul>

      <div className="product-info__stock">
        <span className={`product-info__stock-dot ${inStock ? 'product-info__stock-dot--in' : 'product-info__stock-dot--out'}`} />
        <span>{inStock ? `In Stock — ${product.stock} available` : 'Currently unavailable'}</span>
      </div>

      <hr className="product-info__divider" />

      <ProductTabs product={product} />
    </div>
  )
}
