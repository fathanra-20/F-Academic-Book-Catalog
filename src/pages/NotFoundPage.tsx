import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="card text-center" aria-labelledby="notfound-heading">
      <span className="eyebrow">404 · Route tidak dikenal</span>
      <h1 id="notfound-heading">Halaman tidak ditemukan</h1>
      <p className="lede">
        Alamat yang Anda buka tidak tersedia. Gunakan tautan di bawah untuk kembali menjelajah
        katalog.
      </p>
      <div className="divider" />
      <div className="row row--center">
        <Link className="btn btn-primary" to="/">
          Kembali ke Beranda
        </Link>
        <Link className="btn btn-outline" to="/katalog">
          Buka Katalog
        </Link>
      </div>
    </section>
  )
}
