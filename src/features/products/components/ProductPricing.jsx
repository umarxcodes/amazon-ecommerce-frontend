import { formatCurrency } from '../../../utils/helpers'
import './ProductPricing.css'

export default function ProductPricing({ product }) {
  const price = product.salePrice || product.price
  const hasDiscount = product.salePrice && product.salePrice < product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0

  return (
    <div className="product-pricing">
      {hasDiscount && (
        <span className="product-pricing__discount">-{discountPercent}%</span>
      )}
      <div className="product-pricing__amount">
        <span className="product-pricing__symbol">$</span>
        <span className="product-pricing__value">
          {price ? Number(price).toFixed(2) : '0.00'}
        </span>
      </div>
      {hasDiscount && (
        <div className="product-pricing__was">
          List Price: <s>{formatCurrency(product.price)}</s>
        </div>
      )}
      <div className="product-pricing__per-unit">
        {formatCurrency(price)} per item
      </div>
    </div>
  )
}
