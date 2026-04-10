/* ===== PRODUCT IMAGE GALLERY ===== */
/* Thumbnail selector with main image display */
/* Used on ProductDetailPage for image viewing */

import { useState } from 'react'
import './ProductImages.css'

const PLACEHOLDER = 'https://placehold.co/600x600/f6f7f8/111?text=No+Image'

export default function ProductImages({ product }) {
  const images = product.images?.length
    ? product.images
    : product.image
      ? [product.image]
      : [PLACEHOLDER]
  const [active, setActive] = useState(0)

  return (
    <div className="product-images">
      <div className="product-images__thumbs">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            className={`product-images__thumb ${i === active ? 'product-images__thumb--active' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
          >
            <img src={src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
      <div className="product-images__main">
        <img src={images[active] || PLACEHOLDER} alt={product.title} />
      </div>
    </div>
  )
}
