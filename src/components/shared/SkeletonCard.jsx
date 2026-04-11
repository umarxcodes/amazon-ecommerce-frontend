/* ===== SKELETON LOADING CARD ===== */
/* Placeholder UI during data fetching */
/* Mimics ProductCard layout for smooth loading transition */

import { memo } from 'react'
import './SkeletonCard.css'

function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-card__image" />
      <div className="skeleton-card__line skeleton-card__line--sm" />
      <div className="skeleton-card__line" />
      <div className="skeleton-card__button" />
    </div>
  )
}

export default memo(SkeletonCard)
