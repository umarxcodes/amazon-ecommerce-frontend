/* ===== EMPTY STATE COMPONENT ===== */
/* Displays when no data is available (no products, orders, etc.) */
/* Optional action button for user recovery */

import './EmptyState.css'

export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state__icon">{icon}</div>}
      <h2 className="empty-state__title">{title}</h2>
      {description && <p className="empty-state__description">{description}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  )
}
