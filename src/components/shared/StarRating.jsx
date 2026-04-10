/* ===== STAR RATING COMPONENT ===== */
/* Displays star rating with review count */
/* Used on ProductCard and ProductDetailPage */

import { memo } from 'react'
import './StarRating.css'

function StarRating({ rating, count, size = 'sm' }) {
  const stars = Math.round(rating || 0)
  return (
    <div className="stars">
      <span className={`stars__value stars--${size}`} aria-hidden="true">
        {'★'.repeat(stars)}
        {'☆'.repeat(5 - stars)}
      </span>
      {count != null && (
        <span className="stars__count">{count.toLocaleString()}</span>
      )}
    </div>
  )
}

export default memo(StarRating)
