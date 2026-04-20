import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useIsAuthenticated, useAddToCart } from '../../hooks'
import { addToast } from '../../features/ui/uiSlice'
import axiosInstance from '../../services/axiosInstance'
import './HomePage.css'

const IMAGE_PLACEHOLDER = 'https://via.placeholder.com/320x320?text=No+Image'

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value || 0)
}

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  return (
    <span className="hp-product-card__rating">
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          return (
            <span
              key={i}
              className="hp-product-card__star hp-product-card__star--full"
            >
              ★
            </span>
          )
        } else if (i === fullStars && hasHalfStar) {
          return (
            <span
              key={i}
              className="hp-product-card__star hp-product-card__star--half"
            >
              ★
            </span>
          )
        } else {
          return (
            <span
              key={i}
              className="hp-product-card__star hp-product-card__star--empty"
            >
              ☆
            </span>
          )
        }
      })}
    </span>
  )
}

const ProductCard = ({ product, onAddToCart, onProductClick }) => {
  const [imageSrc, setImageSrc] = useState(
    product.images?.[0] || IMAGE_PLACEHOLDER
  )

  const handleCardClick = (e) => {
    if (e.target.closest('.hp-product-card__add-btn')) return
    onProductClick(product._id)
  }

  return (
    <div
      className="hp-product-card"
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="hp-product-card__image-container">
        <img
          src={imageSrc}
          alt={product.name}
          className="hp-product-card__image"
          onError={() => setImageSrc(IMAGE_PLACEHOLDER)}
          loading="lazy"
        />
        {product.prime && (
          <span className="hp-product-card__prime-badge">Prime</span>
        )}
      </div>

      <div className="hp-product-card__content">
        <h3 className="hp-product-card__name" title={product.name}>
          {product.name}
        </h3>

        <div className="hp-product-card__rating-section">
          <StarRating rating={product.ratings || 0} />
          {product.numReviews > 0 && (
            <span className="hp-product-card__reviews">
              ({product.numReviews})
            </span>
          )}
        </div>

        <p className="hp-product-card__price">
          ${(product.price || 0).toFixed(2)}
        </p>

        <p
          className={`hp-product-card__stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}
        >
          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
        </p>

        <button
          className="hp-product-card__add-btn"
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

const Section = ({
  title,
  products,
  layout = 'scroll',
  onProductClick,
  onAddToCart,
}) => {
  const scrollRef = useRef(null)

  if (!products || products.length === 0) return null

  const handleScroll = (direction) => {
    if (!scrollRef.current) return
    const scrollAmount = direction === 'left' ? -400 : 400
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  if (layout === 'grid') {
    return (
      <section className="hp-section">
        <div className="hp-section__header">
          <h2 className="hp-section__title">{title}</h2>
          <a href="#" className="hp-section__see-more">
            See more →
          </a>
        </div>
        <div className="hp-section__grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={onAddToCart}
              onProductClick={onProductClick}
            />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="hp-section">
      <div className="hp-section__header">
        <h2 className="hp-section__title">{title}</h2>
        <a href="#" className="hp-section__see-more">
          See more →
        </a>
      </div>
      <div className="hp-section__scroll-container">
        <button
          className="hp-section__scroll-btn hp-section__scroll-btn--left"
          onClick={() => handleScroll('left')}
        >
          ‹
        </button>
        <div className="hp-section__scroll-track" ref={scrollRef}>
          {products.map((product) => (
            <div key={product._id} className="hp-section__scroll-item">
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                onProductClick={onProductClick}
              />
            </div>
          ))}
        </div>
        <button
          className="hp-section__scroll-btn hp-section__scroll-btn--right"
          onClick={() => handleScroll('right')}
        >
          ›
        </button>
      </div>
    </section>
  )
}

const CAROUSEL_IMAGES = [
  'https://res.cloudinary.com/dlul8f6xz/image/upload/v1776421978/banner1_kvf6rq.jpg',
  'https://res.cloudinary.com/dlul8f6xz/image/upload/v1776421978/banner4_ruk2bn.jpg',
  'https://res.cloudinary.com/dlul8f6xz/image/upload/v1776421978/banner3_co9kgo.jpg',
  'https://res.cloudinary.com/dlul8f6xz/image/upload/v1776421977/banner_2_s6xm3a.jpg',
]

const Carousel = ({ images, autoPlayInterval = 4000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, autoPlayInterval)
    return () => clearInterval(interval)
  }, [autoPlayInterval, images.length])

  return (
    <div className="hp-carousel">
      <img
        src={images[currentIndex]}
        alt="Banner"
        className="hp-carousel__image"
      />
      <div className="hp-carousel__dots">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`hp-carousel__dot ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isAuthenticated = useIsAuthenticated()
  const addToCart = useAddToCart()

  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get('/products?page=1&limit=100')
        const products = Array.isArray(response.data)
          ? response.data
          : response.data.products || response.data.data || []
        setAllProducts(products)
      } catch (err) {
        setError(err.message || 'Failed to load products')
        console.error('Failed to fetch products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Handle product click - navigate to detail page
  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`)
  }

  // Handle add to cart with toast notification
  const handleAddToCart = async (product) => {
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

    try {
      const result = await addToCart({
        productId: product._id,
        quantity: 1,
      })

      if (result.type === 'cart/addToCart/fulfilled' || result.payload) {
        dispatch(
          addToast({
            title: 'Added to Cart',
            message: `${product.name} added to cart successfully!`,
            type: 'success',
          })
        )
      } else {
        dispatch(
          addToast({
            title: 'Failed',
            message: 'Could not add product to cart.',
            type: 'error',
          })
        )
      }
    } catch (err) {
      dispatch(
        addToast({
          title: 'Error',
          message: 'Failed to add product to cart.',
          type: 'error',
        })
      )
    }
  }
  // Derive sections from products array
  const sections = {
    topDeals: allProducts
      .sort((a, b) => (a.price || 0) - (b.price || 0))
      .slice(0, 10),
    newArrivals: allProducts
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 8),
    electronics:
      allProducts.filter(
        (p) =>
          p.category?.toLowerCase().includes('electronic') ||
          p.category === 'Electronics'
      ).length > 0
        ? allProducts.filter(
            (p) =>
              p.category?.toLowerCase().includes('electronic') ||
              p.category === 'Electronics'
          )
        : allProducts.slice(0, 6),
    fashion:
      allProducts.filter(
        (p) =>
          p.category?.toLowerCase().includes('fashion') ||
          p.category === 'Fashion'
      ).length > 0
        ? allProducts.filter(
            (p) =>
              p.category?.toLowerCase().includes('fashion') ||
              p.category === 'Fashion'
          )
        : allProducts.slice(0, 6),
    bestSellers: allProducts
      .sort((a, b) => (b.ratings || 0) - (a.ratings || 0))
      .slice(0, 8),
    allProducts: allProducts,
  }

  if (loading) {
    return (
      <div className="home-page">
        <p style={{ textAlign: 'center', padding: '2rem' }}>
          Loading products...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="home-page">
        <p style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          Error: {error}
        </p>
      </div>
    )
  }

  return (
    <div className="home-page">
      <Carousel images={CAROUSEL_IMAGES} autoPlayInterval={4000} />

      <Section
        title="Top Deals"
        products={sections.topDeals}
        layout="scroll"
        onProductClick={handleProductClick}
        onAddToCart={handleAddToCart}
      />
      <Section
        title="New Arrivals"
        products={sections.newArrivals}
        layout="scroll"
        onProductClick={handleProductClick}
        onAddToCart={handleAddToCart}
      />
      <Section
        title="Electronics"
        products={sections.electronics}
        layout="grid"
        onProductClick={handleProductClick}
        onAddToCart={handleAddToCart}
      />
      <Section
        title="Fashion"
        products={sections.fashion}
        layout="scroll"
        onProductClick={handleProductClick}
        onAddToCart={handleAddToCart}
      />
      <Section
        title="Best Sellers"
        products={sections.bestSellers}
        layout="scroll"
        onProductClick={handleProductClick}
        onAddToCart={handleAddToCart}
      />
      <Section
        title="All Products"
        products={sections.allProducts}
        layout="grid"
        onProductClick={handleProductClick}
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}
