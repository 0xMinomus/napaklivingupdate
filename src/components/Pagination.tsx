import type { MouseEvent, ReactElement } from 'react'

interface PaginationProps {
  page: number
  totalPages: number
  onPage: (page: number) => void
}

export default function Pagination({ page, totalPages, onPage }: PaginationProps): ReactElement | null {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  const handle = (e: MouseEvent<HTMLAnchorElement>, target: number): void => {
    e.preventDefault()
    onPage(target)
  }

  return (
    <nav className="catalog-pagination" aria-label="Pagination">
      {pages.map((p) => (
        <a
          key={p}
          href="#catalog"
          aria-current={p === page ? 'page' : undefined}
          onClick={(e) => handle(e, p)}
        >
          {p}
        </a>
      ))}
      {page < totalPages && (
        <a href="#catalog" aria-label="Next page" onClick={(e) => handle(e, page + 1)}>
          →
        </a>
      )}
    </nav>
  )
}