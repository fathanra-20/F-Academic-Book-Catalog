import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext.ts'

function navLinkClass({ isActive }: { isActive: boolean }): string {
  return isActive ? 'nav-link is-active' : 'nav-link'
}

export function Navbar() {
  const { bookmarks } = useAppContext()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="site-header">
      <nav className="nav-container" aria-label="Navigasi utama">
        <Link className="nav-brand" to="/" onClick={closeMenu}>
          <span>Katalog Buku</span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="sr-only">
            {isMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          </span>
          <span className="nav-toggle-bar" aria-hidden="true" />
          <span className="nav-toggle-bar" aria-hidden="true" />
          <span className="nav-toggle-bar" aria-hidden="true" />
        </button>

        <ul className={`nav-links${isMenuOpen ? ' is-open' : ''}`} id="primary-navigation">
          <li>
            <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
              Beranda
            </NavLink>
          </li>
          <li>
            <NavLink to="/katalog" className={navLinkClass} onClick={closeMenu}>
              Katalog
            </NavLink>
          </li>
          <li>
            <NavLink to="/catatan" className={navLinkClass} onClick={closeMenu}>
              Catatan
              <span
                className="badge badge-solid bookmark-count"
                aria-label={`${bookmarks.length} buku tersimpan`}
              >
                {bookmarks.length}
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/tentang" className={navLinkClass} onClick={closeMenu}>
              Tentang
            </NavLink>
          </li>
          <li>
            <a
              className="nav-link nav-external"
              href="https://fathanra.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Profil Tugas 2
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
