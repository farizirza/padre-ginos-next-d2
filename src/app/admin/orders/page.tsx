import Form from "next/form";
import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";
import { getOrders } from "@/lib/admin-data";
import { formatPrice } from "@/lib/format";

function parsePage(value: unknown): number {
  const n = typeof value === "string" ? Number(value) : NaN;
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

function parseDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = parsePage(params.page);
  const date = parseDate(params.date);

  const { orders, totalPages } = await getOrders({ page, date });

  const prevUrl = `/admin/orders?${new URLSearchParams({
    page: String(page - 1),
    ...(date ? { date } : {}),
  }).toString()}`;

  const nextUrl = `/admin/orders?${new URLSearchParams({
    page: String(page + 1),
    ...(date ? { date } : {}),
  }).toString()}`;

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black">Order</h1>
          <p className="mt-1 text-ink/70">
            {date ? `Filter tanggal: ${date}` : "Semua riwayat pesanan"}
          </p>
        </div>

        <Form action="/admin/orders" className="flex items-center gap-2">
          <input
            type="date"
            name="date"
            defaultValue={date ?? ""}
            aria-label="Filter tanggal"
            className="rounded-lg border border-black/15 bg-white px-3 py-1.5 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand/90"
          >
            Filter
          </button>
          {date && (
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-ink/60 hover:underline"
            >
              Reset
            </Link>
          )}
        </Form>
      </div>

      <table className="mt-6 w-full overflow-hidden rounded-xl bg-white text-left text-sm shadow-sm">
        <thead className="bg-stone-50 text-xs uppercase text-ink/60">
          <tr>
            <th className="px-4 py-3">Order</th>
            <th className="px-4 py-3">Waktu</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Item</th>
            <th className="px-4 py-3 text-right">Total</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-ink/60">
                Tidak ada order yang ditemukan.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id} className="border-t border-black/5">
                <td className="px-4 py-2 font-medium">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-semibold text-brand hover:underline"
                  >
                    #{order.id}
                  </Link>
                </td>
                <td className="px-4 py-2">
                  {order.date} {order.time}
                </td>
                <td className="px-4 py-2">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-4 py-2 text-right">{order.items}</td>
                <td className="px-4 py-2 text-right font-medium">
                  {formatPrice(order.total)}
                </td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-semibold text-brand hover:underline"
                  >
                    Detail
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="mt-6 flex items-center justify-between">
        <div>
          {page > 1 ? (
            <Link
              href={prevUrl}
              className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold shadow-sm hover:bg-stone-50"
            >
              ← Sebelumnya
            </Link>
          ) : (
            <span className="cursor-not-allowed rounded-lg bg-stone-100 px-3 py-1.5 text-sm font-semibold text-ink/30">
              ← Sebelumnya
            </span>
          )}
        </div>

        <span className="text-sm text-ink/60">
          Halaman {page} dari {totalPages}
        </span>

        <div>
          {page < totalPages ? (
            <Link
              href={nextUrl}
              className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold shadow-sm hover:bg-stone-50"
            >
              Berikutnya →
            </Link>
          ) : (
            <span className="cursor-not-allowed rounded-lg bg-stone-100 px-3 py-1.5 text-sm font-semibold text-ink/30">
              Berikutnya →
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
