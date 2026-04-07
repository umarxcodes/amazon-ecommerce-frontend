import CategoryCard from './CategoryCard.jsx'

export default function LifestyleGrid({ items, id }) {
  return (
    <section className="amazon-home-shell amazon-card-grid" id={id}>
      {items.map((card) => (
        <CategoryCard
          key={card.title}
          title={card.title}
          items={card.items}
          linkText={card.linkText}
        />
      ))}
    </section>
  )
}
