/* ===== CHECKOUT PAGE ===== */
/* Shipping address form and order placement */
/* Protected route - redirects to payment gateway on success */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useAppDispatch,
  useShippingAddress,
  useCreateOrder,
  useStartCheckout,
  useCreateOrderStatus,
} from '../../hooks'
import { setShippingAddress } from '../../features/cart/cartSlice'
import { addToast } from '../../features/ui/uiSlice'
import { formatCurrency } from '../../utils/helpers'
import Button from '../../components/shared/Button'
import './CheckoutPage.css'

const FIELDS = [
  { key: 'fullName', label: 'Full name', type: 'text' },
  { key: 'addressLine1', label: 'Address', type: 'text' },
  { key: 'city', label: 'City', type: 'text' },
  { key: 'state', label: 'State / Province', type: 'text' },
  { key: 'postalCode', label: 'ZIP / Postal code', type: 'text' },
  { key: 'country', label: 'Country', type: 'text' },
]

export default function CheckoutPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const existing = useShippingAddress()
  const createOrder = useCreateOrder()
  const startCheckout = useStartCheckout()
  const status = useCreateOrderStatus()
  const [form, setForm] = useState(() => ({ ...existing }))

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.fullName || !form.addressLine1 || !form.city) {
      dispatch(
        addToast({
          title: 'Missing info',
          message: 'Please fill required fields.',
          type: 'error',
        })
      )
      return
    }
    dispatch(setShippingAddress(form))
    const result = await dispatch(createOrder(form))
    if (createOrder.fulfilled.match(result)) {
      const id = result.payload.order?._id || result.payload._id
      if (id) startCheckout(id)
    } else {
      dispatch(
        addToast({
          title: 'Order failed',
          message: result.payload || 'Could not create order.',
          type: 'error',
        })
      )
    }
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-page__title">Checkout</h1>
      <form className="checkout-page__form" onSubmit={handleSubmit}>
        <div className="checkout-form">
          {FIELDS.map((f) => (
            <div key={f.key} className="checkout-form__field">
              <label htmlFor={f.key}>
                {f.label}
                {!['state', 'country'].includes(f.key) ? ' *' : ''}
              </label>
              <input
                id={f.key}
                type={f.type}
                value={form[f.key] || ''}
                onChange={(e) => update(f.key, e.target.value)}
                required={!['state', 'country'].includes(f.key)}
              />
            </div>
          ))}
        </div>
        <div className="checkout-page__summary">
          <h3>Order Summary</h3>
          <Button
            variant="primary"
            fullWidth
            disabled={status === 'loading'}
            type="submit"
          >
            Place Order & Pay
          </Button>
          <Button
            variant="ghost"
            fullWidth
            type="button"
            onClick={() => navigate('/cart')}
          >
            Back to Cart
          </Button>
        </div>
      </form>
    </div>
  )
}
