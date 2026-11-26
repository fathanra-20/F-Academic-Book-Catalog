export interface Book {
  key: string
  id: string
  title: string
  authors: string[]
  year: number | null
  coverId: number | null
  subjects: string[]
  editionCount: number
  rating: number | null
  ratingCount: number
}

export interface BookDetail extends Book {
  description: string
  firstPublishDate: string
}

export interface CatalogResponse {
  books: Book[]
  total: number
}

export type SortOption =
  | 'relevance'
  | 'title-asc'
  | 'title-desc'
  | 'year-desc'
  | 'year-asc'
  | 'rating-desc'

export interface Note {
  id: string
  title: string
  course: string
  author: string
  body: string
  createdAt: string
}

export type NoteDraft = Omit<Note, 'id' | 'createdAt'>
