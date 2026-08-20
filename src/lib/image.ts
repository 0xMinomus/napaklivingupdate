export function scaleImage(url: string, width: number): string {
  if (!/images\.unsplash\.com/.test(url)) return url
  const separator = url.includes('?') ? '&' : '?'
  const withoutWidth = url.replace(/([?&])w=\d+/i, '')
  return `${withoutWidth}${separator}w=${width}`
}