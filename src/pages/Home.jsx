import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchProducts, setProductFilters } from '../features/products/productSlice'
import ProductCard from '../features/products/components/ProductCard'
import ProductFilters from '../features/products/components/ProductFilters'
import SkeletonCard from '../components/UI/SkeletonCard'
import EmptyState from '../components/UI/EmptyState'
import Pagination from '../components/Shared/Pagination'
import { useDebouncedValue } from '../hooks/customHooks'

export default function Home() {
  const dispatch = useAppDispatch()
  const { items, filters, status, pages, error } = useAppSelector((state) => state.products)
  const [searchInput, setSearchInput] = useState(filters.search)
  const [priceFilter, setPriceFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const debouncedSearch = useDebouncedValue(searchInput, 350)

  useEffect(() => {
    dispatch(setProductFilters({ search: debouncedSearch, page: 1 }))
  }, [debouncedSearch, dispatch])

  useEffect(() => {
    dispatch(fetchProducts(filters))
  }, [dispatch, filters])

  const categories = useMemo(
    () => [...new Set(items.map((product) => product.category).filter(Boolean))],
    [items]
  )

  const visibleProducts = useMemo(() => {
    let result = [...items]

    if (filters.category !== 'all') {
      result = result.filter((product) => product.category === filters.category)
    }

    if (filters.search) {
      const query = filters.search.toLowerCase()
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query)
      )
    }

    if (priceFilter !== 'all') {
      result = result.filter((product) => Number(product.salePrice || product.price) <= Number(priceFilter))
    }

    if (ratingFilter !== 'all') {
      result = result.filter((product) => Number(product.rating || 0) >= Number(ratingFilter))
    }

    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price))
        break
      case 'price-desc':
        result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price))
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      default:
        result.sort((a, b) => Number(b.featured) - Number(a.featured))
    }

    return result
  }, [filters, items, priceFilter, ratingFilter])

  const start = (filters.page - 1) * filters.limit
  const paginatedProducts = visibleProducts.slice(start, start + filters.limit)
  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / filters.limit))

  return (
    <div className="page">
      <section className="hero-section container">
        <div className="hero-copy">
          <span className="eyebrow">Production storefront experience</span>
          <h1>Everyday shopping, elevated with clearer browsing and faster decisions.</h1>
          <p>
            A polished commerce shell with sticky navigation, responsive product discovery,
            reusable components, and checkout flows that feel ready for production.
          </p>
          <div className="hero-actions">
            <button
              className="ui-button ui-button--primary ui-button--md"
              type="button"
              onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Shop top picks
            </button>
            <button
              className="ui-button ui-button--ghost ui-button--md"
              type="button"
              onClick={() => dispatch(setProductFilters({ category: 'all', sortBy: 'rating', page: 1 }))}
            >
              View top rated
            </button>
          </div>
        </div>

        <div className="hero-metrics">
          <div>
            <strong>Fast find</strong>
            <span>Search, category, price, and rating controls</span>
          </div>
          <div>
            <strong>Responsive</strong>
            <span>Mobile-first grid with adaptive layout density</span>
          </div>
          <div>
            <strong>Trusted UX</strong>
            <span>Clear CTAs, empty states, and confident checkout flow</span>
          </div>
        </div>
      </section>

      <section className="container section-stack catalog-layout" id="catalog-section">
        <ProductFilters
          categories={categories}
          filters={filters}
          searchValue={searchInput}
          onSearchChange={(event) => setSearchInput(event.target.value)}
          onCategoryChange={(event) =>
            dispatch(setProductFilters({ category: event.target.value, page: 1 }))
          }
          onSortChange={(event) =>
            dispatch(setProductFilters({ sortBy: event.target.value, page: 1 }))
          }
          priceFilter={priceFilter}
          onPriceChange={(event) => setPriceFilter(event.target.value)}
          ratingFilter={ratingFilter}
          onRatingChange={(event) => setRatingFilter(event.target.value)}
          onReset={() => {
            setSearchInput('')
            setPriceFilter('all')
            setRatingFilter('all')
            dispatch(setProductFilters({ search: '', category: 'all', sortBy: 'featured', page: 1 }))
          }}
        />

        <div className="catalog-content">
          {status === 'loading' ? (
            <div className="product-grid">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : null}

          {status === 'failed' ? (
            <EmptyState title="Unable to load products" description={error} />
          ) : null}

          {status === 'succeeded' && !paginatedProducts.length ? (
            <EmptyState
              title="No matching products"
              description="Try a different search term, category, price point, or rating."
            />
          ) : null}

          {status !== 'loading' && paginatedProducts.length ? (
            <>
              <div className="section-heading">
                <div>
                  <span className="eyebrow">Catalog</span>
                  <h2>{visibleProducts.length} products ready to ship</h2>
                </div>
                <p>Balanced browsing for discovery, comparison, and quick add-to-cart actions.</p>
              </div>

              <div className="product-grid">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              <Pagination
                currentPage={filters.page}
                totalPages={Math.min(totalPages, pages || totalPages)}
                onChange={(page) => dispatch(setProductFilters({ page }))}
              />
            </>
          ) : null}
        </div>
      </section>
    </div>
  )
}
