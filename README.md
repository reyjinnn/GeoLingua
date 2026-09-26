# GeoLingua Frontend

GeoLingua adalah platform pembelajaran bahasa inovatif yang dirancang untuk membantu pengguna menguasai bahasa baru secara efektif melalui siklus belajar yang terstruktur: **Learn → Drill → Write → Quiz**. Proyek ini merupakan repositori frontend yang dibangun menggunakan fondasi modern React 18, TypeScript, dan Vite untuk memberikan pengalaman pengguna yang interaktif, cepat, dan responsif.

Struktur dan pengembangan proyek ini mengikuti dokumen-dokumen utama berikut:
- [Technical Architecture]
- [API Specification]
- [UI/UX Specification]

## Menjalankan Proyek Secara Lokal

Untuk memulai pengembangan di komputer lokal Anda, jalankan perintah berikut:

```bash
pnpm install
pnpm dev
```

### Menghubungkan ke Backend Lokal

Untuk menghubungkan frontend dengan backend lokal, Anda perlu mengatur environment variables:
1. Salin berkas `.env.example` menjadi `.env.local`. 
   Di PowerShell, gunakan perintah: `Copy-Item .env.example .env.local`
2. Jalankan backend dari folder `../backend-GeoLingua` menggunakan perintah: `php -S localhost:8000 index.php`

**Catatan:** Backend saat ini baru menyediakan endpoint `/api/health`. Rute untuk autentikasi, kurikulum, dan latihan di frontend telah disiapkan, namun halaman yang membutuhkan endpoint tersebut akan menampilkan pesan error API hingga backend selesai diimplementasikan.

## Struktur Direktori

Proyek ini disusun dengan struktur modular sebagai berikut:
- `src/api/`: Wrapper untuk fungsi `fetch` dan definisi kontrak endpoint API.
- `src/types/`: Definisi tipe data dan antarmuka (TypeScript interfaces/types) untuk payload API.
- `src/context/`, `src/hooks/`: Manajemen state global (seperti sesi login) dan logika khusus terkait preferensi belajar pengguna.
- `src/routes/`: Konfigurasi rute navigasi aplikasi (publik, pembelajar, dan admin) yang dilengkapi dengan *route guards*.
- `src/pages/`: Komponen halaman utama yang mewakili alur inti aplikasi; halaman yang masih dalam tahap pengembangan akan menampilkan status persiapan.
- `src/components/`: Kumpulan elemen antarmuka (UI) yang dapat digunakan kembali (*reusable components*).
- `src/utils/`: Fungsi utilitas pendukung seperti penyimpanan token otorisasi dan validasi teks.

## Perintah Pengembangan

- `pnpm build`: Memeriksa *type safety* (TypeScript checking) dan melakukan *build* aplikasi untuk lingkungan produksi (*production*).
- `pnpm lint`: Menjalankan ESLint untuk memastikan standar kualitas dan kerapian kode terpenuhi.

## Panduan Kontribusi (Git Workflow)

Untuk menjaga riwayat *commit* yang rapi dan mempermudah kolaborasi, jika Anda ingin melakukan *push* dan berkontribusi, Anda **wajib** membuat *branch* baru dengan format penamaan yang spesifik. Hindari melakukan *push* langsung ke *branch* utama (`main` atau `master`).

Format penamaan *branch* yang digunakan adalah:
- **`feat/nama-fitur`**: Digunakan saat menambahkan fitur baru (contoh: `feat/login-page`, `feat/quiz-timer`).
- **`fix/nama-perbaikan`**: Digunakan saat memperbaiki *bug* atau *error* (contoh: `fix/header-layout`, `fix/api-error-handling`).
- **`docs/nama-dokumentasi`**: Digunakan saat ada penambahan atau perbaikan pada dokumentasi (contoh: `docs/update-readme`).
- **`refactor/nama-refaktor`**: Digunakan saat merapikan atau menulis ulang kode tanpa mengubah fungsionalitas.
- **`style/nama-styling`**: Digunakan saat ada perubahan tampilan, CSS, atau format kode (seperti penyesuaian *linting*).

**Langkah-langkah berkontribusi:**
1. pull *branch* dari *development*.
2. Buat *branch* baru dari *branch* utama: `git checkout -b <branch_type>/<nama_branch_anda>`
3. Lakukan perubahan pada kode Anda.
4. *Commit* perubahan Anda dengan pesan yang jelas dan deskriptif.
5. *Push branch* Anda ke repositori: `git push origin <branch_type>/<nama_branch_anda>`
6. Buat *Pull Request* (PR) untuk ditinjau oleh tim.
