export default function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <span className="empty-state__icon" aria-hidden="true">
        ◌
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  )
}
