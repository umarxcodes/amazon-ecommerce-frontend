import { useState } from 'react'

const TABS = [
  { key: 'description', label: 'Description' },
  { key: 'specifications', label: 'Specifications' },
  { key: 'reviews', label: 'Reviews' },
]

export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState('description')

  return (
    <div className="pdp-tabs">
      <div className="pdp-tabs__bar" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            type="button"
            className={`pdp-tabs__tab ${
              activeTab === tab.key ? 'pdp-tabs__tab--active' : ''
            }`}
            onClick={() => setActiveTab(tab.key)}
            aria-selected={activeTab === tab.key}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="pdp-tabs__panel">
        {activeTab === 'description' && (
          <div className="pdp-tabs__description">
            <p>
              {product.description ||
                'No description available for this product.'}
            </p>
          </div>
        )}

        {activeTab === 'specifications' && (
          <div className="pdp-tabs__specifications">
            <table className="pdp-tabs__spec-table">
              <tbody>
                <tr>
                  <th>Brand</th>
                  <td>{product.brand}</td>
                </tr>
                <tr>
                  <th>Category</th>
                  <td>{product.category}</td>
                </tr>
                <tr>
                  <th>Rating</th>
                  <td>{Number(product.rating || 0).toFixed(1)} / 5</td>
                </tr>
                <tr>
                  <th>Reviews</th>
                  <td>{(product.reviewsCount || 0).toLocaleString()}</td>
                </tr>
                {product.tags && product.tags.length > 0 && (
                  <tr>
                    <th>Tags</th>
                    <td>{product.tags.join(', ')}</td>
                  </tr>
                )}
                <tr>
                  <th>Stock</th>
                  <td>{product.stock} units</td>
                </tr>
                {product.featured && (
                  <tr>
                    <th>Featured</th>
                    <td>Yes</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="pdp-tabs__reviews">
            <div className="pdp-tabs__reviews-summary">
              <div className="pdp-tabs__reviews-score">
                <span className="pdp-tabs__reviews-score__number">
                  {Number(product.rating || 0).toFixed(1)}
                </span>
                <span className="pdp-tabs__reviews-score__stars">
                  {'★'.repeat(Math.round(product.rating || 0))}
                </span>
                <span>
                  Based on {(product.reviewsCount || 0).toLocaleString()}{' '}
                  ratings
                </span>
              </div>
            </div>
            <p className="pdp-tabs__reviews-placeholder">
              Customer reviews will appear here once available.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
