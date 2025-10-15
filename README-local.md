# Panduan Menjalankan Aplikasi Secara Lokal

## Requirement
- PHP 8.2+
- Composer 2+
- Node.js 18+
- MySQL (contoh: bawaan XAMPP)

## 1. Siapkan Database
1. Buat database MySQL bernama `portfolio` (tanpa tabel).

## 2. Jalankan Backend (Laravel API)
```powershell
cd c:\xampp\htdocs\Porto_Codex\portfolio-api
php artisan config:clear
php artisan route:clear
php artisan serve --host=localhost --port=8000
```
> Server API aktif di http://localhost:8000

## 3. Jalankan Admin Panel (Vite React)
```powershell
cd c:\xampp\htdocs\Porto_Codex\Admin
npm install   # jalankan sekali jika belum
npm run dev   # default akan memakai port 5175
```
> Admin panel tersedia di http://localhost:5175

## 4. Jalankan Portfolio Publik (Opsional)
```powershell
cd c:\xampp\htdocs\Porto_Codex
npm install   # jalankan sekali jika belum
npm run dev -- --port 5173
```
> Portfolio publik tersedia di http://localhost:5173

## 5. Akun Login Admin
- Email: `admin@example.com`
- Username: `admin`
- Password: `password123`

Buka http://localhost:5175, masukkan kredensial di atas, lalu klik **Masuk**. Setelah berhasil, dashboard admin akan muncul.
