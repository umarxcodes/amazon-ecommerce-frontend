import './LoadingSpinner.css'

export default function LoadingSpinner({ label = 'Loading...', fullScreen = false }) {
  return (
    <div className={`spinner ${fullScreen ? 'spinner--fullscreen' : ''}`}>
      <div className="spinner__circle" />
      {label && <span className="spinner__label">{label}</span>}
    </div>
  )
}
