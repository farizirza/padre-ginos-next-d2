import Link from "next/link";
import { Suspense } from "react";
import WidgetErrorBoundary from "@/components/admin/WidgetErrorBoundary";
import { getLatestDay, getStatusCounts, getTopPizzas } from "@/lib/admin-data";
import { formatPrice } from "@/lib/format";
import { STATUS_LABELS, type OrderStatus } from "@/lib/orders";

// --- Widget 1: Hari Terakhir ---------------------------------------------------
// Keputusan: Stream via Suspense. Data ini ringan (±0,3 s) dan selalu up-to-date.
// Tidak di-cache karena staf perlu lihat angka terkini setiap kali buka dashboard.
async function LatestDayWidget() {
  const day = await getLatestDay();
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <h2 className="text-xs font-semibold uppercase text-ink/60">
        Hari terakhir
      </h2>
      <p className="mt-1 text-2xl font-black">{day.date}</p>
      <div className="mt-3 flex gap-6 text-sm">
        <div>
          <span className="text-ink/60">Order: </span>
          <span className="font-semibold">{day.orders}</span>
        </div>
        <div>
          <span className="text-ink/60">Omzet: </span>
          <span className="font-semibold">{formatPrice(day.revenue)}</span>
        </div>
      </div>
    </div>
  );
}

// --- Widget 2: Status Order Hari Ini -------------------------------------------
// Keputusan: Stream via Suspense + catchError boundary sendiri.
// Widget ini memanggil failReadIfSimulated(), jadi bisa gagal.
// Kegagalan di sini TIDAK boleh menjatuhkan widget lain.
async function StatusWidget() {
  const counts = await getStatusCounts();
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <h2 className="text-xs font-semibold uppercase text-ink/60">
        Status order hari ini
      </h2>
      <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
        {(Object.entries(counts) as [OrderStatus, number][]).map(
          ([status, count]) => (
            <div key={status} className="flex justify-between">
              <dt className="text-ink/60">{STATUS_LABELS[status]}</dt>
              <dd className="font-semibold">{count}</dd>
            </div>
          ),
        )}
      </dl>
    </div>
  );
}

// --- Widget 3: Pizza Terlaris --------------------------------------------------
// Keputusan: Stream via Suspense, tapi datanya di-cache ("use cache" + cacheLife("hours")
// di getTopPizzas). Data riwayat penjualan tidak berubah tiap menit, jadi agregat berat
// (±1,8 s) cukup dihitung sekali per jam. Setelah ter-cache, widget ini tampil instan.
async function TopPizzasWidget() {
  const topPizzas = await getTopPizzas();
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <h2 className="text-xs font-semibold uppercase text-ink/60">
        Terlaris sepanjang masa
      </h2>
      <ol className="mt-3 space-y-2 text-sm">
        {topPizzas.map((pizza, i) => (
          <li key={pizza.id} className="flex items-baseline justify-between gap-3">
            <span>
              <span className="mr-1.5 font-bold text-ink/40">{i + 1}.</span>
              <Link
                href={`/admin/products/${pizza.id}`}
                className="font-medium text-brand hover:underline"
              >
                {pizza.name}
              </Link>
            </span>
            <span className="whitespace-nowrap text-ink/60">
              {pizza.sold.toLocaleString("en-US")} terjual ·{" "}
              {formatPrice(pizza.revenue)}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// --- Halaman Overview ----------------------------------------------------------
export default function AdminHome() {
  return (
    <section>
      <h1 className="text-3xl font-black">Overview</h1>
      <p className="mt-2 text-ink/70">Ringkasan harian dan performa menu.</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Widget 1: ringan, langsung stream */}
        <Suspense
          fallback={
            <div className="animate-pulse rounded-xl bg-white p-5 shadow-sm">
              <p className="text-ink/40">Memuat data hari terakhir…</p>
            </div>
          }
        >
          <LatestDayWidget />
        </Suspense>

        {/* Widget 2: rapuh (bisa gagal), boundary error sendiri */}
        <WidgetErrorBoundary title="Widget status gagal">
          <Suspense
            fallback={
              <div className="animate-pulse rounded-xl bg-white p-5 shadow-sm">
                <p className="text-ink/40">Memuat status order…</p>
              </div>
            }
          >
            <StatusWidget />
          </Suspense>
        </WidgetErrorBoundary>
      </div>

      <div className="mt-4">
        {/* Widget 3: berat tapi di-cache; stream saat belum ada di cache */}
        <Suspense
          fallback={
            <div className="animate-pulse rounded-xl bg-white p-5 shadow-sm">
              <p className="text-ink/40">Menghitung pizza terlaris…</p>
            </div>
          }
        >
          <TopPizzasWidget />
        </Suspense>
      </div>

      <div className="mt-6 flex gap-4">
        <Link
          href="/admin/products"
          className="rounded-xl bg-white px-5 py-4 font-semibold shadow-sm"
        >
          Kelola produk →
        </Link>
        <Link
          href="/admin/orders"
          className="rounded-xl bg-white px-5 py-4 font-semibold shadow-sm"
        >
          Lihat order →
        </Link>
      </div>
    </section>
  );
}