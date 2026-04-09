import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  useAppDispatch,
  useProducts,
  useProductStatus,
  useProductTotal,
  useProductPages,
  useAddToCart,
  useIsAuthenticated,
} from '../../hooks'
import { fetchProducts, setProductFilters } from '../../features/products/productSlice'
import { addToast } from '../../features/ui/uiSlice'
import ProductCard from '../../features/products/components/ProductCard'
import SkeletonCard from '../../components/ui/SkeletonCard'
import EmptyState from '../../components/ui/EmptyState'
import Button from '../../components/ui/Button'
import './ProductsPage.css'

const CATEGORIES = [
  'All',
  'Electronics',
  'Computers',
  'Gaming',
  'Clothing',
  'Home & Kitchen',
  'Books',
  'Beauty',
  'Sports',
  'Toys',
]
const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Avg. Review' },
]

export default function ProductsPage() {
  const dispatch = useAppDispatch()
  const products = useProducts()
  const status = useProductStatus()
  const total = useProductTotal()
  const pages = useProductPages()
  const addToCart = useAddToCart()
  const isAuthenticated = useIsAuthenticated()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(
    searchParams.get('search') || ''
  )

  const filters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    sortBy: searchParams.get('sortBy') || 'featured',
    page: Number(searchParams.get('page')) || 1,
    limit: 12,
  }

  useEffect(() => {
    dispatch(fetchProducts(filters))
  }, [dispatch, JSON.stringify(filters)])

  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput !== filters.search) {
        const p = new URLSearchParams(searchParams)
        if (searchInput) p.set('search', searchInput)
        else p.delete('search')
        p.set('page', '1')
        setSearchParams(p)
      }
    }, 300)
    return () => clearTimeout(t)
  }, [searchInput])

  const changeFilter = useCallback(
    (f) => {
      const p = new URLSearchParams(searchParams)
      Object.entries(f).forEach(([k, v]) => {
        if (v && v !== 'all') p.set(k, String(v))
        else p.delete(k)
      })
      p.set('page', '1')
      setSearchParams(p)
    },
    [searchParams, setSearchParams]
  )

  const handleAddToCart = (product) => {
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
    addToCart({ productId: product._id, quantity: 1 })
    dispatch(
      addToast({
        title: 'Added',
        message: `${product.title} added to cart.`,
        type: 'success',
      })
    )
  }

  if (status === 'loading' && !products.length) {
    return (
      <div className="products-page">
        <div className="products-page__grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="products-page">
      <aside className="products-page__sidebar">
        <div className="products-page__filter-group">
          <h3>Department</h3>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`products-page__filter-btn ${filters.category === c.toLowerCase() ? 'products-page__filter-btn--active' : ''}`}
              onClick={() => changeFilter({ category: c.toLowerCase() })}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="products-page__filter-group">
          <h3>Sort by</h3>
          <select
            value={filters.sortBy}
            onChange={(e) => changeFilter({ sortBy: e.target.value })}
            className="products-page__select"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="products-page__clear"
          onClick={() => setSearchParams({})}
        >
          Clear filters
        </button>
      </aside>

      <main className="products-page__main">
        <div className="products-page__header">
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="products-page__search"
          />
          <span className="products-page__count">{total} results</span>
        </div>

        {products.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Try adjusting your filters."
            action={
              <Button variant="primary" onClick={() => setSearchParams({})}>
                Clear all
              </Button>
            }
          />
        ) : (
          <>
            <div className="products-page__grid">
              {products.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
            <div className="products-page__pagination">
              {Array.from({ length: pages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  type="button"
                  className={`products-page__page-btn ${filters.page === pg ? 'products-page__page-btn--active' : ''}`}
                  onClick={() => changeFilter({ page: pg })}
                >
                  {pg}
                </button>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
