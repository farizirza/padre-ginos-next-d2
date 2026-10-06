import Link from "next/link";
import { getProductRows } from "@/lib/admin-data";
import { formatPrice } from "@/lib/format";

export default async function ProductsPage({
  searchParams,
}: PageProps<"/admin/products">) {
  const { updated } = await searchParams;
  const products = await getProductRows();
  const updatedProduct = products.find((p) => p.id === updated);

  return (
    <section>
      <h1 className="text-3xl font-black">Produk</h1>
      <p className="mt-1 text-ink/70">{products.length} pizza di menu</p>
      {updatedProduct && (
        <p role="status" className="mt-4 rounded-xl bg-emerald-100 px-4 py-2 text-emerald-900">
          Harga {updatedProduct.name} diperbarui. Menu pelanggan sudah ikut berubah.
        </p>
      )}
      <table className="mt-6 w-full overflow-hidden rounded-xl bg-white text-left text-sm shadow-sm">
        <thead className="bg-stone-50 text-xs uppercase text-ink/60">
          <tr>
            <th className="px-4 py-3">Pizza</th>
            <th className="px-4 py-3">Kategori</th>
            <th className="px-4 py-3 text-right">S</th>
            <th className="px-4 py-3 text-right">M</th>
            <th className="px-4 py-3 text-right">L</th>
            <th className="px-4 py-3 text-right">Terjual</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t border-black/5">
              <td className="px-4 py-2 font-medium">{p.name}</td>
              <td className="px-4 py-2">{p.category}</td>
              <td className="px-4 py-2 text-right">{formatPrice(p.sizes.S)}</td>
              <td className="px-4 py-2 text-right">{formatPrice(p.sizes.M)}</td>
              <td className="px-4 py-2 text-right">{formatPrice(p.sizes.L)}</td>
              <td className="px-4 py-2 text-right">{p.sold.toLocaleString("en-US")}</td>
              <td className="px-4 py-2 text-right">
                <Link href={`/admin/products/${p.id}`} className="font-semibold text-brand hover:underline">
                  Detail
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}