/* ===== CATEGORY CARD COMPONENT ===== */
/* Amazon-style category card with title, image grid, and shop now link */

import { Link } from 'react-router-dom'
import './CategoryCard.css'

export default function CategoryCard({ title, items, linkText = 'Shop now', linkTo = '/products' }) {
  // items should be an array of 4 objects: [{ image, title, link? }]
  const displayItems = items || []

  return (
    <div className="category-card">
      <h2 className="category-card__title">{title}</h2>
      <div className="category-card__grid">
        {displayItems.map((item, index) => (
          <div key={index} className="category-card__item">
            <img
              src={item.image}
              alt={item.title || ''}
              className="category-card__img"
              loading="lazy"
            />
            <p className="category-card__item-title">{item.title}</p>
          </div>
        ))}
      </div>
      <Link to={linkTo} className="category-card__link">
        {linkText}
      </Link>
    </div>
  )
}
