export default function CategoryCard({ title, items, linkText, linkHref = '#top-categories' }) {
  return (
    <article className="amazon-category-card">
      <h2>{title}</h2>

      <div className="amazon-category-card__grid">
        {items.map((item) => (
          <figure key={item.title} className="amazon-category-card__item">
            <img src={item.image} alt={item.title} />
            <figcaption>{item.title}</figcaption>
          </figure>
        ))}
      </div>

      <a className="amazon-category-card__link" href={linkHref}>
        {linkText}
      </a>
    </article>
  )
}
