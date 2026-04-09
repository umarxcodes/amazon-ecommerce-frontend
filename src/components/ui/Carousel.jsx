import { useCallback, useEffect, useRef, useState } from 'react'
import './Carousel.css'

export default function Carousel({ images, autoPlayInterval = 4000 }) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef(null)

  const total = images?.length || 0
  if (!total) return null

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setCurrent((p) => (p + 1) % total), autoPlayInterval)
  }, [total, autoPlayInterval])

  useEffect(() => { resetTimer(); return () => { if (timerRef.current) clearInterval(timerRef.current) } }, [resetTimer])

  const goTo = (i) => { setCurrent(i); resetTimer() }
  const goPrev = () => { setCurrent((p) => (p - 1 + total) % total); resetTimer() }
  const goNext = () => { setCurrent((p) => (p + 1) % total); resetTimer() }

  return (
    <div className="carousel">
      <div className="carousel__track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {images.map((src, i) => (
          <div key={i} className="carousel__slide">
            <img src={src} alt="" className="carousel__img" loading="lazy" />
          </div>
        ))}
      </div>

      {total > 1 && (
        <>
          <button type="button" className="carousel__arrow carousel__arrow--left" onClick={goPrev} aria-label="Previous">‹</button>
          <button type="button" className="carousel__arrow carousel__arrow--right" onClick={goNext} aria-label="Next">›</button>
          <div className="carousel__dots" role="tablist">
            {images.map((_, i) => (
              <button key={i} type="button" className={`carousel__dot ${i === current ? 'carousel__dot--active' : ''}`} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
