export const CATEGORY_PAGES = new Set(['home-decor', 'table-accessories', 'vases', 'lifestyle'])

export function productUrl(slug: string): string {
  return `/product/${encodeURIComponent(slug)}`
}

export function categoryUrl(slug: string): string {
  return `/catalog?category=${encodeURIComponent(slug)}`
}

export function collectionUrl(slug: string): string {
  return `/collection/${encodeURIComponent(slug)}`
}

export function isKnownCategory(slug: string): boolean {
  return CATEGORY_PAGES.has(slug)
}