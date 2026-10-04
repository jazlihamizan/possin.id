# Possin – Website Pemasaran (possin.id)

Situs statis tanpa framework dan tanpa build step. File bersama: `style.css`, `script.js`.

## Cara menambah artikel baru

1. Salin template:
   - Copy `blog/_template-artikel.html` menjadi folder baru `blog/<slug>/index.html`.
   - Contoh: slug `cara-memilih-aplikasi-kasir-untuk-restoran-kecil` → `blog/cara-memilih-aplikasi-kasir-untuk-restoran-kecil/index.html`.
2. Ganti isi di file artikel baru:
   - `<title>`, `meta description`, `link canonical` (`https://possin.id/blog/<slug>/`).
   - JSON-LD `Article`: `headline`, `description`, `datePublished` (format `YYYY-MM-DD`, isi saat terbit, bukan sebelumnya), `mainEntityOfPage`.
   - Crumbs kategori, `h1`, baris meta (`tanggal · menit baca · kategori · Tim Possin`), dan `.article-body`.
   - Author selalu `Tim Possin` (jangan pakai nama pribadi).
3. Tambah satu kartu di `blog/index.html` dalam `.post-grid`:
   - `<a class="post-card" href="/blog/<slug>/" data-cat="<kategori-kecil>">` berisi `.thumb` (dengan `.cat` nama kategori) + `.body` (h2 + `.excerpt`). Semua kartu ukurannya sama, tanpa tulisan tanggal/waktu baca.
   - `data-cat` wajib diisi salah satu dari: `panduan`, `perbandingan`, `stok`, `keuangan` — supaya tombol filter kategori di atas grid berfungsi. Kalau kategori baru, tambah tombol `.filter-btn` baru dengan `data-filter` yang sama.
4. Cek lokal sebelum deploy:
   - `python3 -m http.server 8000` lalu buka `http://localhost:8000/blog/` dan `http://localhost:8000/blog/<slug>/`.

## Aturan noindex + sitemap

- Halaman kerangka yang belum jadi memakai `<meta name="robots" content="noindex">` dan **tidak boleh masuk sitemap** (kalau nanti ada `sitemap.xml`, daftarkan hanya artikel yang sudah jadi, contoh yang sudah jadi: `/blog/aplikasi-kasir-murah-dan-bagus/`).
- Saat artikel kerangka sudah ditulis lengkap: hapus baris `noindex` tersebut, isi `datePublished` + tanggal/waktu baca yang sebenarnya di halaman artikel, lalu baru masukkan URL-nya ke sitemap.
