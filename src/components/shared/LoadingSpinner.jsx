/* ===== LOADING SPINNER COMPONENT ===== */
/* Displays animated loading indicator with optional label */
/* Supports full-screen mode for page-level loading */

import './LoadingSpinner.css'

export default function LoadingSpinner({
  label = 'Loading...',
  fullScreen = false,
}) {
  return (
    <div className={`spinner ${fullScreen ? 'spinner--fullscreen' : ''}`}>
      <div className="spinner__circle" />
      {label && <span className="spinner__label">{label}</span>}
    </div>
  )
}
