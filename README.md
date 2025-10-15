# Portfolio Website

Sebuah website portfolio modern yang dibangun dengan React, Tailwind CSS, dan Vite.

## Struktur Proyek

```
src/
├── assets/         # Gambar, font, dan aset statis
├── components/     # Komponen React yang dapat digunakan kembali
│   ├── About/     # Komponen untuk section About
│   ├── Contact/   # Komponen untuk section Contact
│   └── index.js   # File barrel untuk ekspor komponen
├── config/        # File konfigurasi
│   ├── postcss.config.js    # Konfigurasi PostCSS
│   ├── tailwind.config.js   # Konfigurasi Tailwind CSS
│   └── vite.config.js       # Konfigurasi Vite
├── constants/     # Konstanta dan data statis
│   └── index.js   # Ekspor konstanta (navigasi, social links)
├── hooks/         # Custom React hooks
├── layouts/       # Layout komponen
│   └── App.jsx    # Layout utama aplikasi
├── styles/        # File CSS
│   └── index.css  # File CSS utama dengan Tailwind
└── utils/         # Fungsi utilitas
```

## Fitur

- 🎨 Desain modern dan responsif
- 🌓 Mode gelap/terang
- ⚡ Performa optimal dengan Vite
- 🎭 Animasi halus
- 📱 Mobile-friendly

## Teknologi

- React
- Tailwind CSS
- Vite
- PostCSS

## Penggunaan File

### Components (src/components/index.js)
File ini mengekspor semua komponen untuk penggunaan yang lebih bersih:
```javascript
export { default as Navbar } from './Navbar';
export { default as Hero } from './Hero';
// ... komponen lainnya
```

### Constants (src/constants/index.js)
Menyimpan data statis seperti navigasi dan social links:
```javascript
export const navLinks = [
  { id: 'home', title: 'Home', href: '#home' },
  // ... link lainnya
];
```

### Konfigurasi

#### PostCSS (src/config/postcss.config.js)
Mengatur pemrosesan CSS dengan Tailwind dan Autoprefixer.

#### Tailwind (src/config/tailwind.config.js)
Konfigurasi tema, animasi, dan font kustom untuk Tailwind CSS.

## Instalasi

1. Clone repositori
```bash
git clone [url-repo]
```

2. Install dependensi
```bash
npm install
```

3. Jalankan development server
```bash
npm run dev
```

## Pengembangan

### Menambah Komponen Baru
1. Buat komponen di folder `src/components/`
2. Ekspor komponen di `src/components/index.js`
3. Import dan gunakan komponen sesuai kebutuhan

### Menambah Halaman
1. Buat komponen halaman di `src/layouts/`
2. Tambahkan routing jika diperlukan

### Styling
- Gunakan Tailwind CSS untuk styling
- Tambahkan kelas kustom di `src/styles/index.css`
- Konfigurasi tema di `src/config/tailwind.config.js`

## Build

Untuk membuat versi production:
```bash
npm run build
```

## License

MIT License
"# portfolio-codex" 
"# portfolio-codex" 
