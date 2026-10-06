import Link from "next/link";

export default function AdminHome() {
  return (
    <section>
      <h1 className="text-3xl font-black">Overview</h1>
      <p className="mt-2 text-ink/70">
        Pilih menu di samping. Ringkasan harian menyusul.
      </p>
      <div className="mt-6 flex gap-4">
        <Link href="/admin/products" className="rounded-xl bg-white px-5 py-4 font-semibold shadow-sm">
          Kelola produk →
        </Link>
        <Link href="/admin/orders" className="rounded-xl bg-white px-5 py-4 font-semibold shadow-sm">
          Lihat order →
        </Link>
      </div>
    </section>
  );
}