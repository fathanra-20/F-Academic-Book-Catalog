import { createContext } from 'react'
import type { Book, Note, NoteDraft } from '../types/catalog.ts'

export const BOOKMARK_STORAGE_KEY = 'paw8.bookmarks.v1'
export const NOTE_STORAGE_KEY = 'paw8.notes.v1'

export interface AppContextValue {
  bookmarks: Book[]
  notes: Note[]
  isBookmarked(key: string): boolean
  toggleBookmark(book: Book): void
  addNote(draft: NoteDraft): void
  deleteNote(id: string): void
  clearBookmarks(): void
}

export const AppContext = createContext<AppContextValue | null>(null)
