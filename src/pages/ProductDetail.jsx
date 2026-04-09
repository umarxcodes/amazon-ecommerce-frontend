import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams, useParams, useNavigate } from 'react-router-dom'
import {
  useAppDispatch,
  useProducts,
  useProductStatus,
  useProductTotal,
  useProductPages,
  useSelectedProduct,
  useProductDetailStatus,
  useAddToCart,
  useIsAuthenticated,
} from '../hooks/customHooks'
import {
  fetchProducts,
  fetchProductById,
} from '../features/products/productSlice'
import { addToast } from '../features/ui/uiSlice'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import EmptyState from '../components/UI/EmptyState'
import SkeletonCard from '../components/UI/SkeletonCard'
import Pagination from '../components/UI/Pagination'
import { formatCurrency } from '../utils/helpers'
import './ProductDetail.css'

const CATEGORIES = [
  'All',
  'Electronics',
  'Computers',
  'Gaming',
  'Office Products',
  'Clothing',
  'Home & Kitchen',
  'Books',
  'Toys',
  'Sports',
  'Beauty',
]

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Avg. Customer Review' },
  { value: 'newest', label: 'Newest Arrivals' },
]

// ─── Single Product Detail View ──────────────────────────────────────────────

function SingleProductView({ product, onAddToCart }) {
  const [imgError, setImgError] = useState(false)
  if (!product) return null

  const stars = Math.round(product.rating || 0)
  const stock = product.stock ?? 0

  return (
    <div className="single-product-page">
      <div className="single-product-container">
        <div className="single-product__image">
          <img
            src={
              imgError
                ? '/placeholder-product.png'
                : product.image || '/placeholder-product.png'
            }
            alt={product.name || product.title}
            onError={() => setImgError(true)}
          />
        </div>
        <div className="single-product__info">
          <h1 className="single-product__title">
            {product.name || product.title}
          </h1>
          <div className="single-product__rating">
            <span style={{ color: '#FF9900', fontSize: 16 }}>
              {'★'.repeat(stars)}
              {'☆'.repeat(5 - stars)}
            </span>
            <span className="single-product__rating-count">
              ({(product.reviewsCount || 0).toLocaleString()} ratings)
            </span>
          </div>
          <div className="single-product__price">
            <span className="single-product__price-symbol">$</span>
            <span className="single-product__price-whole">
              {product.price ? Number(product.price).toFixed(2) : '0.00'}
            </span>
          </div>
          <div className="single-product__description">
            <h3>About this item</h3>
            <p>{product.description || 'No description available.'}</p>
          </div>
          {stock > 0 && stock < 5 && (
            <span className="single-product__stock">
              Only {stock} left in stock
            </span>
          )}
          {stock === 0 && (
            <span className="single-product__outofstock">
              Currently unavailable
            </span>
          )}
          {stock >= 5 && (
            <span
              className="single-product__in-stock"
              style={{ color: '#007600' }}
            >
              In Stock
            </span>
          )}
          {product.prime && (
            <span className="single-product__prime">✓ prime</span>
          )}
          <button
            type="button"
            className="single-product__add-btn"
            onClick={() => onAddToCart(product)}
            disabled={stock === 0}
          >
            Add to Cart
          </button>
          <div className="single-product__details">
            <p>
              <strong>Category:</strong> {product.category || 'N/A'}
            </p>
            {product.brand && (
              <p>
                <strong>Brand:</strong> {product.brand}
              </p>
            )}
          </div>
        </div>
        <div className="single-product__buybox">
          <div className="single-product__buybox-price">
            <span className="single-product__price-symbol">$</span>
            <span className="single-product__price-whole">
              {product.price ? Number(product.price).toFixed(2) : '0.00'}
            </span>
          </div>
          {stock > 0 ? (
            <p style={{ color: '#007600', fontSize: 14 }}>In Stock</p>
          ) : (
            <p style={{ color: '#B12704', fontSize: 14 }}>
              Currently unavailable
            </p>
          )}
          <button
            type="button"
            className="single-product__buybox-btn"
            onClick={() => onAddToCart(product)}
            disabled={stock === 0}
          >
            Add to Cart
          </button>
          <p style={{ fontSize: 12, color: '#565959', marginTop: 8 }}>
            Ships from and sold by Amazon.com
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Product Listing Components ──────────────────────────────────────────────

function StarRating({ rating, count }) {
  const stars = Math.round(rating || 0)
  return (
    <div className="product-card__rating">
      <span className="product-card__stars" style={{ color: '#FF9900' }}>
        {'★'.repeat(stars)}
        {'☆'.repeat(5 - stars)}
      </span>
      <span className="product-card__rating-count">
        ({(count || 0).toLocaleString()})
      </span>
    </div>
  )
}

function ProductCard({ product, onAddToCart }) {
  const [imgError, setImgError] = useState(false)
  return (
    <div className="product-card">
      <Link
        to={`/products/${product._id}`}
        className="product-card__image-link"
      >
        <div className="product-card__image-wrapper">
          <img
            src={
              imgError
                ? '/placeholder-product.png'
                : product.image || '/placeholder-product.png'
            }
            alt={product.title || product.name}
            className="product-card__image"
            onError={() => setImgError(true)}
          />
        </div>
      </Link>
      {product.sponsored && (
        <span className="product-card__sponsored">Sponsored</span>
      )}
      <Link
        to={`/products/${product._id}`}
        className="product-card__title-link"
      >
        <h3 className="product-card__title">{product.title || product.name}</h3>
      </Link>
      <StarRating rating={product.rating} count={product.reviewsCount} />
      <div className="product-card__price">
        <span className="product-card__price-symbol">$</span>
        <span className="product-card__price-whole">
          {product.price ? Number(product.price).toFixed(2) : '0.00'}
        </span>
      </div>
      {product.prime && (
        <span className="product-card__prime-badge">✓ prime</span>
      )}
      {product.stock !== undefined &&
        product.stock < 5 &&
        product.stock > 0 && (
          <span className="product-card__stock-warning">
            Only {product.stock} left in stock
          </span>
        )}
      {product.stock === 0 && (
        <span className="product-card__out-of-stock">
          Currently unavailable
        </span>
      )}
      <button
        type="button"
        className="product-card__add-btn"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onAddToCart(product)
        }}
        disabled={product.stock === 0}
      >
        Add to Cart
      </button>
    </div>
  )
}

