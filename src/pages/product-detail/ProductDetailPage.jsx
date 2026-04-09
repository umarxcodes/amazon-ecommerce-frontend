import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  useAppDispatch,
  useSelectedProduct,
  useProductDetailStatus,
  useAddToCart,
  useIsAuthenticated,
  useProducts,
} from '../../hooks'
import { fetchProductById } from '../../features/products/productSlice'
import { addToast } from '../../features/ui/uiSlice'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import Button from '../../components/ui/Button'
import ProductImages from '../../features/products/components/ProductImages'
import ProductInfo from '../../features/products/components/ProductInfo'
import AddToCartBox from '../../features/products/components/AddToCartBox'
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
  const allProducts = useProducts()

  useEffect(() => {
    if (productId) dispatch(fetchProductById(productId))
  }, [dispatch, productId])

  const handleAddToCart = (payload) => {
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
        message: `${payload.title || product?.title} added to cart.`,
        type: 'success',
      })
    )
  }

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
        <div className="product-detail-layout__left">
          <ProductImages product={product} />
        </div>
        <div className="product-detail-layout__center">
          <ProductInfo product={product} />
        </div>
        <div className="product-detail-layout__right">
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
