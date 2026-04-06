export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="skeleton-stack" aria-hidden="true">
        <span className="skeleton-line skeleton-line--lg" />
        <span className="skeleton-line" />
        <span className="skeleton-line skeleton-line--sm" />
      </div>
      <p>{label}</p>
    </div>
  )
}
