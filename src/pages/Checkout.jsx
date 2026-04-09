import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useAppDispatch,
  useCartItems,
  useCheckoutStatus,
} from '../hooks/customHooks'
import {
  clearCart,
  createCheckoutSession,
  setShippingAddress,
} from '../features/cart/cartSlice'
import { addToast } from '../features/ui/uiSlice'
import OrderSummary from '../features/cart/components/OrderSummary'
import Field from '../components/UI/Field'

const defaultForm = {
  fullName: '',
  addressLine1: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'USA',
}

export default function Checkout() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const items = useCartItems()
  const checkoutStatus = useCheckoutStatus()
  const [formData, setFormData] = useState(defaultForm)

  const handleSubmit = async () => {
    dispatch(setShippingAddress(formData))
    const result = await dispatch(createCheckoutSession())

    if (createCheckoutSession.fulfilled.match(result)) {
      const checkoutUrl = result.payload.checkoutUrl || result.payload.url

      dispatch(clearCart())
      dispatch(
        addToast({
          title: 'Checkout session created',
          message: checkoutUrl
            ? 'Redirecting to Stripe checkout.'
            : 'Checkout payload created successfully.',
          type: 'success',
        })
      )

      if (checkoutUrl) {
        window.location.assign(checkoutUrl)
        return
      }

      navigate('/orders')
      return
    }

    dispatch(
      addToast({
        title: 'Checkout failed',
        message:
          result.payload ||
          'Please review your shipping information and try again.',
        type: 'error',
      })
    )
  }

  return (
    <div className="container split-layout page">
      <section className="stack-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Checkout</span>
            <h1>Shipping and payment handoff</h1>
          </div>
          <p>
            Structured form fields, clearer labels, and a stronger handoff into
            secure payment.
          </p>
        </div>

        <div className="form-grid">
          {Object.entries(formData).map(([key, value]) => (
            <Field key={key} label={key.replace(/([A-Z])/g, ' $1')}>
              <input
                className="field__control"
                value={value}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    [key]: event.target.value,
                  }))
                }
              />
            </Field>
          ))}
        </div>
      </section>

      <OrderSummary
        items={items}
        ctaLabel={
          checkoutStatus === 'loading'
            ? 'Creating session...'
            : 'Continue to Stripe'
        }
        onSubmit={handleSubmit}
        disabled={checkoutStatus === 'loading' || !items.length}
      />
    </div>
  )
}
