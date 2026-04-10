/* ===== SURFACE CARD COMPONENT ===== */
/* Basic card container with Amazon-style styling */
/* Used as a wrapper for content sections */

import './SurfaceCard.css'
export default function SurfaceCard({ children, className = '' }) {
  return <div className={`surface-card ${className}`}>{children}</div>
}
