/* ===== GAMING PRODUCTS PAGE ===== */
/* Displays gaming products with gaming-specific filters and styling */

import { useCallback, useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
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
import './GamingPage.css'

const GAMING_CATEGORIES = [
  { value: 'all', label: 'All Gaming' },
  { value: 'gaming-consoles', label: 'Gaming Consoles' },
  { value: 'gaming-pcs', label: 'Gaming PCs' },
  { value: 'video-games', label: 'Video Games' },
  { value: 'gaming-accessories', label: 'Gaming Accessories' },
  { value: 'gaming-chairs', label: 'Gaming Chairs' },
  { value: 'vr-gaming', label: 'VR Gaming' },
]

const PLATFORMS = [
  'All',
  'PC',
  'PlayStation',
  'Xbox',
  'Nintendo',
  'Mobile',
  'VR',
]

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Avg. Review' },
]

const SKELETON_COUNT = 8

export default function GamingPage() {
  const dispatch = useAppDispatch()
  const products = useProducts()
  const status = useProductStatus()
  const total = useProductTotal()
  const pages = useProductPages()
  const addToCart = useAddToCart()
  const isAuthenticated = useIsAuthenticated()
  const fetchProducts = useFetchProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(
    searchParams.get('search') ?? ''
  )

  // Sync searchInput when URL changes (e.g., from Header navigation)
  useEffect(() => {
    const urlSearch = searchParams.get('search') ?? ''
    setSearchInput(urlSearch)
  }, [searchParams])

  const filters = useMemo(
    () => ({
      search: searchParams.get('search') ?? '',
      category: searchParams.get('category') ?? 'gaming',
      subcategory: searchParams.get('subcategory') ?? 'all',
      platform: searchParams.get('platform') ?? 'all',
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
    async (product) => {
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
      const result = await addToCart({ productId: product._id, quantity: 1 })
      if (addToCart.fulfilled.match(result)) {
        dispatch(
          addToast({
            title: 'Added to Cart',
            message: `${product.title ?? 'Product'} added to cart.`,
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
      <div className="gaming-page__pagination">
        {currentPage > 1 && (
          <button
            type="button"
            className="gaming-page__page-btn"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ‹ Prev
          </button>
        )}
        {rangeWithDots.map((item, idx) =>
          typeof item === 'string' ? (
            <span key={`dots-${idx}`} className="gaming-page__page-ellipsis">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={`gaming-page__page-btn ${
                currentPage === item ? 'gaming-page__page-btn--active' : ''
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
            className="gaming-page__page-btn"
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
      <div className="gaming-page">
        <div className="gaming-page__header-section">
          <h1 className="gaming-page__title">🎮 Gaming Store</h1>
        </div>
        <div className="gaming-page__content">
          <div className="gaming-page__grid">
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="gaming-page">
      <div className="gaming-page__header-section">
        <h1 className="gaming-page__title">🎮 Gaming Store</h1>
        <p className="gaming-page__subtitle">
          Level up your game with the latest gaming gear
        </p>
      </div>

      <div className="gaming-page__content">
        <aside className="gaming-page__sidebar">
          <div className="gaming-page__filter-group">
            <h3>Gaming Category</h3>
            {GAMING_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                className={`gaming-page__filter-btn ${
                  filters.subcategory === cat.value
                    ? 'gaming-page__filter-btn--active'
                    : ''
                }`}
                onClick={() => changeFilter({ subcategory: cat.value })}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="gaming-page__filter-group">
            <h3>Platform</h3>
            {PLATFORMS.map((platform) => (
              <button
                key={platform}
                type="button"
                className={`gaming-page__filter-btn ${
                  filters.platform === platform.toLowerCase()
                    ? 'gaming-page__filter-btn--active'
                    : ''
                }`}
                onClick={() =>
                  changeFilter({
                    platform:
                      filters.platform === platform.toLowerCase()
                        ? 'all'
                        : platform.toLowerCase(),
                  })
                }
              >
                {platform}
              </button>
            ))}
          </div>

          <div className="gaming-page__filter-group">
            <h3>Price Range</h3>
            <div className="gaming-page__price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => changeFilter({ minPrice: e.target.value })}
                className="gaming-page__price-input"
                min="0"
                aria-label="Minimum price"
              />
              <span>—</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => changeFilter({ maxPrice: e.target.value })}
                className="gaming-page__price-input"
                min="0"
                aria-label="Maximum price"
              />
            </div>
          </div>

          <div className="gaming-page__filter-group">
            <h3>Customer Rating</h3>
            {[4, 3, 2, 1].map((stars) => (
              <button
                key={stars}
                type="button"
                className={`gaming-page__filter-btn ${
                  filters.rating === String(stars)
                    ? 'gaming-page__filter-btn--active'
                    : ''
                }`}
                onClick={() =>
                  changeFilter({
                    rating:
                      filters.rating === String(stars) ? '' : String(stars),
                  })
                }
              >
                {'★'.repeat(stars)}
                {'☆'.repeat(4 - stars)}
                {' & Up'}
              </button>
            ))}
          </div>

          <div className="gaming-page__filter-group">
            <h3>Sort by</h3>
            <select
              value={filters.sortBy}
              onChange={(e) => changeFilter({ sortBy: e.target.value })}
              className="gaming-page__select"
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
            className="gaming-page__clear"
            onClick={() => setSearchParams({ category: 'gaming' })}
          >
            Clear filters
          </button>
        </aside>

        <main className="gaming-page__main">
          <div className="gaming-page__header">
            <input
              type="text"
              placeholder="Search gaming products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="gaming-page__search"
              aria-label="Search gaming products"
            />
            <span className="gaming-page__count">
              {total} result{total !== 1 ? 's' : ''}
            </span>
          </div>

          {products.length === 0 ? (
            <EmptyState
              title="No gaming products found"
              description="Try adjusting your filters to find more gaming gear."
              action={
                <Button
                  variant="primary"
                  onClick={() => setSearchParams({ category: 'gaming' })}
                >
                  Clear all
                </Button>
              }
            />
          ) : (
            <>
              <div className="gaming-page__grid">
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
    </div>
  )
}
