import { useEffect, useState } from 'react'

export default function HeroBanner({ slides }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length)
    }, 6000)

    return () => window.clearInterval(intervalId)
  }, [slides.length])

  const activeSlide = slides[activeIndex]

  return (
    <section className="amazon-home-shell amazon-home-hero" aria-label="Featured promotions">
      <div className="amazon-home-hero__panel" style={{ background: activeSlide.background }}>
        <div className="amazon-home-hero__headline">
          <span className="amazon-home-hero__eyebrow">{activeSlide.eyebrow}</span>
          <h1>{activeSlide.title}</h1>
        </div>

        <div className="amazon-home-hero__scene" aria-hidden="true">
          {activeSlide.images.map((item, index) => (
            <div
              key={item.title}
              className={`amazon-home-hero__scene-item amazon-home-hero__scene-item--${index + 1}`}
            >
              <img src={item.image} alt="" />
            </div>
          ))}
        </div>

        <button
          className="amazon-home-hero__arrow amazon-home-hero__arrow--left"
          type="button"
          onClick={() =>
            setActiveIndex((currentIndex) =>
              currentIndex === 0 ? slides.length - 1 : currentIndex - 1
            )
          }
          aria-label="Previous slide"
        >
          ‹
        </button>

        <button
          className="amazon-home-hero__arrow amazon-home-hero__arrow--right"
          type="button"
          onClick={() => setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length)}
          aria-label="Next slide"
        >
          ›
        </button>

        <div className="amazon-home-hero__message-bar">
          <span>{activeSlide.description}</span>
          <a href="#top-categories">{activeSlide.ctaText}</a>
        </div>

        <div className="amazon-home-hero__dots" role="tablist" aria-label="Hero slides">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              className={`amazon-home-hero__dot${
                index === activeIndex ? ' amazon-home-hero__dot--active' : ''
              }`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to ${slide.title}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
