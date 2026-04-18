/* ===== PRODUCT DETAIL PAGE ===== */
/* Displays full product information, images, and purchase options */
/* Includes related products section, handles 400/404 errors */

import { useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  useAppDispatch,
  useSelectedProduct,
  useProductDetailStatus,
  useProductError,
  useAddToCart,
  useIsAuthenticated,
  useFetchProductById,
} from '../../hooks'
import { resetSelectedProduct } from '../../features/products/productSlice'
import { addToast } from '../../features/ui/uiSlice'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import EmptyState from '../../components/shared/EmptyState'
import Button from '../../components/shared/Button'
import ProductImages from '../../features/products/components/ProductImages'
import ProductInfo from '../../features/products/components/ProductInfo'
import AddToCartBox from '../../features/products/components/AddToCartBox'
import ProductTabs from '../../features/products/components/ProductTabs'
import RelatedProducts from '../../features/products/components/RelatedProducts'
import './ProductDetailPage.css'

export default function ProductDetailPage() {
  const { productId } = useParams()
  const dispatch = useAppDispatch()
  const product = useSelectedProduct()
  const status = useProductDetailStatus()
  const error = useProductError()
  const addToCart = useAddToCart()
  const isAuthenticated = useIsAuthenticated()
  const navigate = useNavigate()
  const location = useLocation()
  const fetchProductById = useFetchProductById()

  // Store the current products URL (with filters) in sessionStorage so "Back" preserves them
  useEffect(() => {
    if (location.pathname.startsWith('/') && location.search) {
      sessionStorage.setItem(
        'lastProductsUrl',
        location.pathname + location.search
      )
    }
  }, [location])

  const backToProductsUrl = useMemo(() => {
    return sessionStorage.getItem('lastProductsUrl') || '/'
  }, [])

  const productTitle = product?.title ?? product?.name ?? 'Product'

  useEffect(() => {
    if (productId) {
      dispatch(resetSelectedProduct())
      fetchProductById(productId)
    }
  }, [dispatch, productId, fetchProductById])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(resetSelectedProduct())
    }
  }, [dispatch])

  const handleAddToCart = useCallback(
    async (payload) => {
      if (!isAuthenticated) {
        dispatch(
          addToast({
            title: 'Sign in required',
            message: 'Please sign in to add items to cart.',
            type: 'info',
          })
        )
        return false
      }
      const result = await addToCart(payload)
      if (addToCart.fulfilled.match(result)) {
        dispatch(
          addToast({
            title: 'Added',
            message: `${productTitle} added to cart.`,
            type: 'success',
          })
        )
        return true
      } else {
        dispatch(
          addToast({
            title: 'Failed to add',
            message: result.payload ?? 'Could not add product to cart.',
            type: 'error',
          })
        )
        return false
      }
    },
    [dispatch, isAuthenticated, addToCart, productTitle]
  )

  if (!productId) {
    return (
      <EmptyState
        title="Invalid product ID"
        description="The product ID is not valid."
        action={
          <Button variant="primary" onClick={() => navigate('/')}>
            Browse Products
          </Button>
        }
      />
    )
  }

  if (status === 'loading')
    return <LoadingSpinner label="Loading product..." fullScreen />

  // Handle 400/404 errors
  if (status === 'failed') {
    const isNotFound =
      error?.toLowerCase().includes('not found') ||
      error?.toLowerCase().includes('invalid') ||
      error?.toLowerCase().includes('bad request')

    return (
      <EmptyState
        title={isNotFound ? 'Product not found' : 'Error loading product'}
        description={
          isNotFound
            ? "We couldn't find this product. It may have been removed or doesn't exist."
            : (error ?? 'An unexpected error occurred.')
        }
        action={
          <Button variant="primary" onClick={() => navigate('/')}>
            Browse Products
          </Button>
        }
      />
    )
  }

  if (!product && status === 'succeeded') {
    return (
      <EmptyState
        title="Product not found"
        description="We couldn't find this product."
        action={
          <Button variant="primary" onClick={() => navigate('/')}>
            Browse Products
          </Button>
        }
      />
    )
  }

  return (
    <div className="product-detail-page">
      {/* Breadcrumb + Back button */}
      <nav className="product-detail-page__breadcrumb">
        <button
          type="button"
          className="product-detail-page__back-btn"
          onClick={() => navigate(backToProductsUrl)}
        >
          ← Back to Products
        </button>
        <span className="product-detail-page__breadcrumb-sep">›</span>
        <a href="/" className="product-detail-page__breadcrumb-link">
          Home
        </a>
        <span className="product-detail-page__breadcrumb-sep">›</span>
        <button
          type="button"
          className="product-detail-page__breadcrumb-link"
          onClick={() => navigate(backToProductsUrl)}
        >
          Products
        </button>
        {product?.category && (
          <>
            <span className="product-detail-page__breadcrumb-sep">›</span>
            <button
              type="button"
              className="product-detail-page__breadcrumb-link"
              onClick={() =>
                navigate(`/?category=${encodeURIComponent(product.category)}`)
              }
            >
              {product.category}
            </button>
          </>
        )}
        <span className="product-detail-page__breadcrumb-sep">›</span>
        <span className="product-detail-page__breadcrumb-current">
          {productTitle}
        </span>
      </nav>

      <div className="product-detail-layout">
        <div className="product-detail-layout__gallery">
          <ProductImages product={product} />
        </div>

        <div className="product-detail-layout__info">
          <ProductInfo product={product} />
          <ProductTabs product={product} />
        </div>

        <div className="product-detail-layout__buybox">
          <AddToCartBox product={product} onAddToCart={handleAddToCart} />
        </div>
      </div>

      {product?.category && (
        <RelatedProducts
          currentProductId={product._id}
          category={product.category}
        />
      )}
    </div>
  )
}
