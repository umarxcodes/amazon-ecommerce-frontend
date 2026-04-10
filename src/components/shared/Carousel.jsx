/* ===== IMAGE CAROUSEL COMPONENT ===== */
/* Auto-playing image slider with manual controls */
/* Used on HomePage for hero banners */

import { useCallback, useEffect, useRef, useState, memo } from 'react'
import './Carousel.css'

function Carousel({ images = [], autoPlayInterval = 4000 }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const timerRef = useRef(null)
  const trackRef = useRef(null)

  const total = images.length
  if (!total) return null

  const extendedImages = [...images, images[0]]

  const stopAutoPlay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startAutoPlay = useCallback(() => {
    stopAutoPlay()
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => prev + 1)
    }, autoPlayInterval)
  }, [autoPlayInterval, stopAutoPlay])

  useEffect(() => {
    startAutoPlay()
    return stopAutoPlay
  }, [startAutoPlay, stopAutoPlay])

  const handleTransitionEnd = () => {
    if (currentIndex === total) {
      setIsTransitioning(false)
      setCurrentIndex(0)
    }
  }

  useEffect(() => {
    if (currentIndex === 0 && !isTransitioning) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true)
        })
      })
    }
  }, [currentIndex, isTransitioning])

  const goTo = (index) => {
    setCurrentIndex(index)
    setIsTransitioning(true)
    startAutoPlay()
  }

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1))
    setIsTransitioning(true)
    startAutoPlay()
  }

  const goNext = () => {
    setCurrentIndex((prev) => prev + 1)
    setIsTransitioning(true)
    startAutoPlay()
  }

  const displayIndex = currentIndex >= total ? 0 : currentIndex

  return (
    <div
      className="carousel"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      <div
        ref={trackRef}
        className={`carousel__track ${isTransitioning ? 'carousel__track--animating' : ''}`}
        style={{
          transform: `translateX(-${(currentIndex * 100) / extendedImages.length}%)`,
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedImages.map((src, index) => (
          <div key={index} className="carousel__slide">
            <img src={src} alt="" className="carousel__img" loading="lazy" />
          </div>
        ))}
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            className="carousel__arrow carousel__arrow--prev"
            onClick={goPrev}
            aria-label="Previous slide"
          >
            &#8249;
          </button>
          <button
            type="button"
            className="carousel__arrow carousel__arrow--next"
            onClick={goNext}
            aria-label="Next slide"
          >
            &#8250;
          </button>
          <div
            className="carousel__indicators"
            role="tablist"
            aria-label="Carousel navigation"
          >
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`carousel__indicator ${index === displayIndex ? 'carousel__indicator--active' : ''}`}
                onClick={() => goTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                role="tab"
                aria-selected={index === displayIndex}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default memo(Carousel)
