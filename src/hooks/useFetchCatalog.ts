import { useCallback, useEffect, useState } from 'react'
import { fetchCatalog } from '../services/catalogService.ts'
import type { Book } from '../types/catalog.ts'

interface CatalogState {
  key: string
  books: Book[]
  total: number
  error: string | null
}

export interface FetchCatalogResult {
  books: Book[]
  total: number
  isLoading: boolean
  error: string | null
  retry: () => void
}

const INITIAL_STATE: CatalogState = {
  key: '',
  books: [],
  total: 0,
  error: null,
}

export function useFetchCatalog(q: string, category: string): FetchCatalogResult {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<CatalogState>(INITIAL_STATE)
  const requestKey = `${q}::${category}::${attempt}`

  useEffect(() => {
    const controller = new AbortController()

    fetchCatalog({ q, category }, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return
        setState({ key: requestKey, books: data.books, total: data.total, error: null })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const message =
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan tak terduga saat memuat katalog.'
        setState({ key: requestKey, books: [], total: 0, error: message })
      })

    return () => {
      controller.abort()
    }
  }, [q, category, requestKey])

  const retry = useCallback(() => {
    setAttempt((current) => current + 1)
  }, [])

  return {
    books: state.books,
    total: state.total,
    isLoading: state.key !== requestKey,
    error: state.key === requestKey ? state.error : null,
    retry,
  }
}
