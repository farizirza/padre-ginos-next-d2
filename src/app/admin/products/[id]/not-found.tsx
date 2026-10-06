import Link from "next/link";

export default function ProductNotFound() {
  return (
    <section>
      <h1 className="text-2xl font-bold">Produk tidak ditemukan</h1>
      <Link href="/admin/products" className="mt-4 inline-block text-brand underline">
        Kembali ke daftar produk
      </Link>
    </section>
  );
}