# IoT Monitoring & SPJ Application

Aplikasi web untuk pemantauan IoT, pengelolaan data Surat Pertanggungjawaban (SPJ), dan pencatatan pemesanan. Repositori ini berisi kode sumber untuk bagian **Frontend**.

## Tech Stack

Project ini dikembangkan menggunakan teknologi modern dengan performa tinggi:

### Core Framework & Build Tool
- **[React 19](https://react.dev/)** - Library utama untuk membangun antarmuka pengguna (UI).
- **[TypeScript](https://www.typescriptlang.org/)** - Static typing untuk JavaScript untuk meningkatkan keandalan kode.
- **[Vite](https://vitejs.dev/)** - Build tool & dev server yang sangat cepat.

### Styling & UI Components
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework untuk styling komponen dengan cepat.
- **[shadcn/ui](https://ui.shadcn.com/)** - Koleksi komponen UI yang dapat disesuaikan (berbasis Radix UI).
- **[Lucide React](https://lucide.dev/)** & **[Phosphor Icons](https://phosphoricons.com/)** - Ikonografi aplikasi.

### Routing & State Management
- **[React Router DOM v7](https://reactrouter.com/)** - Routing untuk navigasi antar halaman (SPA).
- **[TanStack React Query v5](https://tanstack.com/query/latest)** - Pengelolaan state asinkron, caching, dan sinkronisasi data dari API.

### Form & Validation
- **[React Hook Form](https://react-hook-form.com/)** - Manajemen state form yang ringan dan efisien.
- **[Zod](https://zod.dev/)** - Schema declaration & data validation (terintegrasi dengan form).

### API Client & Utilities
- **[Axios](https://axios-http.com/)** - HTTP client untuk berkomunikasi dengan Backend API.
- **[Recharts](https://recharts.org/)** - Library chart komprehensif untuk visualisasi data/grafik.
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications yang elegan.

### Testing & Quality Assurance
- **[Playwright](https://playwright.dev/)** - Framework E2E (End-to-End) automation testing.
- **ESLint** - Linter kode standar untuk menjaga kualitas dan konsistensi kode.

---

## Cara Menjalankan Project (Frontend)

1. Pastikan Anda sudah menginstal **Node.js** versi terbaru (v18+ direkomendasikan).
2. Clone repository dan masuk ke folder `iot-frontend`:
   ```bash
   cd iot-frontend
   ```
3. Instal semua dependency:
   ```bash
   npm install
   ```
4. Jalankan development server:
   ```bash
   npm run dev
   ```
5. Buka `http://localhost:5173` di browser.

## 🔗 Keterkaitan Backend
Aplikasi frontend ini berkomunikasi dengan backend yang ditulis menggunakan **Go (Golang)**, **Gin Framework**, **GORM**, dan database **MySQL** (berada di folder `iot-backend3`). Pastikan backend server juga berjalan saat menjalankan frontend ini.
