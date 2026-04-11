/* ===== CHECKOUT PAGE ===== */
/* Shipping address form and order placement with Yup validation */
/* Protected route — redirects to payment gateway on success */

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
import { checkoutSchema } from '../../features/orders/orderSchemas'
import Button from '../../components/shared/Button'
import './CheckoutPage.css'

const FIELDS = [
  { key: 'fullName', label: 'Full name', type: 'text', required: true },
  { key: 'addressLine1', label: 'Address', type: 'text', required: true },
  { key: 'city', label: 'City', type: 'text', required: true },
  { key: 'state', label: 'State / Province', type: 'text', required: false },
  {
    key: 'postalCode',
    label: 'ZIP / Postal code',
    type: 'text',
    required: true,
  },
  { key: 'country', label: 'Country', type: 'text', required: true },
]

export default function CheckoutPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const existing = useShippingAddress()
  const createOrderThunk = useCreateOrder()
  const startCheckout = useStartCheckout()
  const [form, setForm] = useState(() => ({ ...existing }))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const update = useCallback((key, val) => {
    setForm((f) => ({ ...f, [key]: val }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const validateField = useCallback(
    async (key, value) => {
      try {
        await checkoutSchema.validateAt(key, { ...form, [key]: value })
        setErrors((prev) => {
          const next = { ...prev }
          delete next[key]
          return next
        })
      } catch (err) {
        setErrors((prev) => ({ ...prev, [key]: err.message }))
      }
    },
    [form]
  )

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      try {
        await checkoutSchema.validate(form, { abortEarly: false })
      } catch (err) {
        const fieldErrors = {}
        err.inner.forEach((e) => {
          fieldErrors[e.path] = e.message
        })
        setErrors(fieldErrors)
        dispatch(
          addToast({
            title: 'Validation error',
            message: 'Please fix the form errors.',
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
            shippingAddress: {
              fullName: form.fullName,
              addressLine1: form.addressLine1,
              city: form.city,
              state: form.state,
              postalCode: form.postalCode,
              country: form.country,
            },
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
          const msg = result.payload ?? 'Could not create order.'
          // Handle 400 cart empty
          if (
            msg.toLowerCase().includes('empty') ||
            msg.toLowerCase().includes('no item')
          ) {
            dispatch(
              addToast({
                title: 'Cart is empty',
                message: 'Add some items to your cart before checking out.',
                type: 'error',
              })
            )
          } else {
            dispatch(
              addToast({
                title: 'Order failed',
                message: msg,
                type: 'error',
              })
            )
          }
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
      <form className="checkout-page__form" onSubmit={handleSubmit} noValidate>
        <div className="checkout-form">
          {FIELDS.map((f) => (
            <div key={f.key} className="checkout-form__field">
              <label htmlFor={f.key}>
                {f.label}
                {f.required ? ' *' : ''}
              </label>
              <input
                id={f.key}
                type={f.type}
                value={form[f.key] ?? ''}
                onChange={(e) => update(f.key, e.target.value)}
                onBlur={() => validateField(f.key, form[f.key])}
                required={f.required}
                aria-invalid={!!errors[f.key]}
                aria-describedby={errors[f.key] ? `${f.key}-error` : undefined}
              />
              {errors[f.key] && (
                <span
                  className="checkout-form__error"
                  id={`${f.key}-error`}
                  role="alert"
                >
                  {errors[f.key]}
                </span>
              )}
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
