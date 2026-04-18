/* ===== PRODUCT TABS COMPONENT ===== */
/* Tabbed interface for Description, Specifications, Reviews */
/* Used on ProductDetailPage */

import { useState } from 'react'
import StarRating from '../../../components/shared/StarRating'
import './ProductTabs.css'

const TABS = [
  { key: 'description', label: 'Description' },
  { key: 'specifications', label: 'Specifications' },
  { key: 'reviews', label: 'Reviews' },
]

export default function ProductTabs({ product }) {
  const [active, setActive] = useState('description')

  return (
    <div className="product-tabs">
      <div className="product-tabs__bar" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={active === t.key}
            className={`product-tabs__tab ${active === t.key ? 'product-tabs__tab--active' : ''}`}
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="product-tabs__panel">
        {active === 'description' && (
          <p className="product-tabs__desc">
            {product?.description || 'No description available.'}
          </p>
        )}

        {active === 'specifications' && (
          <table className="product-tabs__specs">
            <tbody>
              <tr>
                <th>Brand</th>
                <td>{product?.brand || 'N/A'}</td>
              </tr>
              <tr>
                <th>Category</th>
                <td>{product?.category || 'N/A'}</td>
              </tr>
              <tr>
                <th>Rating</th>
                <td>
                  <StarRating rating={product?.ratings} />{' '}
                  {Number(product?.ratings || 0).toFixed(1)} / 5
                </td>
              </tr>
              <tr>
                <th>Reviews</th>
                <td>{(product?.reviewsCount || 0).toLocaleString()}</td>
              </tr>
              <tr>
                <th>Stock</th>
                <td>{product?.stock ?? 'N/A'} units</td>
              </tr>
              {product?.featured && (
                <tr>
                  <th>Featured</th>
                  <td>Yes</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {active === 'reviews' && (
          <div className="product-tabs__reviews">
            <StarRating
              rating={product?.ratings}
              count={product?.reviewsCount}
              size="lg"
            />
            <p className="product-tabs__reviews-placeholder">
              Customer reviews will appear here once available.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
