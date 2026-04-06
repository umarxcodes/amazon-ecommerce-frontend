import { formatCurrency } from '../../../utils/helpers'
import Button from '../../../components/UI/Button'

export default function CartItemRow({ item, onQuantityChange, onRemove }) {
  return (
    <article className="cart-item">
      <img loading="lazy" src={item.image} alt={item.title} />

      <div className="cart-item__content">
        <div>
          <h3>{item.title}</h3>
          <p>{item.category}</p>
        </div>

        <div className="cart-item__actions">
          <div className="quantity-stepper" aria-label={`Quantity controls for ${item.title}`}>
            <button type="button" onClick={() => onQuantityChange(item.productId, item.quantity - 1)}>
              -
            </button>
            <span>{item.quantity}</span>
            <button type="button" onClick={() => onQuantityChange(item.productId, item.quantity + 1)}>
              +
            </button>
          </div>
          <strong>{formatCurrency(item.price * item.quantity)}</strong>
          <Button variant="ghost" onClick={() => onRemove(item.productId)} type="button">
            Remove
          </Button>
        </div>
      </div>
    </article>
  )
}
