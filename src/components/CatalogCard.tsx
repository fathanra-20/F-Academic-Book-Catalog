import { Link } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext.ts'
import { getCoverUrl } from '../services/catalogService.ts'
import type { Book } from '../types/catalog.ts'

interface CatalogCardProps {
  book: Book
}

export function CatalogCard({ book }: CatalogCardProps) {
  const { isBookmarked, toggleBookmark } = useAppContext()
  const saved = isBookmarked(book.key)
  const cover = getCoverUrl(book.coverId, 'M')
  const authors =
    book.authors.length > 0 ? book.authors.join(', ') : 'Penulis tidak diketahui'

  return (
    <article className="book-card">
      {cover ? (
        <img
          className="book-cover"
          src={cover}
          alt=""
          loading="lazy"
          width="210"
          height="315"
        />
      ) : (
        <span className="book-cover book-cover--empty" aria-hidden="true">
          {book.title}
        </span>
      )}
      <div className="book-card-body">
        <h3>
          <Link to={`/katalog/${book.id}`}>{book.title}</Link>
        </h3>
        <p className="book-authors" title={authors}>
          {authors}
        </p>
        <div className="book-meta">
          <span>{book.year ?? 'Tahun tidak diketahui'}</span>
          <span>{book.editionCount > 0 ? `${book.editionCount} edisi` : 'Edisi tidak tersedia'}</span>
          {book.rating !== null && (
            <span>
              ★ {book.rating.toFixed(1)} ({book.ratingCount})
            </span>
          )}
        </div>
        <div className="book-actions">
          <button
            type="button"
            className={`btn btn-sm ${saved ? 'btn-primary' : 'btn-outline'}`}
            aria-pressed={saved}
            onClick={() => toggleBookmark(book)}
          >
            {saved ? 'Tersimpan' : 'Simpan'}
          </button>
          <Link className="btn btn-sm btn-outline" to={`/katalog/${book.id}`}>
            Lihat Detail
          </Link>
        </div>
      </div>
    </article>
  )
}
