import { formatCurrency } from '../../../utils/helpers'
import Button from '../../../components/UI/Button'

export default function OrderSummary({ items, ctaLabel, onSubmit, disabled }) {
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal > 250 ? 0 : 18
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <aside className="summary-card">
      <h3>Order summary</h3>
      <p className="summary-copy">Transparent pricing with shipping and taxes surfaced before checkout.</p>

      <div className="summary-row">
        <span>Subtotal</span>
        <strong>{formatCurrency(subtotal)}</strong>
      </div>
      <div className="summary-row">
        <span>Shipping</span>
        <strong>{shipping ? formatCurrency(shipping) : 'Free'}</strong>
      </div>
      <div className="summary-row">
        <span>Estimated tax</span>
        <strong>{formatCurrency(tax)}</strong>
      </div>
      <div className="summary-row total">
        <span>Total</span>
        <strong>{formatCurrency(total)}</strong>
      </div>

      <Button className="full-width" onClick={onSubmit} disabled={disabled} type="button">
        {ctaLabel}
      </Button>
    </aside>
  )
}
