import { Link, useParams } from 'react-router-dom'
import { StatusFeedback } from '../components/StatusFeedback.tsx'
import { useAppContext } from '../context/useAppContext.ts'
import { useBookDetail } from '../hooks/useBookDetail.ts'
import { getCoverUrl } from '../services/catalogService.ts'

export function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const { book, isLoading, error, retry } = useBookDetail(id)
  const { isBookmarked, toggleBookmark } = useAppContext()

  const saved = book ? isBookmarked(book.key) : false
  const cover = book ? getCoverUrl(book.coverId, 'L') : null

  return (
    <section className="card" aria-labelledby="detail-heading">
      <div className="card-header">
        <div>
          <span className="eyebrow">Detail Buku · Dynamic Route</span>
          <h1 id="detail-heading">{book ? book.title : 'Detail Buku'}</h1>
        </div>
        <Link className="btn btn-sm btn-outline" to="/katalog">
          Kembali ke Katalog
        </Link>
      </div>

      {isLoading ? (
        <>
          <div className="detail-grid" aria-hidden="true">
            <div className="skeleton detail-cover-skeleton" />
            <div className="stack">
              <div className="skeleton skeleton-line skeleton-line--title" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line skeleton-line--short" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line skeleton-line--short" />
            </div>
          </div>
          <p className="sr-only" role="status">
            Memuat detail buku…
          </p>
        </>
      ) : error ? (
        <StatusFeedback
          variant="error"
          title="Detail buku gagal dimuat"
          message={error}
          onRetry={retry}
        />
      ) : book ? (
        <div className="detail-grid">
          <div>
            {cover ? (
              <img
                className="detail-cover"
                src={cover}
                alt={`Sampul ${book.title}`}
                width="220"
                height="330"
              />
            ) : (
              <div className="detail-cover detail-cover--empty" aria-hidden="true">
                {book.title}
              </div>
            )}
          </div>

          <div className="stack">
            <div className="row">
              <span className={`badge ${saved ? 'badge-solid' : 'badge-outline'}`}>
                {saved ? 'Tersimpan' : 'Belum tersimpan'}
              </span>
              {book.rating !== null && (
                <span className="badge badge-ghost">
                  ★ {book.rating.toFixed(1)} dari {book.ratingCount} ulasan
                </span>
              )}
            </div>

            <p className="lede">
              {book.authors.length > 0 ? book.authors.join(', ') : 'Penulis tidak diketahui'}
            </p>

            <dl className="docs-grid">
              <div className="docs-item">
                <dt>Tahun terbit</dt>
                <dd>{book.year ?? 'Tidak diketahui'}</dd>
              </div>
              <div className="docs-item">
                <dt>Edisi</dt>
                <dd>{book.editionCount > 0 ? `${book.editionCount} edisi` : 'Tidak tersedia'}</dd>
              </div>
              <div className="docs-item">
                <dt>Tanggal terbit</dt>
                <dd>{book.firstPublishDate || 'Tidak diketahui'}</dd>
              </div>
              <div className="docs-item">
                <dt>ID Open Library</dt>
                <dd>{book.id}</dd>
              </div>
            </dl>

            <div>
              <h2 className="section-heading">Deskripsi</h2>
              <p>{book.description}</p>
            </div>

            {book.subjects.length > 0 && (
              <div>
                <h2 className="section-heading">Subjek</h2>
                <ul className="tag-list">
                  {book.subjects.map((subject) => (
                    <li className="tag" key={subject}>
                      {subject}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="row">
              <button
                type="button"
                className={`btn ${saved ? 'btn-outline' : 'btn-primary'}`}
                onClick={() => toggleBookmark(book)}
              >
                {saved ? 'Hapus dari Daftar Bacaan' : 'Simpan ke Daftar Bacaan'}
              </button>
              <Link className="btn btn-outline" to={`/katalog?q=${encodeURIComponent(book.title)}`}>
                Cari Buku Serupa
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
