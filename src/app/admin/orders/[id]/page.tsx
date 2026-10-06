import Link from "next/link";
import { notFound } from "next/navigation";
import StatusBadge from "@/components/admin/StatusBadge";
import { getOrder } from "@/lib/admin-data";
import { formatPrice } from "@/lib/format";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (!Number.isInteger(id)) {
    notFound();
  }

  const order = await getOrder(id);
  if (!order) {
    notFound();
  }

  return (
    <section className="max-w-3xl">
      <Link href="/admin/orders" className="text-sm text-brand hover:underline">
        ← Semua order
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Order #{order.id}</h1>
          <p className="mt-1 text-ink/60">
            {order.date} · {order.time}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-xs uppercase text-ink/60">
            <tr>
              <th className="px-4 py-3">Pizza</th>
              <th className="px-4 py-3 text-center">Ukuran</th>
              <th className="px-4 py-3 text-right">Jumlah</th>
              <th className="px-4 py-3 text-right">Harga</th>
              <th className="px-4 py-3 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.lines.map((line, idx) => (
              <tr
                key={`${line.pizzaId}-${line.size}-${idx}`}
                className="border-t border-black/5"
              >
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/admin/products/${line.pizzaId}`}
                    className="text-brand hover:underline"
                  >
                    {line.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-center font-semibold">{line.size}</td>
                <td className="px-4 py-3 text-right">{line.quantity}</td>
                <td className="px-4 py-3 text-right">{formatPrice(line.price)}</td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatPrice(line.quantity * line.price)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-black/10 bg-stone-50/50">
            <tr>
              <td colSpan={4} className="px-4 py-3 text-right font-bold text-ink">
                Total
              </td>
              <td className="px-4 py-3 text-right text-base font-black text-ink">
                {formatPrice(order.total)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
