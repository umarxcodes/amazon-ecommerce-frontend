import { useEffect, useMemo, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  useAddToCart,
  useAppDispatch,
  useFetchProducts,
  useIsAuthenticated,
  useProductStatus,
  useProducts,
} from '../../hooks'
import { addToast } from '../../features/ui/uiSlice'
import Carousel from '../../components/shared/Carousel'
import EmptyState from '../../components/shared/EmptyState'
import SkeletonCard from '../../components/shared/SkeletonCard'
import ProductCard from '../../features/products/components/ProductCard'
import './HomePage.css'

const CAROUSEL_IMAGES = [
  'https://res.cloudinary.com/dlul8f6xz/image/upload/v1776421978/banner1_kvf6rq.jpg',
  'https://res.cloudinary.com/dlul8f6xz/image/upload/v1776421978/banner4_ruk2bn.jpg',
  'https://res.cloudinary.com/dlul8f6xz/image/upload/v1776421978/banner3_co9kgo.jpg',
  'https://res.cloudinary.com/dlul8f6xz/image/upload/v1776421977/banner_2_s6xm3a.jpg',
]

const IMAGE_PLACEHOLDER =
  'https://placehold.co/320x320/f7f8f8/111111?text=Amazon'

const CATEGORY_ORDER = [
  'Electronics',
  'Computers & Accessories',
  'Gaming',
  'Home & Kitchen',
  'Clothing',
  'Health & Beauty',
  'Sports & Outdoors',
  'Books',
  'Toys & Games',
  'Automotive',
  'Grocery & Gourmet',
]

const CATEGORY_CARD_TITLES = {
  Electronics: 'Upgrade your electronics',
  'Computers & Accessories': 'Build your desk setup',
  Gaming: 'Level up your play',
  'Home & Kitchen': 'Refresh your home',
  Clothing: 'Style picks for every day',
  'Health & Beauty': 'Beauty and wellness finds',
  'Sports & Outdoors': 'Gear up for the outdoors',
  Books: 'Page-turners worth reading',
  'Toys & Games': 'Playroom favorites',
  Automotive: 'Keep your ride ready',
  'Grocery & Gourmet': 'Pantry and gourmet picks',
}

const SHELF_TITLES = {
  Electronics: 'Top picks in Electronics',
  'Computers & Accessories': 'Work and play essentials',
  Gaming: 'Most loved in Gaming',
  'Home & Kitchen': 'Best sellers in Home & Kitchen',
  Clothing: 'Trending fashion picks',
  'Health & Beauty': 'Popular beauty finds',
  'Sports & Outdoors': 'Outdoor and fitness favorites',
  Books: 'Readers are loving these books',
  'Toys & Games': 'Fun finds for every age',
  Automotive: 'Automotive upgrades and tools',
  'Grocery & Gourmet': 'Pantry picks and gourmet treats',
}

const categoryLink = (category) =>
  `/products?category=${encodeURIComponent(category)}`

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: Number.isInteger(Number(value)) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0)

const getProductImage = (product, index = 0) =>
  product.images?.[index] ?? product.images?.[0] ?? IMAGE_PLACEHOLDER

const chunkItems = (items, chunkSize) => {
  const chunks = []

  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize))
  }

  return chunks
}

const sortByNewest = (products) =>
  [...products].sort(
    (left, right) =>
      new Date(right.createdAt ?? 0).getTime() -
      new Date(left.createdAt ?? 0).getTime()
  )

const sortByTopRated = (products) =>
  [...products].sort((left, right) => {
    const ratingDelta = (right.ratings ?? 0) - (left.ratings ?? 0)

    if (ratingDelta !== 0) return ratingDelta

    const reviewDelta = (right.numReviews ?? 0) - (left.numReviews ?? 0)

    if (reviewDelta !== 0) return reviewDelta

    return (right.price ?? 0) - (left.price ?? 0)
  })

function buildCategoryEntries(products) {
  const groupedProducts = products.reduce((groups, product) => {
    const category = product.category || 'Other'

    if (!groups[category]) {
      groups[category] = []
    }

    groups[category].push(product)
    return groups
  }, {})

  const knownCategories = CATEGORY_ORDER.filter(
    (category) => groupedProducts[category]?.length
  )
  const otherCategories = Object.keys(groupedProducts)
    .filter((category) => !CATEGORY_ORDER.includes(category))
    .sort()

  return [...knownCategories, ...otherCategories].map((category) => [
    category,
    groupedProducts[category],
  ])
}

