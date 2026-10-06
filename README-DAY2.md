# Day 2 — Routing, Layouts, Mutations & Caching

Central question: **URL-nya apa, layout-nya apa, apa yang terjadi kalau lambat, gagal, atau tidak ada, dan cache mana yang harus dibuang setelah data berubah?**

---

## Step Map / Linimasa Day 2

| Tag | Siapa | Apa yang terjadi | Mengapa | Selanjutnya |
| --- | --- | --- | --- | --- |
| `d2-start` (= `d1-end`) | — | Toko jalan; belum ada dashboard. | Titik awal yang sama dengan akhir Day 1. | Siapkan data layer, pisahkan toko dan dashboard. |
| `d2-01` | Instruktur (Part 2) | Route group `(shop)`, layout admin + `AdminNav`, `/admin`, `/admin/products` dan `loading.tsx`; data layer disiapkan. | Dashboard butuh bingkai dan URL sendiri. | Detail produk. |
| `d2-02` = `d2-p1-start` | Instruktur (Part 3) | `/admin/products/[id]`, `loading`/`not-found`, `error.tsx`, `AdminNav` dalam Suspense. | Keadaan lambat, tidak ada, dan gagal harus ditangani per segmen. | Siswa membangun Order. |
| `d2-03` = `d2-p1-solution` | Siswa (P1) | `/admin/orders` dengan `?page` dan `?date`, `/admin/orders/[id]`, `StatusBadge`. | Transfer pola Produk ke data dengan URL state. | Mutasi pertama. |
| `d2-04` = `d2-p2-start` | Instruktur (Part 4) | Edit harga: `parsePrice`, `updatePricesAction`, `PriceForm`, `updateTag("menu")`, pesan sukses. | Mutasi yang harus terlihat di toko yang di-cache. | Siswa membuat mutasi status. |
| `d2-05` | Siswa (P2) | `updateOrderStatusAction`, `StatusActions`, test aturan status. | Aturan bisnis ditegakkan server. | Overview dari rekan tim. |
| `d2-p3-start` | — | Overview "versi rekan tim": `Promise.all` dan satu `loading.tsx`. | Contoh arsitektur yang lambat dan rapuh. | Siswa memperbaiki. |
| `d2-06` = `d2-p3-solution` | Siswa (P3) | Widget di Suspense sendiri, `catchError`, `getTopPizzas` di-cache. | ±1,9 s → ±0,35 s; satu kegagalan = satu widget. | Recap. |
| `d2-end` = `d2-06` dan README | — | `README-DAY2.md`. | Dokumentasi peta langkah. | Day 3 dimulai di `d3-start` (persiapan auth). |

---

## Peta Akhir Aplikasi

```
src/app/
├── layout.tsx                    html + body
├── (shop)/                       toko: Header, footer
│   ├── page.tsx                  /             menu ("use cache", favorit di-stream)
│   └── pizza/[id]/               /pizza/:id    statis per pizza, rating di-stream
└── admin/                        dashboard: sidebar (AdminNav di Suspense)
    ├── error.tsx                 error boundary semua halaman admin
    ├── page.tsx                  /admin        3 widget: stream, stream+catchError, cache
    ├── actions.ts                updatePricesAction, updateOrderStatusAction
    ├── products/                 /admin/products        loading
    │   └── [id]/                 /admin/products/:id    loading, not-found, PriceForm
    └── orders/                   /admin/orders?page&date  loading, next/form
        └── [id]/                 /admin/orders/:id      loading, not-found, StatusActions
```

---

## Final Mental Model

```
          Layar baru
              │
  Perlu bisa di-refresh / di-share? ──ya──▶ URL (segment, [param], ?searchParams)
              │
     Butuh tampilan bersama?  ──ya──▶ layout.tsx (route group kalau beda "wajah")
              │
   ┌──────────┼───────────────┐
   ↓          ↓               ↓
Lambat?    Bisa gagal?     Tidak ada?
loading /  error.tsx /     notFound() +
Suspense   catchError      not-found.tsx
              │
         Mutasi data
              │
validasi di server → simpan → cache?
              ├─ data di-cache   → updateTag(tag) → redirect / tampil
              └─ tidak di-cache  → refresh()
```

