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