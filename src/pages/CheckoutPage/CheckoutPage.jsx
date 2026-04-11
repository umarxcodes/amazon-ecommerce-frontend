/* ===== CHECKOUT PAGE ===== */
/* Shipping address form and order placement */
/* Protected route - redirects to payment gateway on success */

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useAppDispatch,
  useShippingAddress,
  useCreateOrder,
  useStartCheckout,
} from '../../hooks'
import { setShippingAddress } from '../../features/cart/cartSlice'
import { createOrder } from '../../features/orders/orderSlice'
import { addToast } from '../../features/ui/uiSlice'
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
  const createOrderThunk = useCreateOrder()
  const startCheckout = useStartCheckout()
  const [form, setForm] = useState(() => ({ ...existing }))
  const [isSubmitting, setIsSubmitting] = useState(false)

  const update = useCallback((key, val) => {
    setForm((f) => ({ ...f, [key]: val }))
  }, [])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      if (!form.fullName || !form.addressLine1 || !form.city) {
        dispatch(
          addToast({
            title: 'Missing info',
            message: 'Please fill in all required fields.',
            type: 'error',
          })
        )
        return
      }
      dispatch(setShippingAddress(form))
      setIsSubmitting(true)
      try {
        const result = await dispatch(
          createOrderThunk({
            shippingAddress: form,
            totalAmount: 0,
          })
        )
        if (createOrder.fulfilled.match(result)) {
          const order =
            result.payload.order ?? result.payload.data ?? result.payload
          const id = order?._id ?? order?.id
          if (id) {
            startCheckout(id)
          } else {
            dispatch(
              addToast({
                title: 'Order created',
                message: 'Your order has been placed successfully.',
                type: 'success',
              })
            )
            navigate('/orders')
          }
        } else {
          dispatch(
            addToast({
              title: 'Order failed',
              message: result.payload ?? 'Could not create order.',
              type: 'error',
            })
          )
        }
      } finally {
        setIsSubmitting(false)
      }
    },
    [dispatch, form, createOrderThunk, startCheckout, navigate]
  )

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
                value={form[f.key] ?? ''}
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
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Placing Order...' : 'Place Order & Pay'}
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