---

## Debugging Challenges Recap

1. **Challenge 1 — "Harganya sudah disimpan, tapi toko masih lama"**:
   - Penyebab: baris yang dihapus/terlewat adalah `updateTag("menu")`.
   - Mengapa: Daftar produk admin benar karena `getProductRows` tidak di-cache. Toko dan form edit memakai `getPizza` yang di-cache dengan tag `menu`, jadi tetap basi sampai `cacheLife("hours")` expired kecuali di-invalidasi dengan `updateTag("menu")`.

2. **Challenge 2 — "Kenapa hanya rute dinamis?"**:
   - Penyebab: untuk `/admin` dan `/admin/products`, path sudah diketahui saat build sehingga `usePathname()` bisa diisi di static shell.
   - Mengapa: untuk `/admin/products/[id]`, path baru diketahui saat request time. Cache Components meminta `<Suspense>` dengan fallback (misalnya menu nav tanpa highlight) agar shell tetap bisa di-prerender.

---

## Daily Summary

### What We Did
- Memisahkan toko dan dashboard dengan route group `(shop)` dan layout admin bersidebar, dalam satu aplikasi.
- Membangun `/admin/products`, `/admin/products/[id]`, `/admin/orders`, dan `/admin/orders/[id]` sebagai Server Components, dengan loading, error, dan not-found per segmen.
- Menyimpan state halaman dan filter di URL dengan `searchParams` dan `next/form`.
- Menulis dua mutasi: edit harga dengan validasi per field dan `updateTag("menu")`, serta perubahan status order dengan aturan transisi yang ditegakkan server.
- Mempercepat Overview dari ±1,9 detik ke ±0,35 detik dan mengisolasi kegagalan per widget menggunakan Suspense dan `catchError`.

### What You Learned
- **URL adalah state yang bisa dibagi**: Layar yang perlu di-refresh atau di-share harus punya URL.
- **Layout bertingkat tetap hidup saat navigasi**: Route group mengatur layout tanpa mengubah URL.
- **Batas granularitas error & loading**: `loading.tsx` adalah Suspense per segmen. `error.tsx` adalah error boundary per segmen yang tidak membungkus layout-nya. `catchError` untuk batas per component / widget.
- **Strategi cache & mutasi**: Setiap cache butuh rencana invalidasi: `updateTag` untuk read-your-own-writes, `refresh()` untuk data yang tidak di-cache.
- **Keamanan aturan bisnis**: Aturan bisnis tinggal di server. Tombol yang disembunyikan di UI bukan pengaman.

### Why It Matters
- Staf bisa saling berbagi link ke order tertentu (`?page=...&date=...`), dan dashboard tidak "putih" hanya karena satu query gagal.
- Pelanggan langsung melihat harga baru, tanpa mengorbankan kecepatan toko yang di-cache.
- Struktur folder mencerminkan struktur produk, sehingga tim bisa bekerja di bagian yang berbeda tanpa saling menimpa.

### What You Should Be Able to Do Now
- Merancang peta rute dan layout untuk fitur baru, termasuk route group dan segmen dinamis.
- Menempatkan loading, error, dan not-found di level yang tepat, dan menjelaskan alasannya.
- Membaca dan memvalidasi `params` serta `searchParams` sebagai input user.
- Menulis Server Action dengan `useActionState`, error per field, dan invalidasi cache yang tepat.

---

## What Comes Next (Day 3 Teaser)

Saat ini siapa pun dapat membuka `/admin`, mengubah harga pizza, dan mengubah status order tanpa verifikasi identitas. Di **Day 3**, kita akan menjawab:
1. **Authentication**: Siapa kamu? (OAuth login).
2. **Authorization**: Apa peran dan hak akses kamu? (Admin vs Staff vs Customer).
3. **Server-enforced security**: Memastikan otorisasi diverifikasi di Server Actions & Server Components, bukan hanya di level UI client.
