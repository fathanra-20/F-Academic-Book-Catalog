interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

function buildPageItems(current: number, total: number): Array<number | null> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const items: Array<number | null> = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) items.push(null)
  for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
    items.push(pageNumber)
  }
  if (end < total - 1) items.push(null)
  items.push(total)

  return items
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const items = buildPageItems(page, totalPages)

  return (
    <nav className="pagination" aria-label="Navigasi halaman katalog">
      <button
        type="button"
        className="page-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Sebelumnya
      </button>
      {items.map((item, index) =>
        item === null ? (
          <span key={`gap-${index}`} className="page-ellipsis" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={`page-btn${item === page ? ' is-active' : ''}`}
            aria-current={item === page ? 'page' : undefined}
            aria-label={`Halaman ${item}`}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        className="page-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Berikutnya
      </button>
    </nav>
  )
}
