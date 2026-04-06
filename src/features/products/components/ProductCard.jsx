import { Link } from 'react-router-dom'
import { useAppDispatch } from '../../../app/hooks'
import { addToCart } from '../../cart/cartSlice'
import { addToast } from '../../ui/uiSlice'
import { formatCurrency } from '../../../utils/helpers'
import Button from '../../../components/UI/Button'

export default function ProductCard({ product }) {
  const dispatch = useAppDispatch()
  const price = product.salePrice || product.price
  const rating = Number(product.rating || 0).toFixed(1)

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product._id,
        title: product.title,
        image: product.image,
        category: product.category,
        price,
        quantity: 1,
      })
    )
    dispatch(
      addToast({
        title: 'Added to cart',
        message: `${product.title} has been added to your cart.`,
        type: 'success',
      })
    )
  }

  return (
    <article className="product-card">
      <Link to={`/products/${product._id}`} className="product-card__image">
        <img src={product.image} alt={product.title} loading="lazy" />
      </Link>

      <div className="product-card__content">
        <div className="product-card__meta">
          <span className="chip">{product.category}</span>
          {product.featured ? <span className="badge">Featured</span> : null}
        </div>

        <Link to={`/products/${product._id}`} className="product-card__title">
          {product.title}
        </Link>
        <p className="product-card__brand">{product.brand}</p>

        <div className="rating-row">
          <span aria-label={`Rated ${rating} out of 5`}>{"★".repeat(Math.round(product.rating || 0))}</span>
          <span>{rating}</span>
          <span>{product.reviewsCount || 0} reviews</span>
        </div>

        <div className="price-row">
          <strong>{formatCurrency(price)}</strong>
          {product.salePrice ? <span>{formatCurrency(product.price)}</span> : null}
        </div>

        <div className="product-card__footer">
          <span className="inventory-pill">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
          <Button type="button" size="sm" onClick={handleAddToCart} disabled={product.stock < 1}>
            Add to cart
          </Button>
        </div>
      </div>
    </article>
  )
}
