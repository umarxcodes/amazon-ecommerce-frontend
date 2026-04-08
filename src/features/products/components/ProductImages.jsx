import { useState } from 'react'

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=600&q=80',
]

export default function ProductImages({ product }) {
  const images =
    product.images && product.images.length
      ? product.images
      : [product.image, ...PLACEHOLDER_IMAGES.slice(0, 3)]

  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="pdp-images">
      <div className="pdp-images__thumbnails">
        {images.map((src, index) => (
          <button
            key={index}
            type="button"
            className={`pdp-images__thumb ${
              index === activeIndex ? 'pdp-images__thumb--active' : ''
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`View image ${index + 1}`}
          >
            <img src={src} alt={`${product.title} thumbnail ${index + 1}`} />
          </button>
        ))}
      </div>

      <div className="pdp-images__main">
        <img
          src={images[activeIndex]}
          alt={product.title}
          className="pdp-images__main-img"
        />
      </div>
    </div>
  )
}
