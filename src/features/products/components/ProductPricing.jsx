import { formatCurrency } from '../../../utils/helpers'

export default function ProductPricing({ product }) {
  const price = product.salePrice || product.price
  const hasDiscount = product.salePrice && product.salePrice < product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0

  return (
    <div className="pdp-pricing">
      {hasDiscount && (
        <div className="pdp-pricing__discount-badge">-{discountPercent}%</div>
      )}

      <div className="pdp-pricing__row">
        <span className="pdp-pricing__label">Price</span>
        <span className="pdp-pricing__current">{formatCurrency(price)}</span>
      </div>

      {hasDiscount && (
        <div className="pdp-pricing__row pdp-pricing__row--was">
          <span className="pdp-pricing__label">Was</span>
          <span className="pdp-pricing__original">
            {formatCurrency(product.price)}
          </span>
        </div>
      )}

      <div className="pdp-pricing__per-unit">
        {formatCurrency(price)} per item
      </div>
    </div>
  )
}
