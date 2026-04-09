import { useRef } from 'react'
import CarouselProductCard from './CarouselProductCard'

export default function ProductCarousel({ title, products }) {
  const trackRef = useRef(null)

  const handleScroll = (direction) => {
    trackRef.current?.scrollBy({
      left: direction * 720,
      behavior: 'smooth',
    })
  }

  return (
    <section className="amazon-home-shell amazon-carousel-section">
      <div className="amazon-carousel-section__header">
        <h2>{title}</h2>

        <div className="amazon-carousel-section__actions">
          <button
            type="button"
            onClick={() => handleScroll(-1)}
            aria-label={`Scroll ${title} left`}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => handleScroll(1)}
            aria-label={`Scroll ${title} right`}
          >
            ›
          </button>
        </div>
      </div>

      <div className="amazon-carousel-section__track" ref={trackRef}>
        {products.map((item) => (
          <CarouselProductCard key={item.title} product={item} />
        ))}
      </div>
    </section>
  )
}
