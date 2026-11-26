import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext.ts'
import type { Note } from '../types/catalog.ts'

interface NoteFormValues {
  title: string
  course: string
  author: string
  body: string
}

type NoteFormErrors = Partial<Record<keyof NoteFormValues, string>>

const EMPTY_FORM: NoteFormValues = {
  title: '',
  course: '',
  author: '',
  body: '',
}

const FIELD_LABELS: Record<keyof NoteFormValues, string> = {
  title: 'Judul referensi',
  course: 'Mata kuliah',
  author: 'Penulis atau sumber',
  body: 'Catatan ringkas',
}

function validateField(field: keyof NoteFormValues, value: string): string | undefined {
  const trimmed = value.trim()

  if (!trimmed) return `${FIELD_LABELS[field]} wajib diisi.`
  if (field === 'title' && trimmed.length < 5) return 'Judul referensi minimal 5 karakter.'
  if (field === 'course' && trimmed.length < 3) return 'Mata kuliah minimal 3 karakter.'
  if (field === 'body' && trimmed.length < 15) return 'Catatan ringkas minimal 15 karakter.'

  return undefined
}

function validateForm(values: NoteFormValues): NoteFormErrors {
  const errors: NoteFormErrors = {}
  const fields = Object.keys(values) as Array<keyof NoteFormValues>

  fields.forEach((field) => {
    const message = validateField(field, values[field])
    if (message) errors[field] = message
  })

  return errors
}

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(date)
}

