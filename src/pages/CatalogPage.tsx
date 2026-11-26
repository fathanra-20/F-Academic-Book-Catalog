import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CatalogCard } from '../components/CatalogCard.tsx'
import { Pagination } from '../components/Pagination.tsx'
import { StatusFeedback } from '../components/StatusFeedback.tsx'
import { CATEGORY_OPTIONS } from '../data/categories.ts'
import { useDebounce } from '../hooks/useDebounce.ts'
import { useFetchCatalog } from '../hooks/useFetchCatalog.ts'
import type { SortOption } from '../types/catalog.ts'

const PAGE_SIZE = 12

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'relevance', label: 'Relevansi' },
  { value: 'title-asc', label: 'Judul A–Z' },
  { value: 'title-desc', label: 'Judul Z–A' },
  { value: 'year-desc', label: 'Terbaru' },
  { value: 'year-asc', label: 'Terlama' },
  { value: 'rating-desc', label: 'Rating Tertinggi' },
]

interface CatalogParams {
  q: string
  category: string
  sort: SortOption
  page: number
}

function isSortOption(value: string): value is SortOption {
  return SORT_OPTIONS.some((option) => option.value === value)
}

function isCategoryValue(value: string): boolean {
  return CATEGORY_OPTIONS.some((option) => option.value === value)
}

function buildParams({ q, category, sort, page }: CatalogParams): URLSearchParams {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (category) params.set('category', category)
  if (sort !== 'relevance') params.set('sort', sort)
  if (page > 1) params.set('page', String(page))
  return params
}

