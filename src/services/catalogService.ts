import type { Book, BookDetail, CatalogResponse } from '../types/catalog.ts'

const SEARCH_ENDPOINT = 'https://openlibrary.org/search.json'
const WORKS_ENDPOINT = 'https://openlibrary.org/works'
const AUTHORS_ENDPOINT = 'https://openlibrary.org/authors'
const SEARCH_FIELDS =
  'key,title,author_name,first_publish_year,cover_i,edition_count,ratings_average,ratings_count,subject,language'
const DEFAULT_QUERY = 'subject:computer_science'
const FALLBACK_AUTHOR = 'Penulis tidak diketahui'
const NOT_FOUND_MESSAGE = 'Buku tidak ditemukan.'
const NETWORK_MESSAGE =
  'Tidak dapat terhubung ke Open Library. Periksa koneksi internet Anda lalu coba lagi.'
const SERVER_MESSAGE =
  'Open Library sedang tidak dapat diakses. Silakan coba beberapa saat lagi.'

export type CoverSize = 'S' | 'M' | 'L'

interface OpenLibraryDoc {
  key?: string
  title?: string
  author_name?: string[]
  first_publish_year?: number
  cover_i?: number
  edition_count?: number
  ratings_average?: number
  ratings_count?: number
  subject?: string[]
}

interface OpenLibrarySearchResponse {
  numFound?: number
  docs?: OpenLibraryDoc[]
}

interface OpenLibraryWork {
  title?: string
  description?: string | { value?: string }
  subjects?: string[]
  first_publish_date?: string
  covers?: number[]
  authors?: Array<{ author?: { key?: string } }>
}

interface OpenLibraryAuthor {
  name?: string
}

function isAbortError(error: unknown, signal?: AbortSignal): boolean {
  if (signal?.aborted) return true
  return error instanceof DOMException && error.name === 'AbortError'
}

async function request(
  url: string,
  signal?: AbortSignal,
  notFoundMessage = NOT_FOUND_MESSAGE,
): Promise<Response> {
  let response: Response
  try {
    response = await fetch(url, { signal })
  } catch (error) {
    if (isAbortError(error, signal)) throw error
    throw new Error(NETWORK_MESSAGE, { cause: error })
  }

  if (!response.ok) {
    if (response.status === 404) throw new Error(notFoundMessage)
    throw new Error(SERVER_MESSAGE)
  }

  return response
}

async function parseJson<T>(response: Response, signal?: AbortSignal): Promise<T> {
  try {
    return (await response.json()) as T
  } catch (error) {
    if (isAbortError(error, signal)) throw error
    throw new Error(SERVER_MESSAGE, { cause: error })
  }
}

export function buildSearchQuery(q: string, category: string): string {
  const keyword = q.trim()
  const subject = category.trim()

  if (subject) {
    return keyword ? `${keyword} subject:${subject}` : `subject:${subject}`
  }

  return keyword || DEFAULT_QUERY
}

export function buildSearchUrl(q: string, category: string): string {
  const params = new URLSearchParams({
    q: buildSearchQuery(q, category),
    fields: SEARCH_FIELDS,
    limit: '100',
    page: '1',
  })

  return `${SEARCH_ENDPOINT}?${params.toString()}`
}

export function getCoverUrl(coverId: number | null, size: CoverSize = 'M'): string | null {
  if (!coverId) return null
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
}

function toBook(doc: OpenLibraryDoc): Book | null {
  if (!doc.key || !doc.title) return null

  const id = doc.key.replace(/^\/works\//, '').replace(/\/+$/, '')
  if (!id) return null

  return {
    key: doc.key,
    id,
    title: doc.title,
    authors: doc.author_name?.filter((name) => name.trim().length > 0) ?? [],
    year: typeof doc.first_publish_year === 'number' ? doc.first_publish_year : null,
    coverId: typeof doc.cover_i === 'number' ? doc.cover_i : null,
    subjects: doc.subject?.slice(0, 8) ?? [],
    editionCount: doc.edition_count ?? 0,
    rating: typeof doc.ratings_average === 'number' ? doc.ratings_average : null,
    ratingCount: doc.ratings_count ?? 0,
  }
}

function normaliseDescription(description?: string | { value?: string }): string {
  if (typeof description === 'string' && description.trim()) return description.trim()
  if (description && typeof description === 'object' && description.value?.trim()) {
    return description.value.trim()
  }
  return 'Deskripsi belum tersedia untuk buku ini.'
}

async function resolveAuthors(keys: string[], signal?: AbortSignal): Promise<string[]> {
  const names = await Promise.all(
    keys.map(async (key) => {
      const authorId = key.replace(/^\/authors\//, '').replace(/\/+$/, '')
      if (!authorId) return null

      try {
        const response = await request(
          `${AUTHORS_ENDPOINT}/${encodeURIComponent(authorId)}.json`,
          signal,
        )
        const author = await parseJson<OpenLibraryAuthor>(response, signal)
        const name = author.name?.trim()
        return name ? name : null
      } catch (error) {
        if (isAbortError(error, signal)) throw error
        return null
      }
    }),
  )

  return names.filter((name): name is string => Boolean(name))
}

export async function fetchCatalog(
  { q, category }: { q: string; category: string },
  signal?: AbortSignal,
): Promise<CatalogResponse> {
  const response = await request(buildSearchUrl(q, category), signal, SERVER_MESSAGE)
  const data = await parseJson<OpenLibrarySearchResponse>(response, signal)
  const docs = Array.isArray(data.docs) ? data.docs : []
  const books = docs
    .map(toBook)
    .filter((book): book is Book => book !== null)

  return {
    books,
    total: typeof data.numFound === 'number' ? data.numFound : books.length,
  }
}

export async function fetchBookDetail(id: string, signal?: AbortSignal): Promise<BookDetail> {
  const workId = id.replace(/^\/?works\//, '').replace(/\/+$/, '')
  if (!workId) throw new Error(NOT_FOUND_MESSAGE)

  const response = await request(
    `${WORKS_ENDPOINT}/${encodeURIComponent(workId)}.json`,
    signal,
  )
  const work = await parseJson<OpenLibraryWork>(response, signal)

  const authorKeys = (work.authors ?? [])
    .map((entry) => entry.author?.key)
    .filter((key): key is string => Boolean(key))
    .slice(0, 3)
  const authors = await resolveAuthors(authorKeys, signal)

  const firstPublishDate = work.first_publish_date?.trim() ?? ''
  const yearMatch = /(\d{4})/.exec(firstPublishDate)
  const year = yearMatch ? Number(yearMatch[1]) : null
  const coverId =
    Array.isArray(work.covers) && typeof work.covers[0] === 'number' ? work.covers[0] : null

  return {
    key: `/works/${workId}`,
    id: workId,
    title: work.title?.trim() || 'Judul tidak tersedia',
    authors: authors.length > 0 ? authors : [FALLBACK_AUTHOR],
    year,
    coverId,
    subjects: work.subjects?.slice(0, 12) ?? [],
    editionCount: 0,
    rating: null,
    ratingCount: 0,
    description: normaliseDescription(work.description),
    firstPublishDate,
  }
}
