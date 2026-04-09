import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  useAppDispatch,
  useProducts,
  useProductStatus,
  useAddToCart,
  useIsAuthenticated,
} from '../../hooks'
import { fetchProducts } from '../../features/products/productSlice'
import { addToast } from '../../features/ui/uiSlice'
import Carousel from '../../components/ui/Carousel'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import ProductCard from '../../features/products/components/ProductCard'
import SkeletonCard from '../../components/ui/SkeletonCard'
import './HomePage.css'

const CAROUSEL_IMAGES = [
  'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=1600&q=80',
]

export default function HomePage() {
  const dispatch = useAppDispatch()
  const products = useProducts()
  const status = useProductStatus()
  const addToCart = useAddToCart()
  const isAuthenticated = useIsAuthenticated()

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts())
  }, [dispatch, status])

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      dispatch(
        addToast({
          title: 'Sign in required',
          message: 'Please sign in to add items.',
          type: 'info',
        })
      )
      return
    }
    addToCart({ productId: product._id, quantity: 1 })
    dispatch(
      addToast({
        title: 'Added',
        message: `${product.title} added to cart.`,
        type: 'success',
      })
    )
  }

  if (status === 'loading' && !products.length) {
    return (
      <div className="home-page">
        <div className="home-page__skeleton-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (status === 'failed' && !products.length) {
    return (
      <EmptyState
        title="Unable to load products"
        description="Please try again later."
        action={
          <button
            className="btn btn--primary"
            onClick={() => dispatch(fetchProducts())}
          >
            Retry
          </button>
        }
      />
    )
  }

  return (
    <div className="home-page">
      <Carousel images={CAROUSEL_IMAGES} autoPlayInterval={4000} />

      <section className="home-page__section">
        <h2 className="home-page__section-title">Featured Products</h2>
        {products.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Check back soon for new arrivals."
            action={
              <Link to="/products" className="btn btn--primary">
                Browse All
              </Link>
            }
          />
        ) : (
          <div className="home-page__grid">
            {products.slice(0, 8).map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </section>

      {products.length > 8 && (
        <section className="home-page__section">
          <h2 className="home-page__section-title">More for You</h2>
          <div className="home-page__grid">
            {products.slice(8).map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
