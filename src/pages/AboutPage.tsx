const FOLDER_TREE = `tugas-pertemuan-8/
├── index.html
├── vercel.json
├── package.json
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── types/
    │   └── catalog.ts
    ├── data/
    │   └── categories.ts
    ├── services/
    │   └── catalogService.ts
    ├── context/
    │   ├── appContext.ts
    │   ├── AppContext.tsx
    │   └── useAppContext.ts
    ├── hooks/
    │   ├── useDebounce.ts
    │   ├── useFetchCatalog.ts
    │   └── useBookDetail.ts
    ├── components/
    │   ├── MainLayout.tsx
    │   ├── Navbar.tsx
    │   ├── Footer.tsx
    │   ├── CatalogCard.tsx
    │   ├── Pagination.tsx
    │   └── StatusFeedback.tsx
    └── pages/
        ├── HomePage.tsx
        ├── CatalogPage.tsx
        ├── DetailPage.tsx
        ├── NotesPage.tsx
        ├── AboutPage.tsx
        └── NotFoundPage.tsx`

export function AboutPage() {
  return (
    <>
      <section className="card" aria-labelledby="about-heading">
        <span className="eyebrow">Dokumentasi Aplikasi</span>
        <h1 id="about-heading">Tentang Proyek Ini</h1>
        <p className="lede">
          Katalog Referensi Buku Akademik adalah tugas Pertemuan 8 mata kuliah Pemrograman
          Aplikasi Web. Aplikasi memakai React Router untuk navigasi tanpa reload penuh, Context
          API untuk state global, dan Open Library Public API sebagai sumber data nyata.
        </p>
      </section>

      <section className="card" aria-labelledby="about-routes">
        <h2 id="about-routes" className="section-heading">
          Peta route
        </h2>
        <p className="lede">
          Semua halaman berada di dalam satu <code>MainLayout</code> sebagai nested route,
          sehingga Navbar dan Footer tetap konsisten.
        </p>
        <div className="divider" />
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Path</th>
                <th scope="col">Halaman</th>
                <th scope="col">Fungsi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>/</code>
                </td>
                <td>HomePage</td>
                <td>Identitas, ringkasan statistik, pencarian cepat, dan tautan kategori.</td>
              </tr>
              <tr>
                <td>
                  <code>/katalog</code>
                </td>
                <td>CatalogPage</td>
                <td>Pencarian, filter kategori, sorting, dan pagination data API.</td>
              </tr>
              <tr>
                <td>
                  <code>/katalog/:id</code>
                </td>
                <td>DetailPage</td>
                <td>Dynamic route berisi detail buku dan tombol simpan ke daftar bacaan.</td>
              </tr>
              <tr>
                <td>
                  <code>/catatan</code>
                </td>
                <td>NotesPage</td>
                <td>Formulir validasi catatan, daftar catatan, dan daftar bacaan.</td>
              </tr>
              <tr>
                <td>
                  <code>/tentang</code>
                </td>
                <td>AboutPage</td>
                <td>Dokumentasi arsitektur, state, API, hooks, dan struktur folder.</td>
              </tr>
              <tr>
                <td>
                  <code>*</code>
                </td>
                <td>NotFoundPage</td>
                <td>Halaman 404 untuk alamat yang tidak dikenal.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="card" aria-labelledby="about-state">
        <h2 id="about-state" className="section-heading">
          Lima jenis state management
        </h2>
        <div className="divider" />
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Jenis</th>
                <th scope="col">Implementasi</th>
                <th scope="col">Lokasi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Local State</td>
                <td>Toggle menu mobile, draft input pencarian, status form.</td>
                <td>
                  <code>Navbar.tsx</code>, <code>CatalogPage.tsx</code>,{' '}
                  <code>NotesPage.tsx</code>
                </td>
              </tr>
              <tr>
                <td>Global State</td>
                <td>Bookmark dan catatan lokal, dipakai lintas halaman.</td>
                <td>
                  <code>context/AppContext.tsx</code>
                </td>
              </tr>
              <tr>
                <td>Server State</td>
                <td>Data API dengan status loading, error, dan retry.</td>
                <td>
                  <code>hooks/useFetchCatalog.ts</code>, <code>hooks/useBookDetail.ts</code>
                </td>
              </tr>
              <tr>
                <td>URL State</td>
                <td>Parameter q, category, sort, dan page pada alamat browser.</td>
                <td>
                  <code>CatalogPage.tsx</code> via <code>useSearchParams</code>
                </td>
              </tr>
              <tr>
                <td>Form State</td>
                <td>Controlled input dengan validasi per kolom.</td>
                <td>
                  <code>NotesPage.tsx</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="card" aria-labelledby="about-api">
        <h2 id="about-api" className="section-heading">
          Endpoint API
        </h2>
        <p className="lede">
          Semua permintaan memakai <code>fetch</code> di layer service dan mendukung{' '}
          <code>AbortSignal</code> agar permintaan lama dibatalkan saat filter berubah.
        </p>
        <div className="divider" />
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Endpoint</th>
                <th scope="col">Kegunaan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>openlibrary.org/search.json?q=…&amp;fields=…&amp;limit=100&amp;page=1</code>
                </td>
                <td>Pencarian katalog beserta metadata ringkas.</td>
              </tr>
              <tr>
                <td>
                  <code>openlibrary.org/works/&#123;id&#125;.json</code>
                </td>
                <td>Detail karya: deskripsi, subjek, tanggal terbit, daftar penulis.</td>
              </tr>
              <tr>
                <td>
                  <code>openlibrary.org/authors/&#123;id&#125;.json</code>
                </td>
                <td>Nama penulis (maksimal tiga, dijalankan paralel).</td>
              </tr>
              <tr>
                <td>
                  <code>covers.openlibrary.org/b/id/&#123;coverId&#125;-M.jpg</code>
                </td>
                <td>Sampul buku; varian <code>-L</code> dipakai di halaman detail.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="divider" />
        <div className="docs-grid">
          <div className="docs-item">
            <dt>Kueri bawaan</dt>
            <dd>
              Tanpa kata kunci dan kategori, aplikasi memakai{' '}
              <code>subject:computer_science</code> agar permintaan selalu valid.
            </dd>
          </div>
          <div className="docs-item">
            <dt>Filter kategori</dt>
            <dd>
              Kategori ditambahkan sebagai <code>subject:&lt;slug&gt;</code> pada parameter{' '}
              <code>q</code>.
            </dd>
          </div>
          <div className="docs-item">
            <dt>Penanganan error</dt>
            <dd>
              Respons non-OK dan kegagalan jaringan diubah menjadi pesan berbahasa Indonesia yang
              ramah.
            </dd>
          </div>
          <div className="docs-item">
            <dt>Empty state</dt>
            <dd>
              Jika hasil kosong, pengguna mendapat saran mengganti kata kunci atau mereset filter.
            </dd>
          </div>
        </div>
      </section>

      <section className="card" aria-labelledby="about-hooks">
        <h2 id="about-hooks" className="section-heading">
          Custom hooks
        </h2>
        <div className="divider" />
        <dl className="docs-grid">
          <div className="docs-item">
            <dt>useDebounce</dt>
            <dd>
              Menunda perubahan nilai (400 ms) agar permintaan API tidak dikirim pada setiap
              ketikan.
            </dd>
          </div>
          <div className="docs-item">
            <dt>useFetchCatalog</dt>
            <dd>
              Mengambil katalog dengan <code>AbortController</code>, mengembalikan{' '}
              <code>books</code>, <code>total</code>, <code>isLoading</code>,{' '}
              <code>error</code>, dan <code>retry</code>.
            </dd>
          </div>
          <div className="docs-item">
            <dt>useBookDetail</dt>
            <dd>
              Mengambil detail satu buku berdasarkan ID, dengan pola loading/error/retry yang
              sama.
            </dd>
          </div>
          <div className="docs-item">
            <dt>useAppContext</dt>
            <dd>
              Membungkus <code>useContext</code> dan melempar error jelas bila dipakai di luar
              provider.
            </dd>
          </div>
        </dl>
      </section>

      <section className="card" aria-labelledby="about-structure">
        <h2 id="about-structure" className="section-heading">
          Struktur folder
        </h2>
        <p className="lede">
          Pemisahan tanggung jawab: tampilan di <code>components</code> dan{' '}
          <code>pages</code>, logika data di <code>hooks</code>, akses API di{' '}
          <code>services</code>, serta state global di <code>context</code>.
        </p>
        <div className="divider" />
        <pre className="code-block">{FOLDER_TREE}</pre>
      </section>

      <section className="card" aria-labelledby="about-design">
        <h2 id="about-design" className="section-heading">
          Catatan design system
        </h2>
        <p className="lede">
          Antarmuka mengikuti DESIGN.md: palet monokrom empat warna (#030303, #000000, #FFFFFF,
          #F3F3F3), kartu putih di atas latar abu terang, sudut membulat, serta tipografi tebal
          untuk judul. Sampul buku diberi filter <code>grayscale(1) contrast(1.05)</code> agar
          tetap berada dalam palet.
        </p>
        <div className="divider" />
        <div className="docs-grid">
          <div className="docs-item">
            <dt>Komponen reusable</dt>
            <dd>
              MainLayout, Navbar, Footer, CatalogCard, Pagination, dan StatusFeedback.
            </dd>
          </div>
          <div className="docs-item">
            <dt>Aksesibilitas</dt>
            <dd>
              Skip link, <code>aria-expanded</code> pada menu, <code>aria-current</code> pada
              pagination, dan label pada setiap input.
            </dd>
          </div>
          <div className="docs-item">
            <dt>Responsivitas</dt>
            <dd>
              Grid buku 4/2/1 kolom, menu mobile, dan tabel yang dapat digulir horizontal.
            </dd>
          </div>
          <div className="docs-item">
            <dt>Deployment</dt>
            <dd>
              <code>vercel.json</code> menulis ulang semua path ke <code>index.html</code> agar
              sub-route tetap bekerja saat refresh.
            </dd>
          </div>
        </div>
      </section>
    </>
  )
}
