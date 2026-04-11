/* ===== CHECKOUT PAGE ===== */
/* Shipping address form and order placement with Yup validation */
/* Protected route — redirects to payment gateway on success */

import { useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  useAppDispatch,
  useShippingAddress,
  useCreateOrder,
  useStartCheckout,
  useCartItems,
  useCartTotal,
} from '../../hooks'
import { setShippingAddress } from '../../features/cart/cartSlice'
import { createOrder } from '../../features/orders/orderSlice'
import { addToast } from '../../features/ui/uiSlice'
import { checkoutSchema } from '../../features/orders/orderSchemas'
import { formatCurrency } from '../../utils/helpers'
import Button from '../../components/shared/Button'
import './CheckoutPage.css'

const FIELDS = [
  { key: 'address', label: 'Address', type: 'text', required: true },
  { key: 'city', label: 'City', type: 'text', required: true },
  { key: 'postalCode', label: 'Postal code', type: 'text', required: true },
  { key: 'country', label: 'Country', type: 'text', required: true },
]

export default function CheckoutPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const existing = useShippingAddress()
  const cartItems = useCartItems()
  const cartTotal = useCartTotal()
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

      if (!cartItems.length) {
        dispatch(
          addToast({
            title: 'Cart is empty',
            message: 'Nothing to order. Add items to your cart first.',
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
              address: form.address,
              city: form.city,
              postalCode: form.postalCode,
              country: form.country,
            },
          })
        )
        if (createOrder.fulfilled.match(result)) {
          // Backend returns: { success: true, order: { _id, items, ... } }
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
    [
      dispatch,
      form,
      cartItems,
      cartTotal,
      createOrderThunk,
      startCheckout,
      navigate,
    ]
  )

  return (
    <div className="checkout-page">
      <h1 className="checkout-page__title">Checkout</h1>
      <div className="checkout-page__layout">
        {/* Left: Order Summary */}
        <div className="checkout-page__summary">
          <h2 className="checkout-page__summary-title">
            Order Summary ({cartItems.length} item
            {cartItems.length !== 1 ? 's' : ''})
          </h2>
          {cartItems.length === 0 ? (
            <p className="checkout-page__empty-cart">
              Your cart is empty. <Link to="/products">Browse products</Link>
            </p>
          ) : (
            <>
              <div className="checkout-page__items">
                {cartItems.map((item) => (
                  <div
                    key={item.productId ?? item._id}
                    className="checkout-page__item"
                  >
                    <img
                      src={item.image ?? 'https://placehold.co/60x60'}
                      alt={item.title ?? 'Product'}
                      className="checkout-page__item-img"
                      loading="lazy"
                      width="60"
                      height="60"
                    />
                    <div className="checkout-page__item-info">
                      <span className="checkout-page__item-title">
                        {item.title}
                      </span>
                      <span className="checkout-page__item-qty">
                        Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="checkout-page__item-price">
                      {formatCurrency((item.price ?? 0) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="checkout-page__totals">
                <div className="checkout-page__totals-row">
                  <span>Subtotal</span>
                  <span>
                    <strong>{formatCurrency(cartTotal)}</strong>
                  </span>
                </div>
                <div className="checkout-page__totals-row">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="checkout-page__totals-row checkout-page__totals-row--total">
                  <span>Order Total</span>
                  <span>
                    <strong>{formatCurrency(cartTotal)}</strong>
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right: Shipping Address Form */}
        <form
          className="checkout-page__form"
          onSubmit={handleSubmit}
          noValidate
        >
          <h2 className="checkout-page__form-title">Shipping Address</h2>
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
          <Button
            variant="primary"
            fullWidth
            disabled={isSubmitting || cartItems.length === 0}
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
        </form>
      </div>
    </div>
  )
}