function sortBooks<T extends { title: string; year: number | null; rating: number | null }>(
  books: T[],
  sort: SortOption,
): T[] {
  const list = [...books]

  switch (sort) {
    case 'title-asc':
      list.sort((a, b) => a.title.localeCompare(b.title, 'id'))
      break
    case 'title-desc':
      list.sort((a, b) => b.title.localeCompare(a.title, 'id'))
      break
    case 'year-desc':
      list.sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
      break
    case 'year-asc':
      list.sort(
        (a, b) =>
          (a.year ?? Number.MAX_SAFE_INTEGER) - (b.year ?? Number.MAX_SAFE_INTEGER),
      )
      break
    case 'rating-desc':
      list.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1))
      break
    default:
      break
  }

  return list
}

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const rawQ = searchParams.get('q') ?? ''
  const rawCategory = searchParams.get('category') ?? ''
  const category = isCategoryValue(rawCategory) ? rawCategory : ''
  const rawSort = searchParams.get('sort') ?? 'relevance'
  const sort = isSortOption(rawSort) ? rawSort : 'relevance'
  const rawPage = Number.parseInt(searchParams.get('page') ?? '1', 10)
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1

  const [draft, setDraft] = useState({ value: rawQ, base: rawQ })
  const searchValue = draft.base === rawQ ? draft.value : rawQ
  const debouncedSearch = useDebounce(searchValue, 400)
  const activeQuery = debouncedSearch.trim()

  const { books, total, isLoading, error, retry } = useFetchCatalog(activeQuery, category)

  useEffect(() => {
    const nextQuery = debouncedSearch.trim()
    if (nextQuery === rawQ) return
    if (nextQuery !== searchValue.trim()) return

    setSearchParams(buildParams({ q: nextQuery, category, sort, page: 1 }), {
      replace: true,
    })
  }, [debouncedSearch, rawQ, searchValue, category, sort, setSearchParams])

  const sortedBooks = useMemo(() => sortBooks(books, sort), [books, sort])

  const totalPages = Math.max(1, Math.ceil(sortedBooks.length / PAGE_SIZE))
  const currentPage = Math.min(Math.max(page, 1), totalPages)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const visibleBooks = sortedBooks.slice(startIndex, startIndex + PAGE_SIZE)
  const rangeStart = sortedBooks.length === 0 ? 0 : startIndex + 1
  const rangeEnd = Math.min(startIndex + PAGE_SIZE, sortedBooks.length)

  const updateCategory = (nextCategory: string) => {
    setSearchParams(buildParams({ q: rawQ, category: nextCategory, sort, page: 1 }), {
      replace: true,
    })
  }

  const updateSort = (nextSort: SortOption) => {
    setSearchParams(buildParams({ q: rawQ, category, sort: nextSort, page: 1 }), {
      replace: true,
    })
  }

  const updatePage = (nextPage: number) => {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages)
    setSearchParams(buildParams({ q: rawQ, category, sort, page: safePage }), {
      replace: true,
    })
  }

  const resetFilters = () => {
    setDraft({ value: '', base: '' })
    setSearchParams(new URLSearchParams(), { replace: true })
  }

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSearchParams(
      buildParams({ q: searchValue.trim(), category, sort, page: 1 }),
      { replace: true },
    )
  }

  const hasFilter = Boolean(rawQ || category)

  return (
    <>
      <section className="card card--compact catalog-toolbar" aria-labelledby="catalog-heading">
        <div className="card-header">
          <div>
            <span className="eyebrow">Server State · URL State</span>
            <h1 id="catalog-heading">Katalog Referensi Buku</h1>
            <p className="lede">
              Telusuri koleksi Open Library, saring berdasarkan subjek, lalu urutkan sesuai
              kebutuhan. Semua filter tersimpan di URL sehingga bisa dibagikan atau dimuat ulang.
            </p>
          </div>
          <span className="badge badge-outline">
            {total.toLocaleString('id-ID')} judul di Open Library
          </span>
        </div>

        <form className="search-row" role="search" onSubmit={handleSearchSubmit}>
          <div className="field">
            <label htmlFor="catalog-search">Kata kunci</label>
            <input
              id="catalog-search"
              type="search"
              value={searchValue}
              onChange={(event) => {
                setDraft({ value: event.target.value, base: rawQ })
              }}
              placeholder="Judul, penulis, atau subjek"
              autoComplete="off"
            />
            <span className="field-hint mobile-only">
              Pencarian berjalan otomatis setelah 400 ms.
            </span>
          </div>

          <div className="field">
            <label htmlFor="catalog-category">Kategori</label>
            <select
              id="catalog-category"
              value={category}
              onChange={(event) => updateCategory(event.target.value)}
            >
              <option value="">Semua Kategori</option>
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="catalog-sort">Urutkan</label>
            <select
              id="catalog-sort"
              value={sort}
              onChange={(event) => {
                const nextSort = event.target.value
                if (isSortOption(nextSort)) updateSort(nextSort)
              }}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="toolbar-group">
            <button type="button" className="btn btn-outline" onClick={resetFilters}>
              Reset
            </button>
          </div>
        </form>

        <div className="chip-group" aria-label="Filter kategori cepat">
          <button
            type="button"
            className={`chip${category === '' ? ' is-active' : ''}`}
            aria-pressed={category === ''}
            onClick={() => updateCategory('')}
          >
            Semua
          </button>
          {CATEGORY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`chip${category === option.value ? ' is-active' : ''}`}
              aria-pressed={category === option.value}
              onClick={() => updateCategory(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section aria-label="Hasil katalog" aria-busy={isLoading}>
        <div className="result-meta">
          <span>
            Menampilkan {rangeStart}–{rangeEnd} dari {sortedBooks.length} judul
          </span>
          <span>Total Open Library: {total.toLocaleString('id-ID')}</span>
        </div>

        {isLoading ? (
          <StatusFeedback
            variant="loading"
            title="Memuat katalog…"
            message="Mengambil data buku dari Open Library."
          />
        ) : error ? (
          <StatusFeedback
            variant="error"
            title="Katalog gagal dimuat"
            message={error}
            onRetry={retry}
          />
        ) : sortedBooks.length === 0 ? (
          <StatusFeedback
            variant="empty"
            title="Tidak ada buku yang cocok"
            message={
              hasFilter
                ? 'Coba kata kunci lain, ganti kategori, atau tekan Reset untuk melihat koleksi bawaan.'
                : 'Open Library tidak mengembalikan data untuk permintaan ini. Coba lagi sebentar.'
            }
          />
        ) : (
          <>
            <div className="book-grid">
              {visibleBooks.map((book) => (
                <CatalogCard key={book.key} book={book} />
              ))}
            </div>
            <Pagination page={currentPage} totalPages={totalPages} onPageChange={updatePage} />
          </>
        )}
      </section>
    </>
  )
}
