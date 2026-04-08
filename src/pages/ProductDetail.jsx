import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  useAppDispatch,
  useSelectedProduct,
  useProductDetailStatus,
  useProductError,
} from '../hooks/customHooks'
import {
  fetchProductById,
  resetSelectedProduct,
} from '../features/products/productSlice'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import EmptyState from '../components/UI/EmptyState'
import ProductImages from '../features/products/components/ProductImages'
import ProductInfo from '../features/products/components/ProductInfo'
import AddToCartBox from '../features/products/components/AddToCartBox'
import RelatedProducts from '../features/products/components/RelatedProducts'

export default function ProductDetail() {
  const { productId } = useParams()
  const dispatch = useAppDispatch()
  const selectedProduct = useSelectedProduct()
  const detailStatus = useProductDetailStatus()
  const error = useProductError()

  useEffect(() => {
    dispatch(fetchProductById(productId))
    return () => dispatch(resetSelectedProduct())
  }, [dispatch, productId])

  if (detailStatus === 'loading') {
    return <LoadingSpinner label="Loading product details..." />
  }

  if (detailStatus === 'failed') {
    return <EmptyState title="Product unavailable" description={error} />
  }

  if (!selectedProduct) return null

  return (
    <div className="container pdp-page">
      <div className="pdp-grid">
        <ProductImages product={selectedProduct} />
        <ProductInfo product={selectedProduct} />
        <AddToCartBox product={selectedProduct} />
      </div>

      <RelatedProducts
        currentProductId={selectedProduct._id}
        category={selectedProduct.category}
      />
    </div>
  )
}
