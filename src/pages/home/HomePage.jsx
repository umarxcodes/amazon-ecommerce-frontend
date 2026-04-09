import { useEffect, useCallback } from 'react'
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
import Carousel from '../../components/shared/Carousel'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import EmptyState from '../../components/shared/EmptyState'
import ProductCard from '../../features/products/components/ProductCard'
import SkeletonCard from '../../components/shared/SkeletonCard'
import './HomePage.css'

const CAROUSEL_IMAGES = [
  'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=1600&q=80',
]

const FEATURED_COUNT = 8

export default function HomePage() {
  const dispatch = useAppDispatch()
  const products = useProducts()
  const status = useProductStatus()
  const addToCart = useAddToCart()
  const isAuthenticated = useIsAuthenticated()

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts())
  }, [dispatch, status])

  const handleAddToCart = useCallback(
    (product) => {
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
    },
    [dispatch, isAuthenticated, addToCart]
  )

  if (status === 'loading' && !products.length) {
    return (
      <div className="home-page">
        <div className="home-page__skeleton-grid">
          {Array.from({ length: FEATURED_COUNT }).map((_, index) => (
            <SkeletonCard key={index} />
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

  const featuredProducts = products.slice(0, FEATURED_COUNT)
  const remainingProducts = products.slice(FEATURED_COUNT)

  return (
    <div className="home-page">
      <Carousel images={CAROUSEL_IMAGES} autoPlayInterval={4000} />

      <section className="home-page__section">
        <h2 className="home-page__section-title">Featured Products</h2>
        {featuredProducts.length === 0 ? (
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
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </section>

      {remainingProducts.length > 0 && (
        <section className="home-page__section">
          <h2 className="home-page__section-title">More for You</h2>
          <div className="home-page__grid">
            {remainingProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
