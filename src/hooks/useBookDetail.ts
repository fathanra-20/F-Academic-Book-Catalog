import { useCallback, useEffect, useState } from 'react'
import { fetchBookDetail } from '../services/catalogService.ts'
import type { BookDetail } from '../types/catalog.ts'

interface DetailState {
  key: string
  book: BookDetail | null
  error: string | null
}

export interface FetchBookDetailResult {
  book: BookDetail | null
  isLoading: boolean
  error: string | null
  retry: () => void
}

const INITIAL_STATE: DetailState = {
  key: '',
  book: null,
  error: null,
}

export function useBookDetail(id: string | undefined): FetchBookDetailResult {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<DetailState>(INITIAL_STATE)
  const requestKey = id ? `${id}::${attempt}` : ''

  useEffect(() => {
    if (!id) return

    const controller = new AbortController()

    fetchBookDetail(id, controller.signal)
      .then((book) => {
        if (controller.signal.aborted) return
        setState({ key: requestKey, book, error: null })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const message =
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan tak terduga saat memuat detail buku.'
        setState({ key: requestKey, book: null, error: message })
      })

    return () => {
      controller.abort()
    }
  }, [id, requestKey])

  const retry = useCallback(() => {
    setAttempt((current) => current + 1)
  }, [])

  return {
    book: state.book,
    isLoading: Boolean(id) && state.key !== requestKey,
    error: id ? (state.key === requestKey ? state.error : null) : 'ID buku tidak valid.',
    retry,
  }
}