export function NotesPage() {
  const { bookmarks, notes, addNote, deleteNote, toggleBookmark, clearBookmarks } =
    useAppContext()
  const [values, setValues] = useState<NoteFormValues>(EMPTY_FORM)
  const [errors, setErrors] = useState<NoteFormErrors>({})
  const [success, setSuccess] = useState<string | null>(null)

  const handleChange =
    (field: keyof NoteFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value
      setValues((current) => ({ ...current, [field]: value }))
      setSuccess(null)

      setErrors((current) => {
        if (!current[field]) return current

        const next = { ...current }
        const message = validateField(field, value)
        if (message) next[field] = message
        else delete next[field]

        return next
      })
    }

  const handleBlur = (field: keyof NoteFormValues) => () => {
    const message = validateField(field, values[field])

    setErrors((current) => {
      const next = { ...current }
      if (message) next[field] = message
      else delete next[field]

      return next
    })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateForm(values)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setSuccess(null)
      return
    }

    addNote({
      title: values.title.trim(),
      course: values.course.trim(),
      author: values.author.trim(),
      body: values.body.trim(),
    })
    setValues(EMPTY_FORM)
    setErrors({})
    setSuccess('Catatan berhasil disimpan di perangkat ini.')
  }

  const handleDeleteNote = (note: Note) => {
    if (window.confirm(`Hapus catatan "${note.title}"?`)) {
      deleteNote(note.id)
    }
  }

  const handleClearBookmarks = () => {
    if (window.confirm('Hapus semua buku dari daftar bacaan?')) {
      clearBookmarks()
    }
  }

  return (
    <div className="notes-layout">
      <section className="card" aria-labelledby="note-form-heading">
        <div className="card-header">
          <div>
            <span className="eyebrow">Form State · Global State</span>
            <h2 id="note-form-heading">Tambah Catatan Referensi</h2>
            <p className="lede">
              Catatan disimpan lokal di browser Anda. Semua kolom wajib diisi sebelum data
              disimpan.
            </p>
          </div>
        </div>

        <form className="note-form" onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className={`field${errors.title ? ' has-error' : ''}`}>
              <label htmlFor="note-title">Judul referensi</label>
              <input
                id="note-title"
                type="text"
                value={values.title}
                onChange={handleChange('title')}
                onBlur={handleBlur('title')}
                placeholder="Contoh: Clean Code"
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? 'note-title-error' : 'note-title-hint'}
              />
              {errors.title ? (
                <p className="field-error" id="note-title-error">
                  {errors.title}
                </p>
              ) : (
                <p className="field-hint" id="note-title-hint">
                  Minimal 5 karakter.
                </p>
              )}
            </div>

            <div className={`field${errors.course ? ' has-error' : ''}`}>
              <label htmlFor="note-course">Mata kuliah</label>
              <input
                id="note-course"
                type="text"
                value={values.course}
                onChange={handleChange('course')}
                onBlur={handleBlur('course')}
                placeholder="Contoh: Pemrograman Aplikasi Web"
                aria-invalid={Boolean(errors.course)}
                aria-describedby={errors.course ? 'note-course-error' : 'note-course-hint'}
              />
              {errors.course ? (
                <p className="field-error" id="note-course-error">
                  {errors.course}
                </p>
              ) : (
                <p className="field-hint" id="note-course-hint">
                  Minimal 3 karakter.
                </p>
              )}
            </div>

            <div className={`field field--full${errors.author ? ' has-error' : ''}`}>
              <label htmlFor="note-author">Penulis atau sumber</label>
              <input
                id="note-author"
                type="text"
                value={values.author}
                onChange={handleChange('author')}
                onBlur={handleBlur('author')}
                placeholder="Contoh: Robert C. Martin"
                aria-invalid={Boolean(errors.author)}
                aria-describedby={errors.author ? 'note-author-error' : undefined}
              />
              {errors.author && (
                <p className="field-error" id="note-author-error">
                  {errors.author}
                </p>
              )}
            </div>

            <div className={`field field--full${errors.body ? ' has-error' : ''}`}>
              <label htmlFor="note-body">Catatan ringkas</label>
              <textarea
                id="note-body"
                value={values.body}
                onChange={handleChange('body')}
                onBlur={handleBlur('body')}
                placeholder="Tuliskan inti bacaan, alasan rekomendasi, atau halaman penting."
                aria-invalid={Boolean(errors.body)}
                aria-describedby={errors.body ? 'note-body-error' : 'note-body-hint'}
              />
              {errors.body ? (
                <p className="field-error" id="note-body-error">
                  {errors.body}
                </p>
              ) : (
                <p className="field-hint" id="note-body-hint">
                  Minimal 15 karakter.
                </p>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Simpan Catatan
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setValues(EMPTY_FORM)
                setErrors({})
                setSuccess(null)
              }}
            >
              Kosongkan
            </button>
          </div>

          {success && (
            <p className="success-text" role="status">
              <span className="badge badge-solid">Berhasil</span>
              {success}
            </p>
          )}
        </form>
      </section>

      <div className="stack">
        <section className="card card--compact" aria-labelledby="bookmarks-heading">
          <div className="card-header">
            <div>
              <span className="eyebrow">Global State · Context API</span>
              <h2 id="bookmarks-heading">Daftar Bacaan</h2>
              <p className="muted">{bookmarks.length} buku tersimpan</p>
            </div>
            {bookmarks.length > 0 && (
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={handleClearBookmarks}
              >
                Hapus Semua
              </button>
            )}
          </div>

          {bookmarks.length === 0 ? (
            <div className="empty-state">
              <h3>Belum ada buku tersimpan</h3>
              <p>
                Buka <Link to="/katalog">katalog</Link> lalu tekan Simpan pada kartu buku atau
                halaman detail.
              </p>
            </div>
          ) : (
            <ul className="bookmark-list">
              {bookmarks.map((book) => (
                <li className="bookmark-item" key={book.key}>
                  <div>
                    <Link to={`/katalog/${book.id}`}>{book.title}</Link>
                    <p>
                      {book.authors.length > 0
                        ? book.authors.join(', ')
                        : 'Penulis tidak diketahui'}
                      {book.year !== null ? ` · ${book.year}` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => toggleBookmark(book)}
                  >
                    Hapus
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card card--compact" aria-labelledby="notes-heading">
          <div className="card-header">
            <div>
              <span className="eyebrow">Global State · Persisten</span>
              <h2 id="notes-heading">Catatan Tersimpan</h2>
              <p className="muted">{notes.length} catatan lokal</p>
            </div>
          </div>

          {notes.length === 0 ? (
            <div className="empty-state">
              <h3>Belum ada catatan</h3>
              <p>Gunakan formulir di samping untuk menyimpan rekomendasi pertama Anda.</p>
            </div>
          ) : (
            <ul className="note-list">
              {notes.map((note) => (
                <li className="note-item" key={note.id}>
                  <div className="note-head">
                    <h3>{note.title}</h3>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteNote(note)}
                    >
                      Hapus
                    </button>
                  </div>
                  <p className="note-meta">
                    {note.course} · {note.author} · {formatDate(note.createdAt)}
                  </p>
                  <p>{note.body}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
