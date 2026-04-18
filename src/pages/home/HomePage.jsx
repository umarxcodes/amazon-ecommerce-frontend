/* ===== HOME PAGE ===== */
/* Pixel-perfect Amazon.com homepage clone */
/* Public route - no authentication required */

import { useEffect, useCallback, useMemo, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  useAppDispatch,
  useProducts,
  useProductStatus,
  useAddToCart,
  useIsAuthenticated,
  useFetchProducts,
} from '../../hooks'
import { addToast } from '../../features/ui/uiSlice'
import Carousel from '../../components/shared/Carousel'
import SkeletonCard from '../../components/shared/SkeletonCard'
import EmptyState from '../../components/shared/EmptyState'
import './HomePage.css'

const CAROUSEL_IMAGES = [
  'https://res.cloudinary.com/dlul8f6xz/image/upload/v1776421978/banner1_kvf6rq.jpg',
  'https://res.cloudinary.com/dlul8f6xz/image/upload/v1776421978/banner4_ruk2bn.jpg',
  'https://res.cloudinary.com/dlul8f6xz/image/upload/v1776421978/banner3_co9kgo.jpg',
  'https://res.cloudinary.com/dlul8f6xz/image/upload/v1776421977/banner_2_s6xm3a.jpg',
]

function buildCategorySections(products) {
  const categories = {}
  products.forEach((product) => {
    const cat = product.category || 'Other'
    if (!categories[cat]) categories[cat] = []
    categories[cat].push(product)
  })
  return Object.entries(categories)
    .slice(0, 4)
    .map(([cat, prods]) => ({
      title: `Shop ${cat}`,
      link: `/products?category=${encodeURIComponent(cat)}`,
      items: prods.slice(0, 4).map((p) => ({
        img:
          p.images?.[0] ||
          'https://placehold.co/300x300/f5f5f5/333?text=No+Image',
        label: p.name,
      })),
    }))
}

function buildPromoSections(products) {
  const topRated = products.filter((p) => (p.ratings || 0) >= 4).slice(0, 8)
  const recent = products.slice(0, 8)
  const gaming = products
    .filter((p) => p.category?.toLowerCase() === 'gaming')
    .slice(0, 8)
  const electronics = products
    .filter((p) => p.category?.toLowerCase() === 'electronics')
    .slice(0, 8)

  return [
    [
      {
        title: "Today's Deals",
        link: '/products',
        items: recent.slice(0, 4).map((p) => ({ img: p.images?.[0] || 'https://placehold.co/300x300/f5f5f5/333?text=No+Image' })),
      },
      {
        title: 'Top Rated Products',
        link: '/products?sort=rating',
        items: topRated.slice(0, 4).map((p) => ({ img: p.images?.[0] || 'https://placehold.co/300x300/f5f5f5/333?text=No+Image' })),
      },
      {
        title: 'Gaming Essentials',
        link: '/products?category=gaming',
        items: gaming.slice(0, 4).map((p) => ({ img: p.images?.[0] || 'https://placehold.co/300x300/f5f5f5/333?text=No+Image' })),
      },
      {
        title: 'Electronics Deals',
        link: '/products?category=electronics',
        items: electronics
          .slice(0, 4)
          .map((p) => ({ img: p.images?.[0] || 'https://placehold.co/300x300/f5f5f5/333?text=No+Image' })),
      },
    ],
    [
      {
        title: 'New Arrivals',
        link: '/products?sort=-createdAt',
        items: products.slice(0, 4).map((p) => ({ img: p.images?.[0] || 'https://placehold.co/300x300/f5f5f5/333?text=No+Image' })),
      },
      {
        title: 'Best Sellers',
        link: '/products?sort=-numReviews',
        items: products.slice(0, 4).map((p) => ({ img: p.images?.[0] || 'https://placehold.co/300x300/f5f5f5/333?text=No+Image' })),
      },
      {
        title: 'Home & Kitchen',
        link: '/products?category=home',
        items: products
          .filter((p) => p.category?.toLowerCase() === 'home')
          .slice(0, 4)
          .map((p) => ({ img: p.images?.[0] || 'https://placehold.co/300x300/f5f5f5/333?text=No+Image' })),
      },
      {
        title: 'Fashion Finds',
        link: '/products?category=clothing',
        items: products
          .filter((p) => p.category?.toLowerCase() === 'clothing')
          .slice(0, 4)
          .map((p) => ({ img: p.images?.[0] || 'https://placehold.co/300x300/f5f5f5/333?text=No+Image' })),
      },
    ],
  ]
}

