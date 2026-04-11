/* ===== PRODUCTS CATALOG PAGE ===== */
/* Displays products with search, filtering, sorting, and pagination */
/* URL-driven state (query params for filters) */

import { useCallback, useEffect, useState, useMemo } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import {
  useAppDispatch,
  useProducts,
  useProductStatus,
  useProductTotal,
  useProductPages,
  useAddToCart,
  useIsAuthenticated,
  useFetchProducts,
} from '../../hooks'
import { addToast } from '../../features/ui/uiSlice'
import ProductCard from '../../features/products/components/ProductCard'
import SkeletonCard from '../../components/shared/SkeletonCard'
import EmptyState from '../../components/shared/EmptyState'
import Button from '../../components/shared/Button'
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

const SKELETON_COUNT = 8

export default function ProductsPage() {
  const dispatch = useAppDispatch()
  const products = useProducts()
  const status = useProductStatus()
  const total = useProductTotal()
  const pages = useProductPages()
  const addToCart = useAddToCart()
  const isAuthenticated = useIsAuthenticated()
  const fetchProducts = useFetchProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const [searchInput, setSearchInput] = useState(
    searchParams.get('search') ?? ''
  )

  const filters = useMemo(
    () => ({
      search: searchParams.get('search') ?? '',
      category: searchParams.get('category') ?? 'all',
      sortBy: searchParams.get('sortBy') ?? 'featured',
      minPrice: searchParams.get('minPrice') ?? '',
      maxPrice: searchParams.get('maxPrice') ?? '',
      rating: searchParams.get('rating') ?? '',
      page: Number(searchParams.get('page')) || 1,
      limit: 12,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams.toString()]
  )

  useEffect(() => {
    dispatch(fetchProducts(filters))
  }, [dispatch, filters, fetchProducts])

  // Track the current products URL (with filters) for the ProductDetailPage back button
  useEffect(() => {
    sessionStorage.setItem(
      'lastProductsUrl',
      location.pathname + location.search
    )
  }, [location])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        const params = new URLSearchParams(searchParams)
        if (searchInput) params.set('search', searchInput)
        else params.delete('search')
        params.set('page', '1')
        setSearchParams(params)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput, filters.search, searchParams, setSearchParams])

  const changeFilter = useCallback(
    (newFilters) => {
      const params = new URLSearchParams(searchParams)
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value !== 'all' && value !== '') {
          params.set(key, String(value))
        } else {
          params.delete(key)
        }
      })
      params.set('page', '1')
      setSearchParams(params)
    },
    [searchParams, setSearchParams]
  )

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
        return
      }
      // Payload may be a product object or a normalized { productId, title, quantity }
      const productId = payload.productId ?? payload._id
      const productTitle = payload.title ?? payload.title ?? 'Product'
      const result = await addToCart({
        productId,
        quantity: payload.quantity ?? 1,
      })
      if (addToCart.fulfilled.match(result)) {
        dispatch(
          addToast({
            title: 'Added',
            message: `${productTitle} added to cart.`,
            type: 'success',
          })
        )
      } else {
        dispatch(
          addToast({
            title: 'Failed to add',
            message: result.payload ?? 'Could not add product to cart.',
            type: 'error',
          })
        )
      }
    },
    [dispatch, isAuthenticated, addToCart]
  )

  const handlePageChange = useCallback(
    (page) => {
      const params = new URLSearchParams(searchParams)
      params.set('page', String(page))
      setSearchParams(params)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [searchParams, setSearchParams]
  )

  const renderPagination = () => {
    if (pages <= 1) return null
    const currentPage = filters.page
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(pages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (currentPage - delta > 2) rangeWithDots.push(1, '...')
    else rangeWithDots.push(1)

    rangeWithDots.push(...range)

    if (currentPage + delta < pages - 1) rangeWithDots.push('...', pages)
    else if (pages > 1) rangeWithDots.push(pages)

    return (
      <div className="products-page__pagination">
        {currentPage > 1 && (
          <button
            type="button"
            className="products-page__page-btn"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ‹ Prev
          </button>
        )}
        {rangeWithDots.map((item, idx) =>
          typeof item === 'string' ? (
            <span key={`dots-${idx}`} className="products-page__page-ellipsis">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={`products-page__page-btn ${
                currentPage === item ? 'products-page__page-btn--active' : ''
              }`}
              onClick={() => handlePageChange(item)}
            >
              {item}
            </button>
          )
        )}
        {currentPage < pages && (
          <button
            type="button"
            className="products-page__page-btn"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next ›
          </button>
        )}
      </div>
    )
  }

  if (status === 'loading' && !products.length) {
    return (
      <div className="products-page">
        <div className="products-page__grid">
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <SkeletonCard key={index} />
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
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              className={`products-page__filter-btn ${
                filters.category === category.toLowerCase()
                  ? 'products-page__filter-btn--active'
                  : ''
              }`}
              onClick={() => changeFilter({ category: category.toLowerCase() })}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="products-page__filter-group">
          <h3>Price Range</h3>
          <div className="products-page__price-inputs">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => changeFilter({ minPrice: e.target.value })}
              className="products-page__price-input"
              min="0"
              aria-label="Minimum price"
            />
            <span>—</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => changeFilter({ maxPrice: e.target.value })}
              className="products-page__price-input"
              min="0"
              aria-label="Maximum price"
            />
          </div>
        </div>

        <div className="products-page__filter-group">
          <h3>Customer Rating</h3>
          {[4, 3, 2, 1].map((stars) => (
            <button
              key={stars}
              type="button"
              className={`products-page__filter-btn ${
                filters.rating === String(stars)
                  ? 'products-page__filter-btn--active'
                  : ''
              }`}
              onClick={() =>
                changeFilter({
                  rating: filters.rating === String(stars) ? '' : String(stars),
                })
              }
            >
              {'★'.repeat(stars)}
              {'☆'.repeat(4 - stars)}
              {' & Up'}
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
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
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
            aria-label="Search products"
          />
          <span className="products-page__count">
            {total} result{total !== 1 ? 's' : ''}
          </span>
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
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
            {renderPagination()}
          </>
        )}
      </main>
    </div>
  )
}