function buildCategoryTiles(products) {
  if (!products.length) return []

  const primaryTiles = products.map((product) => ({
    id: `${product._id}-primary`,
    productId: product._id,
    image: getProductImage(product),
    label: product.name,
  }))

  const additionalTiles = products.flatMap((product) =>
    (product.images ?? []).slice(1).map((image, index) => ({
      id: `${product._id}-alt-${index}`,
      productId: product._id,
      image,
      label: `${product.name} view ${index + 2}`,
    }))
  )

  const tiles = [...primaryTiles, ...additionalTiles]

  while (tiles.length < 4) {
    const fallbackTile = tiles[tiles.length % Math.max(tiles.length, 1)]

    if (!fallbackTile) break

    tiles.push({
      ...fallbackTile,
      id: `${fallbackTile.id}-repeat-${tiles.length}`,
    })
  }

  return tiles.slice(0, 4)
}

function buildShelfItems(products) {
  return products.map((product) => ({
    id: product._id,
    productId: product._id,
    image: getProductImage(product),
    title: product.name,
    category: product.category,
    price: product.price,
    rating: product.ratings ?? 0,
    numReviews: product.numReviews ?? 0,
    prime: product.prime,
  }))
}

function CategoryShowcaseCard({ card }) {
  return (
    <article className="hp-category-card">
      <div className="hp-category-card__header">
        <h2 className="hp-category-card__title">{card.title}</h2>
        <span className="hp-category-card__count">{card.count} items</span>
      </div>

      <div className="hp-category-card__grid">
        {card.items.map((item) => (
          <Link
            key={item.id}
            to={`/products/${item.productId}`}
            className="hp-category-card__tile"
          >
            <div className="hp-category-card__image">
              <img
                src={item.image}
                alt={item.label}
                loading="lazy"
                onError={(event) => {
                  event.target.src = IMAGE_PLACEHOLDER
                }}
              />
            </div>
            <span className="hp-category-card__label">{item.label}</span>
          </Link>
        ))}
      </div>

      <Link to={card.link} className="hp-inline-link">
        {card.footer}
      </Link>
    </article>
  )
}

