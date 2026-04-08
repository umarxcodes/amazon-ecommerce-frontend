import ProductPricing from './ProductPricing'
import ProductTabs from './ProductTabs'

const DEFAULT_FEATURES = [
  'Fast dispatch — ships within 24 hours',
  '30-day free returns on eligible orders',
  'Secure checkout with Stripe protection',
  'Manufacturer warranty included',
]

export default function ProductInfo({ product }) {
  const features = product.features || DEFAULT_FEATURES

  return (
    <div className="pdp-info">
      <div className="pdp-info__breadcrumbs">
        <a href="/">Home</a>
        <span>/</span>
        <a href={`/products?category=${product.category}`}>
          {product.category}
        </a>
        <span>/</span>
        <span className="pdp-info__breadcrumbs--current">{product.title}</span>
      </div>

      <span className="pdp-info__category-chip">{product.category}</span>

      <h1 className="pdp-info__title">{product.title}</h1>

      <a href={`/products?brand=${product.brand}`} className="pdp-info__brand">
        Visit the <strong>{product.brand}</strong> Store
      </a>

      <div className="pdp-info__rating">
        <span
          className="pdp-info__stars"
          aria-label={`Rating: ${product.rating} out of 5`}
        >
          {'★'.repeat(Math.round(product.rating || 0))}
          {'☆'.repeat(5 - Math.round(product.rating || 0))}
        </span>
        <span className="pdp-info__rating-value">
          {Number(product.rating || 0).toFixed(1)}
        </span>
        <span className="pdp-info__reviews-count">
          {(product.reviewsCount || 0).toLocaleString()} ratings
        </span>
      </div>

      <hr className="pdp-info__divider" />

      <ProductPricing product={product} />

      <ul className="pdp-info__features">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>

      <div className="pdp-info__availability">
        <span
          className={`pdp-info__availability-dot ${
            product.stock > 0 ? 'pdp-info__availability-dot--in-stock' : ''
          }`}
        />
        <span>
          {product.stock > 0
            ? `In Stock — ${product.stock} available`
            : 'Currently unavailable'}
        </span>
      </div>

      <ProductTabs product={product} />
    </div>
  )
}
