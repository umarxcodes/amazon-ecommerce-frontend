/* ===== HOME PAGE ===== */
/* Amazon-style homepage with hero carousel and product cards */
/* Public route - no authentication required */

import { useEffect, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  useAppDispatch,
  useProducts,
  useProductStatus,
  useAddToCart,
  useIsAuthenticated,
  useFetchProducts,
  useDeleteProduct,
} from '../../hooks'
import { addToast } from '../../features/ui/uiSlice'
import Carousel from '../../components/shared/Carousel'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import EmptyState from '../../components/shared/EmptyState'
import ProductCard from '../../features/products/components/ProductCard'
import SkeletonCard from '../../components/shared/SkeletonCard'
import ConfirmationModal from '../../components/shared/ConfirmationModal'
import './HomePage.css'

const CAROUSEL_IMAGES = [
  'https://res.cloudinary.com/dlul8f6xz/image/upload/v1775711803/banner4_iaccwu.jpg',
  'https://res.cloudinary.com/dlul8f6xz/image/upload/v1775711802/banner3_bdjt7k.jpg',
  'https://res.cloudinary.com/dlul8f6xz/image/upload/v1775711802/banner1_hki4sl.jpg',
  'https://res.cloudinary.com/dlul8f6xz/image/upload/v1775711802/banner2_gkbkhc.jpg',
]

export default function HomePage() {
  const dispatch = useAppDispatch()
  const products = useProducts()
  const status = useProductStatus()
  const addToCart = useAddToCart()
  const deleteProductFn = useDeleteProduct()
  const isAuthenticated = useIsAuthenticated()
  const fetchProducts = useFetchProducts()

  const [removeModal, setRemoveModal] = useState({ open: false, product: null })
  const [isDeleting, setIsDeleting] = useState(false)

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

  const handleRemoveClick = useCallback((product) => {
    setRemoveModal({ open: true, product })
  }, [])

  const handleRemoveConfirm = useCallback(async () => {
    if (!removeModal.product) return
    setIsDeleting(true)

    const result = await dispatch(deleteProductFn(removeModal.product._id))
    if (deleteProductFn.fulfilled.match(result)) {
      dispatch(
        addToast({
          title: 'Product removed',
          message: `"${removeModal.product.title}" has been deleted.`,
          type: 'success',
        })
      )
    } else {
      dispatch(
        addToast({
          title: 'Failed',
          message: result.payload ?? 'Could not delete product.',
          type: 'error',
        })
      )
    }

    setIsDeleting(false)
    setRemoveModal({ open: false, product: null })
  }, [dispatch, deleteProductFn, removeModal.product])

  if (status === 'loading' && !products.length) {
    return (
      <div className="home-page">
        <div className="home-page__skeleton-grid">
          {Array.from({ length: 8 }).map((_, index) => (
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

  return (
    <div className="home-page">
      <Carousel images={CAROUSEL_IMAGES} autoPlayInterval={4000} />

      {/* Products section */}
      {products.length > 0 && (
        <section className="home-page__section">
          <h2 className="home-page__section-title">Today&apos;s Deals</h2>
          <div className="home-page__grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
                onRemove={handleRemoveClick}
                showRemoveButton={true}
              />
            ))}
          </div>
          <div className="home-page__see-more">
            <Link to="/products" className="home-page__see-more-link">
              See all deals
            </Link>
          </div>
        </section>
      )}

      {products.length === 0 && (
        <section className="home-page__section">
          <EmptyState
            title="No products available"
            description="Check back later for new deals."
            action={
              <Link to="/" className="btn btn--primary">
                Browse All Products
              </Link>
            }
          />
        </section>
      )}

      {/* Remove product confirmation modal */}
      <ConfirmationModal
        isOpen={removeModal.open}
        onClose={() => setRemoveModal({ open: false, product: null })}
        onConfirm={handleRemoveConfirm}
        title="Remove Product"
        message={`Are you sure you want to delete "${removeModal.product?.title}"? This action cannot be undone.`}
        confirmText="Delete Product"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}
