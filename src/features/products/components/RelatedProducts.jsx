import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  useAppDispatch,
  useProducts,
  useProductStatus,
} from '../../../hooks'
import { fetchProducts } from '../productSlice'
import { formatCurrency } from '../../../utils/helpers'
import StarRating from '../../../components/ui/StarRating'
import './RelatedProducts.css'

export default function RelatedProducts({ currentProductId, category }) {
  const dispatch = useAppDispatch()
  const allProducts = useProducts()
  const status = useProductStatus()

  useEffect(() => {
    if (status === 'idle' && !allProducts.length) dispatch(fetchProducts())
  }, [dispatch, status, allProducts.length])

  const related = allProducts.filter(
    (p) => p._id !== currentProductId && p.category === category
  )
  if (!related.length) return null

  return (
    <section className="related-products">
      <h2 className="related-products__title">Customers also viewed</h2>
      <div className="related-products__scroll">
        {related.map((p) => (
          <Link
            key={p._id}
            to={`/products/${p._id}`}
            className="related-products__card"
          >
            <img
              src={p.image || 'https://placehold.co/200x200'}
              alt={p.title}
              loading="lazy"
            />
            <h3 className="related-products__card-title">{p.title}</h3>
            <StarRating rating={p.rating} />
            <strong className="related-products__card-price">
              {formatCurrency(p.salePrice || p.price)}
            </strong>
          </Link>
        ))}
      </div>
    </section>
  )
}