/* --- Horizontal Product Carousel --- */
function ProductCarousel({ title, products, onAddToCart }) {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir * scrollRef.current.clientWidth * 0.75,
        behavior: 'smooth',
      })
    }
  }

  if (!products.length) return null

  return (
    <section className="hp-carousel">
      <h2 className="hp-carousel__title">{title}</h2>
      <div className="hp-carousel__wrapper">
        <button
          type="button"
          className="hp-carousel__arrow hp-carousel__arrow--prev"
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
        >
          ‹
        </button>
        <div className="hp-carousel__track" ref={scrollRef}>
          {products.map((p) => (
            <div key={p._id} className="hp-carousel__card">
              <Link to={`/products/${p._id}`} className="hp-carousel__card-img">
                <img
                  src={p.images?.[0] || 'https://placehold.co/200x200'}
                  alt={p.name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/200x200'
                  }}
                />
              </Link>
              <Link
                to={`/products/${p._id}`}
                className="hp-carousel__card-title"
              >
                {p.name}
              </Link>
              <div className="hp-carousel__card-price">${p.price}</div>
              <div className="hp-carousel__card-rating">
                {'★'.repeat(Math.round(p.ratings || 0))}
                {'☆'.repeat(5 - Math.round(p.ratings || 0))}
                <span className="hp-carousel__card-count">
                  ({p.numReviews || 0})
                </span>
              </div>
              <button
                type="button"
                className="hp-carousel__card-btn"
                onClick={() =>
                  onAddToCart?.({
                    productId: p._id,
                    title: p.name,
                    price: p.price,
                    quantity: 1,
                  })
                }
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="hp-carousel__arrow hp-carousel__arrow--next"
          onClick={() => scroll(1)}
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>
    </section>
  )
}

/* --- Category Card (Amazon 4-image style) --- */
function CategoryCardItem({ card }) {
  return (
    <div className="hp-cat-card">
      <h3 className="hp-cat-card__title">{card.title}</h3>
      <div className="hp-cat-card__grid">
        {card.items.map((item, i) => (
          <Link key={i} to={card.link} className="hp-cat-card__item">
            <img
              src={item.img}
              alt={item.label}
              loading="lazy"
              onError={(e) => {
                e.target.src =
                  'https://placehold.co/300x300/f5f5f5/333?text=Product'
              }}
            />
            <span className="hp-cat-card__label">{item.label}</span>
          </Link>
        ))}
      </div>
      <Link to={card.link} className="hp-cat-card__link">
        See more
      </Link>
    </div>
  )
}

/* --- Promo Card (with 2x2 images) --- */
function PromoCard({ promo }) {
  return (
    <div className="hp-promo-card">
      <h3 className="hp-promo-card__title">{promo.title}</h3>
      <div className="hp-promo-card__grid">
        {promo.items.map((item, i) => (
          <Link key={i} to={promo.link} className="hp-promo-card__item">
            <img
              src={item.img}
              alt=""
              loading="lazy"
              onError={(e) => {
                e.target.src =
                  'https://placehold.co/300x300/f5f5f5/333?text=Product'
              }}
            />
          </Link>
        ))}
      </div>
      <Link to={promo.link} className="hp-promo-card__link">
        Discover more
      </Link>
    </div>
  )
}

/* ===== MAIN HOME PAGE ===== */
export default function HomePage() {
  const dispatch = useAppDispatch()
  const products = useProducts()
  const status = useProductStatus()
  const addToCart = useAddToCart()
  const isAuthenticated = useIsAuthenticated()
  const fetchProducts = useFetchProducts()

  const [searchParams] = useSearchParams()
  const search = searchParams.get('search') ?? ''

  const categoryCards = useMemo(
    () => buildCategorySections(products),
    [products]
  )

  const promoSections = useMemo(() => buildPromoSections(products), [products])

  useEffect(() => {
    fetchProducts({ search, limit: 100 })
  }, [dispatch, fetchProducts, search])

  const handleAddToCart = useCallback(
    (payload) => {
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
      addToCart({ productId: payload.productId, quantity: 1 })
      dispatch(
        addToast({
          title: 'Added',
          message: `${payload.title ?? 'Product'} added to cart.`,
          type: 'success',
        })
      )
    },
    [dispatch, isAuthenticated, addToCart]
  )

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
            className="btn btn--primary"
            onClick={() => fetchProducts({ search, limit: 24 })}
          >
            Retry
          </button>
        }
      />
    )
  }

  return (
    <div className="home-page">
      {/* Hero Carousel */}
      <Carousel images={CAROUSEL_IMAGES} autoPlayInterval={4000} />

      {/* Category Cards Grid */}
      {!search && (
        <section className="hp-section hp-section--cards">
          <div className="hp-cat-card-grid">
            {categoryCards.map((card, i) => (
              <CategoryCardItem key={i} card={card} />
            ))}
          </div>
        </section>
      )}

      {/* Search results or Today's Deals */}
      {products.length > 0 && (
        <section className={`hp-section ${search ? 'hp-section--search' : ''}`}>
          <h2 className="hp-section__title">
            {search ? `Results for "${search}"` : "Today's Deals"}
          </h2>
          <div className="hp-product-grid">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="hp-product-card"
              >
                <div className="hp-product-card__img">
                  <img
                    src={product.images?.[0] || 'https://placehold.co/200x200'}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/200x200'
                    }}
                  />
                </div>
                <div className="hp-product-card__title">{product.name}</div>
                <div className="hp-product-card__rating">
                  {'★'.repeat(Math.round(product.ratings || 0))}
                  {'☆'.repeat(5 - Math.round(product.ratings || 0))}
                  <span className="hp-product-card__count">
                    ({product.numReviews || 0})
                  </span>
                </div>
                <div className="hp-product-card__price">${product.price}</div>
                <button
                  type="button"
                  className="hp-product-card__btn"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleAddToCart({
                      productId: product._id,
                      title: product.name,
                      price: product.price,
                    })
                  }}
                >
                  Add to Cart
                </button>
              </Link>
            ))}
          </div>
          {search && (
            <div className="hp-section__footer">
              <Link to="/products" className="hp-see-all-link">
                See all results for "{search}"
              </Link>
            </div>
          )}
        </section>
      )}

      {/* Horizontal carousel: Related products */}
      {!search && products.length > 0 && (
        <ProductCarousel
          title="Related to items you've viewed"
          products={products.slice(0, 10)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Promo Grid - Set 1 */}
      {!search && (
        <section className="hp-section hp-section--promo">
          <div className="hp-promo-grid">
            {promoSections[0].map((promo, i) => (
              <PromoCard key={i} promo={promo} />
            ))}
          </div>
        </section>
      )}

      {/* Horizontal carousel: More items */}
      {!search && products.length > 6 && (
        <ProductCarousel
          title="More items to consider"
          products={products.slice(6, 18)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Promo Grid - Set 2 */}
      {!search && (
        <section className="hp-section hp-section--promo">
          <div className="hp-promo-grid">
            {promoSections[1].map((promo, i) => (
              <PromoCard key={i} promo={promo} />
            ))}
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {!search && products.length > 0 && (
        <section className="hp-section hp-section--bestsellers">
          <h2 className="hp-section__title">
            Best Sellers in Clothing, Shoes & Jewelry
          </h2>
          <div className="hp-bestsellers-track">
            {products.slice(0, 8).map((p) => (
              <Link
                key={p._id}
                to={`/products/${p._id}`}
                className="hp-bestseller"
              >
                <img
                  src={p.images?.[0] || 'https://placehold.co/160x200'}
                  alt={p.name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/160x200'
                  }}
                />
                <div className="hp-bestseller__price">${p.price}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!search && products.length > 0 && (
        <section className="hp-section hp-section--bestsellers">
          <h2 className="hp-section__title">Best Sellers in Home & Kitchen</h2>
          <div className="hp-bestsellers-track">
            {products.slice(0, 8).map((p) => (
              <Link
                key={p._id}
                to={`/products/${p._id}`}
                className="hp-bestseller"
              >
                <img
                  src={p.images?.[0] || 'https://placehold.co/160x200'}
                  alt={p.name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/160x200'
                  }}
                />
                <div className="hp-bestseller__price">${p.price}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {!search && products.length === 0 && (
        <section className="hp-section">
          <EmptyState
            title="No products available"
            description="Check back later for new deals."
          />
        </section>
      )}
    </div>
  )
}
