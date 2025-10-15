# Portfolio Codex Monorepo

Repositori ini berisi tiga aplikasi terpisah:

- rontend/  – website portfolio publik berbasis React + Vite.
- dmin-app/ – panel admin untuk mengelola konten.
- ackend/   – REST API Laravel yang melayani data untuk kedua frontend.

## Struktur Direktori

`
frontend/
  package.json         # Config dan skrip Vite/React
  src/                 # Sumber website portfolio
  public/              # Static assets (favicon, icons)
admin-app/
  package.json         # Config Vite untuk panel admin
  src/
backend/
  artisan              # Entrypoint Laravel
  app/                 # Controller, model, request
  routes/
  config/
  database/
`

## Menjalankan Secara Lokal

### 1. Frontend (portfolio)
`ash
cd frontend
npm install
npm run dev
`
Aplikasi akan tersedia di http://localhost:5173 (atau port yang ditampilkan Vite).

### 2. Admin Panel
`ash
cd admin-app
npm install
npm run dev
`

### 3. Backend Laravel
`ash
cd backend
composer install
cp .env.example .env
php artisan key:generate
`
Selanjutnya isi kredensial database MySQL pada .env kemudian jalankan:
`ash
php artisan migrate --seed
php artisan serve
`
API default tersedia di http://127.0.0.1:8000/api.

## Build & Deploy

### Build frontend untuk production
`ash
cd frontend
npm run build
`
Folder rontend/dist berisi file statis siap unggah.

### Build admin untuk production
`ash
cd admin-app
npm run build
`

### Deploy ke Hostinger (ringkas)
1. **Backend**
   - Upload folder ackend ke server (mis. ~/domains/namadomain/backend).
   - Jalankan composer install, cp .env.example .env, php artisan key:generate melalui SSH.
   - Buat database MySQL via hPanel, isi kredensial pada .env.
   - Jalankan php artisan migrate --seed.
   - Atur subdomain (mis. pi.domain.com) dengan document root ackend/public.

2. **Frontend / Admin**
   - Setelah 
pm run build, kompres isi folder dist.
   - Upload dan ekstrak ke public_html (atau subfolder) melalui File Manager.
   - Pastikan file .htaccess berisi aturan fallback SPA:
     `
     Options -MultiViews
     RewriteEngine On
     RewriteBase /
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
     `
   - Set environment di rontend/.env.production (mis. VITE_API_BASE_URL=https://api.domain.com/api).

## Catatan Penting
- Setiap aplikasi memiliki dependensi sendiri; jalankan 
pm install atau composer install di folder masing-masing.
- Folder 
ode_modules/, dist/, dan endor/ sudah masuk .gitignore sehingga tidak tersimpan di Git.
- Untuk mengganti konfigurasi Tailwind atau Vite, edit file di dalam rontend/ atau dmin-app/ sesuai kebutuhan.

Semoga struktur baru ini memudahkan proses deploy ke Hostinger. ??
