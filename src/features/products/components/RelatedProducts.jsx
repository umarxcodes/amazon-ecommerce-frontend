import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../productSlice'
import {
  useAppDispatch,
  useProducts,
  useProductStatus,
} from '../../../hooks/customHooks'
import { formatCurrency } from '../../../utils/helpers'

export default function RelatedProducts({ currentProductId, category }) {
  const dispatch = useAppDispatch()
  const allProducts = useProducts()
  const status = useProductStatus()

  useEffect(() => {
    if (status === 'idle' && !allProducts.length) {
      dispatch(fetchProducts())
    }
  }, [dispatch, status, allProducts.length])

  const related = allProducts.filter(
    (p) => p._id !== currentProductId && p.category === category
  )

  if (!related.length) return null

  return (
    <section className="pdp-related">
      <h2 className="pdp-related__title">Customers also viewed</h2>
      <div className="pdp-related__scroll">
        {related.map((product) => (
          <Link
            key={product._id}
            to={`/products/${product._id}`}
            className="pdp-related__card"
          >
            <img src={product.image} alt={product.title} loading="lazy" />
            <div className="pdp-related__card-body">
              <h3 className="pdp-related__card-title">{product.title}</h3>
              <div className="pdp-related__card-rating">
                <span>{'★'.repeat(Math.round(product.rating || 0))}</span>
                <span>{(product.reviewsCount || 0).toLocaleString()}</span>
              </div>
              <strong className="pdp-related__card-price">
                {formatCurrency(product.salePrice || product.price)}
              </strong>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
