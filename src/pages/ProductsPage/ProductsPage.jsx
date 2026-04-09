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
} from '../../hooks'
import {
  fetchProducts,
  setProductFilters,
} from '../../features/products/productSlice'
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
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(
    searchParams.get('search') || ''
  )

  const filters = useMemo(
    () => ({
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || 'all',
      sortBy: searchParams.get('sortBy') || 'featured',
      page: Number(searchParams.get('page')) || 1,
      limit: 12,
    }),
    [searchParams]
  )

  useEffect(() => {
    dispatch(fetchProducts(filters))
  }, [dispatch, JSON.stringify(filters)])

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
        if (value && value !== 'all') params.set(key, String(value))
        else params.delete(key)
      })
      params.set('page', '1')
      setSearchParams(params)
    },
    [searchParams, setSearchParams]
  )

  const handleAddToCart = useCallback(
    (product) => {
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
    },
    [dispatch, isAuthenticated, addToCart]
  )

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
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {pages > 1 && (
              <div className="products-page__pagination">
                {Array.from({ length: pages }, (_, index) => index + 1).map(
                  (pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      className={`products-page__page-btn ${
                        filters.page === pageNumber
                          ? 'products-page__page-btn--active'
                          : ''
                      }`}
                      onClick={() => changeFilter({ page: pageNumber })}
                    >
                      {pageNumber}
                    </button>
                  )
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