function ProductShelf({ title, items, link, linkLabel = 'See more' }) {
  const trackRef = useRef(null)

  if (!items.length) return null

  const handleScroll = (direction) => {
    if (!trackRef.current) return

    trackRef.current.scrollBy({
      left: direction * trackRef.current.clientWidth * 0.88,
      behavior: 'smooth',
    })
  }

  return (
    <section className="hp-section">
      <div className="hp-shelf">
        <div className="hp-section__heading">
          <div>
            <h2 className="hp-section__title">{title}</h2>
            <p className="hp-section__subtitle">
              Built directly from your backend catalog data.
            </p>
          </div>
          {link ? (
            <Link to={link} className="hp-inline-link">
              {linkLabel}
            </Link>
          ) : null}
        </div>

        <div className="hp-shelf__frame">
          {items.length > 5 ? (
            <button
              type="button"
              className="hp-shelf__arrow hp-shelf__arrow--prev"
              onClick={() => handleScroll(-1)}
              aria-label={`Scroll ${title} left`}
            >
              ‹
            </button>
          ) : null}

          <div className="hp-shelf__track" ref={trackRef}>
            {items.map((item) => (
              <article key={item.id} className="hp-shelf__item">
                <Link
                  to={`/products/${item.productId}`}
                  className="hp-shelf__image"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    onError={(event) => {
                      event.target.src = IMAGE_PLACEHOLDER
                    }}
                  />
                  {item.alternateView ? (
                    <span className="hp-shelf__badge">More view</span>
                  ) : null}
                </Link>

                <Link
                  to={`/products/${item.productId}`}
                  className="hp-shelf__name"
                >
                  {item.title}
                </Link>

                <p className="hp-shelf__meta">
                  {item.category}
                  {item.numReviews ? ` • ${item.numReviews} reviews` : ''}
                </p>

                <div className="hp-shelf__footer">
                  <span className="hp-shelf__price">
                    {formatCurrency(item.price)}
                  </span>
                  {item.prime ? (
                    <span className="hp-shelf__tag hp-shelf__tag--prime">
                      Prime
                    </span>
                  ) : item.rating > 0 ? (
                    <span className="hp-shelf__tag">
                      {item.rating.toFixed(1)} ★
                    </span>
                  ) : null}
                </div>
              </article>
            ))}
          </div>

          {items.length > 5 ? (
            <button
              type="button"
              className="hp-shelf__arrow hp-shelf__arrow--next"
              onClick={() => handleScroll(1)}
              aria-label={`Scroll ${title} right`}
            >
              ›
            </button>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  const dispatch = useAppDispatch()
  const products = useProducts()
  const status = useProductStatus()
  const addToCart = useAddToCart()
  const isAuthenticated = useIsAuthenticated()
  const fetchProducts = useFetchProducts()

  const [searchParams] = useSearchParams()
  const search = searchParams.get('search') ?? ''

  useEffect(() => {
    fetchProducts({ search, limit: 100 })
  }, [fetchProducts, search])

  const categoryEntries = useMemo(
    () => buildCategoryEntries(products),
    [products]
  )

  const categoryRows = useMemo(() => {
    const cards = categoryEntries.map(([category, categoryProducts]) => ({
      category,
      title: CATEGORY_CARD_TITLES[category] ?? `Explore ${category}`,
      link: categoryLink(category),
      footer: `See more in ${category}`,
      count: categoryProducts.length,
      items: buildCategoryTiles(categoryProducts),
    }))

    return chunkItems(cards, 4)
  }, [categoryEntries])

  const dealShelfItems = useMemo(
    () => buildShelfItems(sortByTopRated(products).slice(0, 12)),
    [products]
  )

  const newestShelfItems = useMemo(
    () => buildShelfItems(sortByNewest(products).slice(0, 12)),
    [products]
  )

  const categoryShelves = useMemo(
    () =>
      categoryEntries
        .map(([category, categoryProducts]) => ({
          title: SHELF_TITLES[category] ?? `Top picks in ${category}`,
          link: categoryLink(category),
          items: buildShelfItems(categoryProducts.slice(0, 10)), // Limit to 10 per category
        }))
        .filter((section) => section.items.length > 0),
    [categoryEntries]
  )

  const handleAddToCart = ({ productId, title }) => {
    if (!isAuthenticated) {
      dispatch(
        addToast({
          title: 'Sign in required',
          message: 'Please sign in to add items.',
          type: 'info',
        })
      )
      return
    }

    addToCart({ productId, quantity: 1 })

    dispatch(
      addToast({
        title: 'Added',
        message: `${title ?? 'Product'} added to cart.`,
        type: 'success',
      })
    )
  }

  if ((status === 'loading' || status === 'idle') && !products.length) {
    return (
      <div className="home-page">
        <div className="home-page__skeleton-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    )
  }

  if (status === 'failed' && !products.length) {
    return (
      <EmptyState
        title="Unable to load products"
        description="Please try again later."
        action={
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => fetchProducts({ search, limit: 100 })}
          >
            Retry
          </button>
        }
      />
    )
  }

  if (search) {
    return (
      <div className="home-page">
        <section className="hp-section hp-section--search">
          <div className="hp-product-panel">
            <div className="hp-section__heading">
              <div>
                <h1 className="hp-search-title">Results for "{search}"</h1>
                <p className="hp-section__subtitle">
                  {products.length} backend products matched your search.
                </p>
              </div>
              <Link to="/products" className="hp-inline-link">
                Open product catalog
              </Link>
            </div>

            {products.length ? (
              <div className="hp-product-panel__grid">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No products found"
                description="Try a different search term or browse the full catalog."
              />
            )}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="home-page">
      <section className="hp-hero">
        <Carousel images={CAROUSEL_IMAGES} autoPlayInterval={4000} />
      </section>

      {categoryRows[0]?.length ? (
        <section className="hp-section hp-section--overlap">
          <div className="hp-card-grid">
            {categoryRows[0].map((card) => (
              <CategoryShowcaseCard key={card.category} card={card} />
            ))}
          </div>
        </section>
      ) : null}

      <ProductShelf
        title="Today's top deals from your backend"
        items={dealShelfItems}
        link="/products"
        linkLabel="Shop all deals"
      />

      {categoryRows.slice(1).map((row, index) => (
        <section key={index} className="hp-section">
          <div className="hp-card-grid">
            {row.map((card) => (
              <CategoryShowcaseCard key={card.category} card={card} />
            ))}
          </div>
        </section>
      ))}

      <ProductShelf
        title="New arrivals in your catalog"
        items={newestShelfItems}
        link="/products?sort=-createdAt"
        linkLabel="See newest"
      />

      {categoryShelves.map((section) => (
        <ProductShelf
          key={section.title}
          title={section.title}
          items={section.items}
          link={section.link}
          linkLabel="See more"
        />
      ))}

      {!products.length ? (
        <section className="hp-section">
          <EmptyState
            title="No products available"
            description="Check back later for new deals."
          />
        </section>
      ) : null}
    </div>
  )
}
