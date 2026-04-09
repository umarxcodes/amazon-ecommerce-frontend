// ===*Amazon Carousal*===
import React, { useState, useEffect } from 'react'

// ===*Carousel Css*===
import './Carousel.css'

// ===*Slides Data *===

const AmazonCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  return (
    <div className="amazon-carousel-container">
      <div className="amazon-carousel">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="carousel-slide">
              <img src={slide.image} alt="" />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          className="carousel-control prev"
          onClick={goToPrevSlide}
          aria-label="Previous slide"
        >
          <span className="control-icon">‹</span>
        </button>
        <button
          className="carousel-control next"
          onClick={goToNextSlide}
          aria-label="Next slide"
        >
          <span className="control-icon">›</span>
        </button>

        {/* Indicators */}
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AmazonCarousel
