import { useState } from 'react'
import type { ReactElement } from 'react'
import { scaleImage } from '../lib/image'
import type { ProductImage } from '../types'

interface GalleryProps {
  images: ProductImage[]
  name: string
}

export default function Gallery({ images, name }: GalleryProps): ReactElement {
  const [active, setActive] = useState(0)
  const current = images[Math.min(active, Math.max(images.length - 1, 0))]

  return (
    <div className="product-gallery">
      <div className="gallery-thumbs">
        {images.map((img, index) => (
          <a
            key={index}
            className="gallery-thumb"
            href="#gallery-main"
            aria-label={`${name} view ${index + 1}`}
            onClick={(e) => {
              e.preventDefault()
              setActive(index)
            }}
          >
            <img
              src={scaleImage(img.url, 320)}
              alt={img.alt ?? `${name} view ${index + 1}`}
              loading="lazy"
              decoding="async"
            />
          </a>
        ))}
      </div>
      <figure className="gallery-main" id="gallery-main">
        {current && <img src={scaleImage(current.url, 1000)} alt={name} />}
      </figure>
    </div>
  )
}