import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AppContext, BOOKMARK_STORAGE_KEY, NOTE_STORAGE_KEY } from './appContext.ts'
import type { AppContextValue } from './appContext.ts'
import type { Book, Note, NoteDraft } from '../types/catalog.ts'

function readStoredList<T>(key: string): T[] {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T[]) : []
  } catch {
    return []
  }
}

function writeStoredList<T>(key: string, value: T[]): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage bisa tidak tersedia (mode privat / kuota penuh); state tetap jalan di memori.
  }
}

function createNoteId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return Date.now().toString()
}

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const [bookmarks, setBookmarks] = useState<Book[]>(() =>
    readStoredList<Book>(BOOKMARK_STORAGE_KEY),
  )
  const [notes, setNotes] = useState<Note[]>(() => readStoredList<Note>(NOTE_STORAGE_KEY))

  useEffect(() => {
    writeStoredList(BOOKMARK_STORAGE_KEY, bookmarks)
  }, [bookmarks])

  useEffect(() => {
    writeStoredList(NOTE_STORAGE_KEY, notes)
  }, [notes])

  const isBookmarked = useCallback(
    (key: string) => bookmarks.some((book) => book.key === key),
    [bookmarks],
  )

  const toggleBookmark = useCallback((book: Book) => {
    setBookmarks((current) => {
      if (current.some((item) => item.key === book.key)) {
        return current.filter((item) => item.key !== book.key)
      }

      return [book, ...current]
    })
  }, [])

  const addNote = useCallback((draft: NoteDraft) => {
    const note: Note = {
      ...draft,
      id: createNoteId(),
      createdAt: new Date().toISOString(),
    }

    setNotes((current) => [note, ...current])
  }, [])

  const deleteNote = useCallback((id: string) => {
    setNotes((current) => current.filter((note) => note.id !== id))
  }, [])

  const clearBookmarks = useCallback(() => {
    setBookmarks([])
  }, [])

  const value = useMemo<AppContextValue>(
    () => ({
      bookmarks,
      notes,
      isBookmarked,
      toggleBookmark,
      addNote,
      deleteNote,
      clearBookmarks,
    }),
    [bookmarks, notes, isBookmarked, toggleBookmark, addNote, deleteNote, clearBookmarks],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
