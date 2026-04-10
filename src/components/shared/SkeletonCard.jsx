import './SkeletonCard.css'

export default function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-card__image" />
      <div className="skeleton-card__line skeleton-card__line--sm" />
      <div className="skeleton-card__line" />
      <div className="skeleton-card__button" />
    </div>
  )
}
