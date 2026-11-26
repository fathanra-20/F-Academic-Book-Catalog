# Tugas Pertemuan 8

**Judul Aplikasi:** Katalog Buku Akademik & Referensi Kuliah (Open Library / Google Books Explorer)

**Teknologi Utama:** React, React Router (`react-router-dom`), Vite, TypeScript/JavaScript, CSS (Design System Tugas 2)

**Identitas Mahasiswa:** Fathan Rafif Athaya (`1247050044`)

## 1. Tujuan & Gambaran Aplikasi

Membangun aplikasi web multi-halaman menggunakan **React Router** yang mengambil data nyata dari **Public API** (contoh: *Open Library Search API* `https://openlibrary.org/search.json` atau *DummyJSON Products API* `https://dummyjson.com/products`), dilengkapi pengelolaan state terstruktur, pencarian, filter, sorting, pagination, dan form rekomendasi/catatan buku dengan validasi.

## 2. Arsitektur Routing (`react-router-dom`)

Menggunakan **Nested Routes** di dalam satu `MainLayout` agar *Navbar* dan *Footer* bergaya Tugas 2 selalu konsisten di setiap halaman tanpa reload penuh:

- `/` $\rightarrow$ **`HomePage`**: Ringkasan aplikasi, identitas mahasiswa, statistik katalog, dan akses cepat pencarian.

- `/katalog` $\rightarrow$ **`CatalogPage`**: Halaman utama eksplorasi data API (Search, Filter kategori, Sorting, Pagination, dan daftar item dalam card/tabel bersih).

- `/katalog/:id` $\rightarrow$ **`DetailPage`** (*Dynamic Route*): Menampilkan informasi lengkap item berdasarkan parameter `:id` pada URL, serta tombol "Simpan ke Daftar Bacaan / Favorit".

- `/catatan` $\rightarrow$ **`NotesPage`**: Halaman formulir interaktif (dengan validasi) untuk menambahkan rekomendasi buku/catatan kuliah lokal + daftar catatan tersimpan.

- `/tentang` $\rightarrow$ **`AboutPage`**: Halaman dokumentasi arsitektur aplikasi (penjelasan Routing, 5 jenis State Management, API Fetching, Custom Hook, dan struktur folder).

## 3. Implementasi 5 Jenis State Management

1. **Local State (`useState`):** Mengatur toggle menu mobile, status modal/konfirmasi, dan state UI lokal komponen.

2. **Global State (`Context API` - `BookmarkContext`):** Menyimpan daftar item favorit/bookmark dan catatan lokal mahasiswa agar bisa diakses di `CatalogPage`, `DetailPage`, dan badge counter di `Navbar`.

3. **Server State:** Mengelola data hasil fetch dari Public API beserta status `isLoading`, `error`, dan `isEmpty`.

4. **URL State (`useSearchParams`):** Menyimpan query pencarian (`?q=`), filter kategori (`&category=`), urutan (`&sort=`), dan halaman aktif (`&page=`) langsung di URL browser sehingga link bisa di-share atau di-refresh tanpa kehilangan filter.

5. **Form State:** Mengelola input dan pesan validasi pada formulir tambah rekomendasi/catatan di `NotesPage`.

## 4. Data Fetching & Pengelolaan Data

- **Service Layer (`src/services/api.ts`):** Memisahkan logika pemanggilan `fetch` / `axios` dari komponen UI.

- **UI States:**

  - **Loading State:** Menampilkan indikator loading/skeleton saat mengambil data dari API.

  - **Error State:** Menampilkan card pesan error yang ramah beserta tombol *Coba Lagi* jika API gagal diakses.

  - **Empty State:** Menampilkan pesan informatif jika hasil pencarian tidak ditemukan.

- **Fitur Pengelolaan Data:**

  - **Search:** Pencarian berdasarkan kata kunci.

  - **Filter:** Penyaringan berdasarkan kategori/subjek.

  - **Sorting:** Mengurutkan berdasarkan Judul (`A-Z` / `Z-A`) atau Tahun Terbit / Rating.

  - **Pagination:** Pembagian daftar data per halaman (misal 10 item per halaman) dengan tombol `Prev`, nomor halaman, dan `Next`.

## 5. Form & Validasi (`NotesPage`)

- Formulir menggunakan *controlled components* (Judul Referensi, Mata Kuliah Terkait, Penulis/Sumber, dan Catatan Ringkas).

- **Validasi Input:**

  - Semua kolom wajib diisi (*required*).

  - Panjang karakter minimum (misal: Judul minimal 5 karakter, Catatan minimal 15 karakter).

  - Menampilkan pesan error spesifik di bawah input jika tidak valid sebelum submit.

## 6. Struktur Folder Proyek (Separation of Concerns)

```
tugas-8/
├── index.html
├── package.json
└── src/
    ├── main.tsx
    ├── App.tsx                  # Konfigurasi BrowserRouter & Routes
    ├── index.css                # Token styling dari DESIGN.md
    ├── types/
    │   └── catalog.ts           # Type definitions
    ├── services/
    │   └── catalogService.ts    # Fungsi pemanggilan Public API
    ├── context/
    │   └── AppContext.tsx       # Global State (Bookmark & Catatan Lokal)
    ├── hooks/
    │   ├── useFetchCatalog.ts   # Custom hook untuk data fetching
    │   └── useDebounce.ts       # Custom hook untuk search input
    ├── components/              # Minimal 5 reusable components
    │   ├── MainLayout.tsx       # Wrapper Navbar + <Outlet /> + Footer
    │   ├── Navbar.tsx
    │   ├── Footer.tsx
    │   ├── CatalogCard.tsx
    │   ├── Pagination.tsx
    │   └── StatusFeedback.tsx   # Komponen Loading, Error, & Empty State
    └── pages/
        ├── HomePage.tsx
        ├── CatalogPage.tsx
        ├── DetailPage.tsx
        ├── NotesPage.tsx
        └── AboutPage.tsx
```

## 7. Checklist Pengumpulan

- \[ ] Semua route (termasuk dynamic route `/katalog/:id` dan nested route) berjalan tanpa full reload.

- \[ ] Parameter search, filter, sort, dan page tersinkronisasi dengan URL (`useSearchParams`).

- \[ ] Struktur folder rapi sesuai pemisahan tanggung jawab (`components`, `pages`, `hooks`, `services`, `context`).

- \[ ] Aplikasi di-deploy ke website pribadi (pastikan konfigurasi rewrite SPA pada hosting agar refresh di sub-route tidak `404`).

- \[ ] Ambil screenshot halaman utama, halaman detail, dan fitur interaktif untuk dikumpulkan ke LMS.