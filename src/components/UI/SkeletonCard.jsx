export default function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-card__media" />
      <div className="skeleton-line skeleton-line--sm" />
      <div className="skeleton-line skeleton-line--lg" />
      <div className="skeleton-line" />
      <div className="skeleton-card__footer">
        <div className="skeleton-line skeleton-line--sm" />
        <div className="skeleton-button" />
      </div>
    </div>
  )
}
