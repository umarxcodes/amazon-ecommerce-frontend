/* ===== PRODUCT DETAIL PAGE ===== */
/* Displays full product information, images, and purchase options */
/* Includes related products section */

import { useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  useAppDispatch,
  useSelectedProduct,
  useProductDetailStatus,
  useAddToCart,
  useIsAuthenticated,
  useFetchProductById,
} from '../../hooks'
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
  const addToCart = useAddToCart()
  const isAuthenticated = useIsAuthenticated()
  const navigate = useNavigate()
  const fetchProductById = useFetchProductById()

  useEffect(() => {
    if (productId) fetchProductById(productId)
  }, [dispatch, productId, fetchProductById])

  const handleAddToCart = useCallback(
    (payload) => {
      if (!isAuthenticated) {
        dispatch(
          addToast({
            title: 'Sign in required',
            message: 'Please sign in first.',
            type: 'info',
          })
        )
        return
      }
      addToCart(payload)
      dispatch(
        addToast({
          title: 'Added',
          message: `${product?.title ?? 'Product'} added to cart.`,
          type: 'success',
        })
      )
    },
    [dispatch, isAuthenticated, addToCart, product?.title]
  )

  if (!productId) return null
  if (status === 'loading')
    return <LoadingSpinner label="Loading product..." fullScreen />
  if (status === 'failed' || !product)
    return (
      <EmptyState
        title="Product not found"
        description="We couldn't find this product."
        action={
          <Button variant="primary" onClick={() => navigate('/products')}>
            Browse Products
          </Button>
        }
      />
    )

  return (
    <div className="product-detail-page">
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

      {product.category && (
        <RelatedProducts
          currentProductId={product._id}
          category={product.category}
        />
      )}
    </div>
  )
}
