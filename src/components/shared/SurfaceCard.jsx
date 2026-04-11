/* ===== SURFACE CARD COMPONENT ===== */
/* Basic card container with Amazon-style styling */
/* Used as a wrapper for content sections */

import { memo } from 'react'
import './SurfaceCard.css'

function SurfaceCard({ children, className = '' }) {
  return <div className={`surface-card ${className}`}>{children}</div>
}

export default memo(SurfaceCard)
