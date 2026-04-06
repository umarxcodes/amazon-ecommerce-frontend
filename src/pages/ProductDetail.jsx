import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import EmptyState from '../components/UI/EmptyState'
import { fetchProductById, resetSelectedProduct } from '../features/products/productSlice'
import { addToCart } from '../features/cart/cartSlice'
import { addToast } from '../features/ui/uiSlice'
import { formatCurrency } from '../utils/helpers'
import Button from '../components/UI/Button'

export default function ProductDetail() {
  const { productId } = useParams()
  const dispatch = useAppDispatch()
  const { selectedProduct, detailStatus, error } = useAppSelector((state) => state.products)

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

  if (!selectedProduct) {
    return null
  }

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: selectedProduct._id,
        title: selectedProduct.title,
        image: selectedProduct.image,
        category: selectedProduct.category,
        price: selectedProduct.salePrice || selectedProduct.price,
        quantity: 1,
      })
    )
    dispatch(
      addToast({
        title: 'Added to cart',
        message: `${selectedProduct.title} is ready for checkout.`,
        type: 'success',
      })
    )
  }

  return (
    <div className="container detail-layout">
      <div className="detail-media">
        <img src={selectedProduct.image} alt={selectedProduct.title} />
      </div>

      <div className="detail-content">
        <div className="detail-breadcrumbs">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>{selectedProduct.category}</span>
        </div>
        <span className="chip">{selectedProduct.category}</span>
        <h1>{selectedProduct.title}</h1>
        <p className="detail-brand">{selectedProduct.brand}</p>

        <div className="rating-row">
          <span>{"★".repeat(Math.round(selectedProduct.rating || 0))}</span>
          <span>{Number(selectedProduct.rating || 0).toFixed(1)} / 5</span>
          <span>{selectedProduct.reviewsCount} reviews</span>
        </div>

        <div className="price-row detail-price">
          <strong>{formatCurrency(selectedProduct.salePrice || selectedProduct.price)}</strong>
          {selectedProduct.salePrice ? <span>{formatCurrency(selectedProduct.price)}</span> : null}
        </div>

        <p>{selectedProduct.description}</p>

        <div className="detail-highlights">
          <div>
            <strong>Fast dispatch</strong>
            <span>Usually ships within 24 hours</span>
          </div>
          <div>
            <strong>Easy returns</strong>
            <span>30-day returns on eligible orders</span>
          </div>
          <div>
            <strong>Secure checkout</strong>
            <span>Protected payment handoff via Stripe</span>
          </div>
        </div>

        <div className="detail-actions">
          <Button type="button" onClick={handleAddToCart}>
            Add to cart
          </Button>
          <Button as={Link} to="/cart" variant="ghost">
            View cart
          </Button>
          <div className="inventory-pill">{selectedProduct.stock} left in stock</div>
        </div>
      </div>
    </div>
  )
}
