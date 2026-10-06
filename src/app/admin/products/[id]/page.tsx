import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getSalesBySize } from "@/lib/admin-data";
import { getPizza } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export default async function ProductDetailPage({
  params,
}: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  const pizza = await getPizza(id);
  if (!pizza) notFound();

  return (
    <section className="max-w-3xl">
      <Link href="/admin/products" className="text-sm text-brand hover:underline">
        ← Semua produk
      </Link>
      <div className="mt-4 flex items-center gap-5">
        <Image
          src={pizza.image}
          alt={pizza.name}
          width={96}
          height={96}
          className="size-24 rounded-xl object-cover"
        />
        <div>
          <h1 className="text-3xl font-black">{pizza.name}</h1>
          <p className="text-ink/60">
            {pizza.category} ·{" "}
            <Link href={`/pizza/${pizza.id}`} className="underline">
              lihat di toko
            </Link>
          </p>
        </div>
      </div>
      <p className="mt-4">{pizza.description}</p>

      <h2 className="mt-8 text-lg font-bold">Harga</h2>
      <dl className="mt-2 grid grid-cols-3 gap-3">
        {(["S", "M", "L"] as const).map((size) => (
          <div key={size} className="rounded-xl bg-white p-4 shadow-sm">
            <dt className="text-xs font-semibold uppercase text-ink/60">{size}</dt>
            <dd className="text-xl font-black" data-testid={`price-${size}`}>
              {formatPrice(pizza.sizes[size])}
            </dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-8 text-lg font-bold">Terjual per ukuran</h2>
      <Suspense fallback={<p className="mt-2 animate-pulse text-ink/60">Menghitung…</p>}>
        <SalesBySize id={pizza.id} />
      </Suspense>
    </section>
  );
}

// Live numbers: not cached, streamed after the product info
async function SalesBySize({ id }: { id: string }) {
  const sales = await getSalesBySize(id);
  return (
    <ul className="mt-2 flex gap-3">
      {sales.map((s) => (
        <li key={s.size} className="rounded-xl bg-white px-4 py-3 shadow-sm">
          <span className="font-semibold">{s.size}</span>: {s.sold.toLocaleString("en-US")}
        </li>
      ))}
    </ul>
  );
}