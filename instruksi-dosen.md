# Tugas Pertemuan 8
## Materi: React Routing, State Management, Data Fetching, dan Application Architecture

**Jenis Tugas:** Individu

**Teknologi:** React, React Router, Vite, JavaScript/TypeScript

### Deskripsi Tugas

Setiap mahasiswa diminta membuat **aplikasi web interaktif menggunakan React** yang mengambil dan menampilkan data dari API.

Mahasiswa bebas memilih tema aplikasi, misalnya:

- Katalog produk.
- Katalog buku.
- Daftar film.
- Direktori mahasiswa.
- Dashboard informasi.

Aplikasi harus memiliki beberapa halaman, fitur pencarian dan pengelolaan data, serta struktur kode yang rapi.

**Aplikasi wajib diunggah dan ditampilkan pada website pribadi masing-masing mahasiswa.**

### Ketentuan Tugas

**1. Routing dan Navigasi**

Aplikasi wajib menggunakan React Router dengan ketentuan:

- Memiliki minimal 3 halaman.
- Menggunakan client-side routing.
- Menggunakan dynamic route, contohnya `/produk/1`.
- Menggunakan nested route (halaman di dalam layout/route utama).
- Memiliki navigasi antarmenu tanpa reload halaman penuh.

**2. State Management**

Terapkan beberapa jenis state:

- **Local State:** Mengatur kondisi komponen, misalnya membuka/menutup menu.
- **Global State:** Menggunakan Context API untuk berbagi data antarkomponen.
- **Server State:** Mengelola data yang diperoleh dari API.
- **URL State:** Menyimpan parameter pencarian, filter, atau halaman pada URL.
- **Form State:** Mengelola nilai input formulir.

**3. Data Fetching dan API**

- Mengambil data dari public API menggunakan `fetch` atau Axios.
- Menampilkan data API pada halaman aplikasi.
- Menampilkan indikator loading saat mengambil data.
- Menampilkan pesan error jika pengambilan data gagal.
- Menampilkan pesan ketika data kosong (*empty state*).
- Memisahkan kode pemanggilan API ke dalam folder `services`.

**4. Fitur Pencarian dan Pengelolaan Data**

Aplikasi wajib memiliki:

- **Search:** Mencari data berdasarkan kata kunci.
- **Filter:** Menyaring data berdasarkan kategori atau status.
- **Sorting:** Mengurutkan data berdasarkan nama, harga, atau atribut lainnya.
- **Pagination:** Membagi data menjadi beberapa halaman.
- **Detail:** Menampilkan informasi lengkap data berdasarkan ID pada URL.

**5. Form dan Validasi**

- Membuat minimal satu formulir interaktif.
- Menggunakan controlled components.
- Melakukan validasi input, misalnya kolom wajib diisi atau panjang karakter minimum.
- Menampilkan pesan ketika input tidak valid.

Formulir dapat digunakan untuk menambahkan catatan atau data lokal. Tidak wajib menyimpan data ke server jika API tidak mendukungnya.

**6. Struktur dan Kualitas Kode**

Aplikasi wajib menerapkan:

- Minimal 5 reusable components.
- Minimal 1 custom hook.
- Context API.
- Folder terpisah untuk `components`, `pages`, `hooks`, `services`, dan `context`.
- Separation of concerns, yaitu memisahkan tampilan, logika aplikasi, dan akses API.

### Pengumpulan Tugas

Mahasiswa wajib mengumpulkan:

1. **Link website pribadi** yang menampilkan aplikasi React.
2. **Link repository GitHub** berisi source code.
3. **Screenshot** halaman utama, detail data, dan fitur interaktif.
4. **Penjelasan singkat** mengenai routing, state management, API, custom hooks, dan struktur folder yang digunakan.

### Penilaian

| Komponen                                                 | Nilai   |
| -------------------------------------------------------- | ------- |
| Routing dan navigasi                                     | 20      |
| State management dan Context API                         | 20      |
| Data fetching dan penanganan loading/error/empty         | 20      |
| Search, filter, sorting, pagination, dan form validation | 20      |
| Custom hooks, reusable components, dan struktur kode     | 10      |
| Publikasi website dan GitHub                             | 10      |
| **Total**                                                | **100** |