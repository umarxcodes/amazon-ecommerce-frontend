export default function ProductCard({ product }) {
  return (
    <article className="amazon-product-card">
      {product.badge ? <span className="amazon-product-card__badge">{product.badge}</span> : null}

      <div className="amazon-product-card__media">
        <img src={product.image} alt={product.title} />
      </div>

      <p className="amazon-product-card__title">{product.title}</p>
    </article>
  )
}
