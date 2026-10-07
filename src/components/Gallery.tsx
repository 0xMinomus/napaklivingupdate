import { useMemo, useRef, useState } from 'react'
import type { ReactElement, SyntheticEvent } from 'react'
import { fallbackToBaseImage, scaleImage } from '../lib/image'
import type { ProductImage } from '../types'

interface GalleryProps {
  images: ProductImage[]
  name: string
}

interface GalleryView {
  galleryKey: string
  index: number
  src: string
  alt: string
}

export default function Gallery({ images, name }: GalleryProps): ReactElement {
  const galleryKey = useMemo(() => JSON.stringify([name, images.map((image) => [image.url, image.alt])]), [images, name])
  const [selection, setSelection] = useState({ galleryKey, index: 0 })
  const [shown, setShown] = useState<GalleryView | null>(null)
  const active = selection.galleryKey === galleryKey
    ? Math.min(selection.index, Math.max(images.length - 1, 0))
    : 0
  const current = images[active]
  const first = images[0]
  const visible = shown?.galleryKey === galleryKey ? shown : first ? {
    galleryKey,
    index: 0,
    src: scaleImage(first.url, 1000),
    alt: first.alt ?? name,
  } : null
  const pending = current && visible && active !== visible.index
  const requestKey = JSON.stringify([galleryKey, active, current?.url])
  const requestRef = useRef(requestKey)
  requestRef.current = requestKey

  const showLoadedImage = (event: SyntheticEvent<HTMLImageElement>): void => {
    if (requestRef.current !== requestKey || !current || event.currentTarget.naturalWidth === 0) return
    setShown({
      galleryKey,
      index: active,
      src: event.currentTarget.currentSrc || event.currentTarget.src,
      alt: current.alt ?? name,
    })
  }

  const handlePendingError = (event: SyntheticEvent<HTMLImageElement>): void => {
    if (requestRef.current !== requestKey || !visible) return
    const source = event.currentTarget.src
    fallbackToBaseImage(event)
    if (source === event.currentTarget.src) setSelection({ galleryKey, index: visible.index })
  }

  return (
    <div className="product-gallery">
      <div className="gallery-thumbs">
        {images.map((img, index) => (
          <button
            type="button"
            key={`${img.url}:${index}`}
            className="gallery-thumb"
            aria-label={`${name} view ${index + 1}`}
            aria-pressed={active === index}
            onClick={() => setSelection({ galleryKey, index })}
          >
            <img
              src={scaleImage(img.url, 320)}
              alt={img.alt ?? `${name} view ${index + 1}`}
              loading="lazy"
              decoding="async"
              onError={fallbackToBaseImage}
            />
          </button>
        ))}
      </div>
      <figure className="gallery-main" id="gallery-main" aria-busy={Boolean(pending)}>
        {visible && (
          <img
            key={`${galleryKey}:${visible.src}`}
            src={visible.src}
            alt={visible.alt}
            decoding="async"
            onError={fallbackToBaseImage}
          />
        )}
      </figure>
      {pending && (
        <img
          key={requestKey}
          src={scaleImage(current.url, 1000)}
          alt=""
          hidden
          style={{ display: 'none' }}
          decoding="async"
          onLoad={showLoadedImage}
          onError={handlePendingError}
        />
      )}
    </div>
  )
}