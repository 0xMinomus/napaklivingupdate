import type { SyntheticEvent } from 'react'

export function scaleImage(url: string, width: number): string {
  if (/images\.unsplash\.com/.test(url)) {
    const separator = url.includes('?') ? '&' : '?'
    const withoutWidth = url.replace(/([?&])w=\d+/i, '')
    return `${withoutWidth}${separator}w=${width}`
  }
  const m = url.match(/^(\/Product\/[^/]+?)(\.\w+)$/)
  if (!m) return url
  const base = m[1]
  const ext = m[2]
  if (width <= 360) return `${base}@320${ext}`
  if (width <= 720) return `${base}@640${ext}`
  return url
}

// CMS uploads may lack the @640/@320 variants. Fall back to the base file
// instead of showing a broken image. No-op once the base itself loads.
export function fallbackToBaseImage(e: SyntheticEvent<HTMLImageElement>): void {
  const img = e.currentTarget
  const base = img.src.replace(/@(640|320)(\.\w+)(\?.*)?$/, '$2$3')
  if (base !== img.src) img.src = base
}