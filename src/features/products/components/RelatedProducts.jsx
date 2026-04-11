/* ===== RELATED PRODUCTS COMPONENT ===== */
/* Shows similar products in same category */
/* Displayed at bottom of ProductDetailPage */

import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useProducts, useProductStatus } from '../../../hooks'
import { fetchProducts } from '../productSlice'
import StarRating from '../../../components/shared/StarRating'
import SkeletonCard from '../../../components/shared/SkeletonCard'
import './RelatedProducts.css'

export default function RelatedProducts({ currentProductId, category }) {
  const dispatch = useAppDispatch()
  const allProducts = useProducts()
  const status = useProductStatus()

  useEffect(() => {
    if (status === 'idle' && !allProducts.length) {
      dispatch(fetchProducts({ limit: 50 }))
    }
  }, [dispatch, status, allProducts.length])

  const related = useMemo(
    () =>
      allProducts.filter(
        (p) => p._id !== currentProductId && p.category === category
      ),
    [allProducts, currentProductId, category]
  )

  if (status === 'loading') {
    return (
      <section className="related-products">
        <h2 className="related-products__title">Customers also viewed</h2>
        <div className="related-products__scroll">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    )
  }

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
              src={p.image ?? 'https://placehold.co/200x200'}
              alt={p.title ?? 'Product'}
              loading="lazy"
              width="200"
              height="200"
            />
            <h3 className="related-products__card-title">{p.title}</h3>
            <StarRating rating={p.rating} />
            <strong className="related-products__card-price">
              ${(p.salePrice ?? p.price ?? 0).toFixed(2)}
            </strong>
          </Link>
        ))}
      </div>
    </section>
  )
}