function FilterSidebar({ filters, onFilterChange, onClearFilters }) {
  const [minPrice, setMinPrice] = useState(filters.minPrice || '')
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || '')
  const handlePriceSubmit = () => {
    onFilterChange({
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
    })
  }
  return (
    <aside className="filter-sidebar">
      <div className="filter-section">
        <h3 className="filter-section__title">Department</h3>
        <div
          className={`filter-option ${!filters.category || filters.category === 'All' ? 'filter-option--active' : ''}`}
          onClick={() => onFilterChange({ category: 'All' })}
          role="button"
          tabIndex={0}
        >
          <span>All Departments</span>
        </div>
        {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
          <div
            key={cat}
            className={`filter-option ${filters.category === cat ? 'filter-option--active' : ''}`}
            onClick={() => onFilterChange({ category: cat })}
            role="button"
            tabIndex={0}
          >
            <span>{cat}</span>
          </div>
        ))}
      </div>
      <div className="filter-section">
        <h3 className="filter-section__title">Price</h3>
        <div className="filter-price-inputs">
          <input
            type="number"
            placeholder="$ min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="filter-price-input"
          />
          <span>to</span>
          <input
            type="number"
            placeholder="$ max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="filter-price-input"
          />
        </div>
        <button
          type="button"
          className="filter-price-btn"
          onClick={handlePriceSubmit}
        >
          Go
        </button>
      </div>
      <div className="filter-section">
        <h3 className="filter-section__title">Customer Review</h3>
        {[4, 3, 2, 1].map((s) => (
          <div
            key={s}
            className={`filter-option ${filters.rating === s ? 'filter-option--active' : ''}`}
            onClick={() =>
              onFilterChange({ rating: filters.rating === s ? undefined : s })
            }
            role="button"
            tabIndex={0}
          >
            <span style={{ color: '#FF9900' }}>
              {'★'.repeat(s)}
              {'☆'.repeat(5 - s)}
            </span>
            <span className="filter-option__label">& up</span>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="filter-clear-btn"
        onClick={onClearFilters}
      >
        Clear all filters
      </button>
    </aside>
  )
}

function SortBar({ currentSort, total, onSortChange }) {
  return (
    <div className="sort-bar">
      <span className="sort-bar__results">{total} results</span>
      <div className="sort-bar__sort">
        <label className="sort-bar__label" htmlFor="sort-select">
          Sort by:
        </label>
        <select
          id="sort-select"
          className="sort-bar__select"
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

// ─── Main Component (handles both listing and detail) ─────────────────────────

function ProductListing() {
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
    category: searchParams.get('category') || 'All',
    minPrice: searchParams.get('minPrice') || undefined,
    maxPrice: searchParams.get('maxPrice') || undefined,
    rating: searchParams.get('rating')
      ? Number(searchParams.get('rating'))
      : undefined,
    sort: searchParams.get('sort') || 'featured',
    page: Number(searchParams.get('page')) || 1,
    limit: 16,
  }

  useEffect(() => {
    dispatch(fetchProducts(filters))
  }, [dispatch, JSON.stringify(filters)])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        const newParams = new URLSearchParams(searchParams)
        if (searchInput) newParams.set('search', searchInput)
        else newParams.delete('search')
        newParams.set('page', '1')
        setSearchParams(newParams)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  const handleFilterChange = useCallback(
    (newFilters) => {
      const newParams = new URLSearchParams(searchParams)
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== 'All')
          newParams.set(key, String(value))
        else newParams.delete(key)
      })
      newParams.set('page', '1')
      setSearchParams(newParams)
    },
    [searchParams, setSearchParams]
  )

  const handleClearFilters = useCallback(() => {
    setSearchParams({})
    setSearchInput('')
  }, [setSearchParams])

  const handlePageChange = useCallback(
    (page) => {
      const newParams = new URLSearchParams(searchParams)
      newParams.set('page', String(page))
      setSearchParams(newParams)
    },
    [searchParams, setSearchParams]
  )

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      dispatch(
        addToast({
          title: 'Sign in required',
          message: 'Please sign in to add items to your cart.',
          type: 'info',
        })
      )
      return
    }
    addToCart({ productId: product._id, quantity: 1 })
    dispatch(
      addToast({
        title: 'Added to cart',
        message: `${product.title || product.name} has been added to your cart.`,
        type: 'success',
      })
    )
  }

  if (status === 'loading' && !products.length) {
    return (
      <div className="product-listing-page">
        <div className="product-listing__content">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
          <div className="product-listing__main">
            <div className="product-grid product-grid--skeleton">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'failed' && !products.length) {
    return (
      <div className="product-listing-page">
        <div className="product-listing__content">
          <EmptyState
            title="Unable to load products"
            description="Something went wrong. Please try again later."
            action={
              <button
                className="btn-primary"
                onClick={() => dispatch(fetchProducts(filters))}
              >
                Try Again
              </button>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="product-listing-page">
      <div className="product-listing__content">
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
        <div className="product-listing__main">
          <SortBar
            currentSort={filters.sort}
            total={total}
            onSortChange={(val) => handleFilterChange({ sort: val })}
          />
          <div className="product-search-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="product-search-input"
            />
          </div>
          {products.length === 0 ? (
            <EmptyState
              title="No results found"
              description="Try adjusting your filters or search terms."
              action={
                <button className="btn-primary" onClick={handleClearFilters}>
                  Clear all filters
                </button>
              }
            />
          ) : (
            <>
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
              <Pagination
                currentPage={filters.page}
                totalPages={pages}
                onChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProductDetail() {
  const { productId } = useParams()
  const dispatch = useAppDispatch()
  const product = useSelectedProduct()
  const detailStatus = useProductDetailStatus()
  const addToCart = useAddToCart()
  const isAuthenticated = useIsAuthenticated()
  const navigate = useNavigate()

  useEffect(() => {
    if (productId) dispatch(fetchProductById(productId))
  }, [dispatch, productId])

  const handleAddToCart = (prod) => {
    if (!isAuthenticated) {
      dispatch(
        addToast({
          title: 'Sign in required',
          message: 'Please sign in to add items to your cart.',
          type: 'info',
        })
      )
      return
    }
    addToCart({ productId: prod._id, quantity: 1 })
    dispatch(
      addToast({
        title: 'Added to cart',
        message: `${prod.title || prod.name} has been added to your cart.`,
        type: 'success',
      })
    )
  }

  if (productId) {
    if (detailStatus === 'loading')
      return <LoadingSpinner label="Loading product details..." />
    if (detailStatus === 'failed' || !product) {
      return (
        <EmptyState
          title="Product not found"
          description="We couldn't find the product you're looking for."
          action={
            <button
              className="btn-primary"
              onClick={() => navigate('/products')}
            >
              Browse Products
            </button>
          }
        />
      )
    }
    return <SingleProductView product={product} onAddToCart={handleAddToCart} />
  }

  return <ProductListing />
}
