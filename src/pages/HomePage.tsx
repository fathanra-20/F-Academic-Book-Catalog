import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext.ts'
import { CATEGORY_OPTIONS } from '../data/categories.ts'

export function HomePage() {
  const { bookmarks, notes } = useAppContext()
  const navigate = useNavigate()
  const [quickQuery, setQuickQuery] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = quickQuery.trim()

    navigate(query ? `/katalog?q=${encodeURIComponent(query)}` : '/katalog')
  }

  return (
    <>
      <section className="card" aria-labelledby="home-heading">
        <div className="card-header">
          <div>
            <span className="eyebrow">Tugas Pertemuan 8 · React Router 7</span>
            <h1 id="home-heading">Katalog Referensi Buku Akademik</h1>
            <p className="lede">
              Aplikasi multi-halaman untuk menelusuri koleksi Open Library, menyimpan daftar
              bacaan, dan mencatat rekomendasi mata kuliah. Dibangun dengan React 19, Vite,
              TypeScript, React Router, dan Context API.
            </p>
          </div>
          <span className="badge badge-solid">Open Library API</span>
        </div>

        <dl className="docs-grid">
          <div className="docs-item">
            <dt>Nama</dt>
            <dd>Fathan Rafif Athaya</dd>
          </div>
          <div className="docs-item">
            <dt>NIM</dt>
            <dd>1247050044</dd>
          </div>
          <div className="docs-item">
            <dt>Program Studi</dt>
            <dd>S1 Teknik Informatika</dd>
          </div>
          <div className="docs-item">
            <dt>Semester</dt>
            <dd>Semester 5</dd>
          </div>
          <div className="docs-item">
            <dt>Kampus</dt>
            <dd>UIN Sunan Gunung Djati Bandung</dd>
          </div>
          <div className="docs-item">
            <dt>Mata Kuliah</dt>
            <dd>Pemrograman Aplikasi Web</dd>
          </div>
        </dl>
      </section>

      <section className="card" aria-labelledby="home-stats-heading">
        <h2 id="home-stats-heading" className="section-heading">
          Ringkasan
        </h2>
        <p className="lede">
          Angka berikut dihitung langsung dari global state (Context API) dan konfigurasi route.
        </p>
        <div className="divider" />
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-value">{bookmarks.length}</span>
            <span className="stat-label">Buku Tersimpan</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{notes.length}</span>
            <span className="stat-label">Catatan Lokal</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">5</span>
            <span className="stat-label">Halaman</span>
          </div>
        </div>
        <div className="divider" />
        <div className="row">
          <Link className="btn btn-primary" to="/katalog">
            Buka Katalog
          </Link>
          <Link className="btn btn-outline" to="/catatan">
            Tulis Catatan
          </Link>
        </div>
      </section>

      <section className="card" aria-labelledby="home-search-heading">
        <h2 id="home-search-heading" className="section-heading">
          Pencarian cepat
        </h2>
        <p className="lede">
          Kata kunci diteruskan ke halaman katalog melalui URL state sehingga hasilnya bisa
          dibagikan.
        </p>
        <div className="divider" />
        <form className="home-search" role="search" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="home-search-input">Kata kunci</label>
            <input
              id="home-search-input"
              type="search"
              value={quickQuery}
              onChange={(event) => setQuickQuery(event.target.value)}
              placeholder="Contoh: machine learning"
              autoComplete="off"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Cari di Katalog
          </button>
        </form>

        <div className="divider" />
        <h3 className="section-heading">Jelajahi kategori</h3>
        <div className="chip-group">
          {CATEGORY_OPTIONS.map((option) => (
            <Link
              key={option.value}
              className="chip"
              to={`/katalog?category=${option.value}`}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="card" aria-labelledby="home-state-heading">
        <h2 id="home-state-heading" className="section-heading">
          Lima jenis state
        </h2>
        <p className="lede">
          Setiap jenis state dipakai pada fitur yang berbeda agar tampilan, logika, dan akses API
          tetap terpisah.
        </p>
        <div className="divider" />
        <dl className="docs-grid">
          <div className="docs-item">
            <dt>Local State</dt>
            <dd>Menu mobile Navbar, draft pencarian, dan status UI komponen.</dd>
          </div>
          <div className="docs-item">
            <dt>Global State</dt>
            <dd>Bookmark dan catatan lokal lewat AppContext + localStorage.</dd>
          </div>
          <div className="docs-item">
            <dt>Server State</dt>
            <dd>useFetchCatalog dan useBookDetail mengelola loading, error, dan data.</dd>
          </div>
          <div className="docs-item">
            <dt>URL State</dt>
            <dd>q, category, sort, dan page tersimpan di useSearchParams.</dd>
          </div>
          <div className="docs-item">
            <dt>Form State</dt>
            <dd>Formulir catatan dengan validasi per kolom di NotesPage.</dd>
          </div>
        </dl>
      </section>
    </>
  )
}
