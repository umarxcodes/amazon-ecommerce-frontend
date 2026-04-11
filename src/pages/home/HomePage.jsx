/* ===== HOME PAGE ===== */
/* Landing page with hero carousel and featured products */
/* Public route - no authentication required */

import { useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  useAppDispatch,
  useProducts,
  useProductStatus,
  useAddToCart,
  useIsAuthenticated,
  useFetchProducts,
} from '../../hooks'
import { addToast } from '../../features/ui/uiSlice'
import Carousel from '../../components/shared/Carousel'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import EmptyState from '../../components/shared/EmptyState'
import ProductCard from '../../features/products/components/ProductCard'
import SkeletonCard from '../../components/shared/SkeletonCard'
import './HomePage.css'

const CAROUSEL_IMAGES = [
  'https://res.cloudinary.com/dlul8f6xz/image/upload/v1775711803/banner4_iaccwu.jpg',
  'https://res.cloudinary.com/dlul8f6xz/image/upload/v1775711802/banner3_bdjt7k.jpg',
  'https://res.cloudinary.com/dlul8f6xz/image/upload/v1775711802/banner1_hki4sl.jpg',
  'https://res.cloudinary.com/dlul8f6xz/image/upload/v1775711802/banner2_gkbkhc.jpg',
]

const FEATURED_COUNT = 8

export default function HomePage() {
  const dispatch = useAppDispatch()
  const products = useProducts()
  const status = useProductStatus()
  const addToCart = useAddToCart()
  const isAuthenticated = useIsAuthenticated()
  const fetchProducts = useFetchProducts()

  useEffect(() => {
    if (status === 'idle') fetchProducts()
  }, [dispatch, status, fetchProducts])

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
          message: `${product.title ?? 'Product'} added to cart.`,
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
          <button className="btn btn--primary" onClick={() => fetchProducts()}>
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
