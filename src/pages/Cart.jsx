import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import EmptyState from '../components/UI/EmptyState'
import CartItemRow from '../features/cart/components/CartItemRow'
import OrderSummary from '../features/cart/components/OrderSummary'
import { removeFromCart, updateCartQuantity } from '../features/cart/cartSlice'
import Button from '../components/UI/Button'

export default function Cart() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const items = useAppSelector((state) => state.cart.items)
  const token = useAppSelector((state) => state.auth.token)

  if (!items.length) {
    return (
      <div className="container page">
        <EmptyState
          title="Your cart is empty"
          description="Browse the catalog and add products to build a confident checkout flow."
          action={
            <Button as={Link} to="/">
              Continue shopping
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="container split-layout page">
      <section className="stack-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Cart</span>
            <h1>Review your selected items</h1>
          </div>
          <p>Clear quantity controls, saved cart state, and a checkout summary that stays visible.</p>
        </div>

        <div className="stack-list">
          {items.map((item) => (
            <CartItemRow
              key={item.productId}
              item={item}
              onQuantityChange={(productId, quantity) =>
                dispatch(updateCartQuantity({ productId, quantity }))
              }
              onRemove={(productId) => dispatch(removeFromCart(productId))}
            />
          ))}
        </div>

        <div className="cart-actions">
          <Button as={Link} to="/" variant="ghost">
            Keep shopping
          </Button>
        </div>
      </section>

      <OrderSummary
        items={items}
        ctaLabel={token ? 'Proceed to checkout' : 'Sign in to checkout'}
        onSubmit={() => navigate(token ? '/checkout' : '/login')}
      />
    </div>
  )
}
