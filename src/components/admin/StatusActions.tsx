"use client";

import { useActionState } from "react";
import { updateOrderStatusAction } from "@/app/admin/actions";
import { nextStatuses, type OrderStatus, STATUS_LABELS } from "@/lib/orders";

export default function StatusActions({
  orderId,
  status,
}: {
  orderId: number;
  status: OrderStatus;
}) {
  const [state, formAction, isPending] = useActionState(
    updateOrderStatusAction,
    null,
  );
  const allowedStatuses = nextStatuses(status);

  if (allowedStatuses.length === 0) {
    return (
      <p className="text-sm font-medium text-ink/60">
        Status final, tidak bisa diubah lagi.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <form action={formAction} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="orderId" value={orderId} />
        {allowedStatuses.map((next) => (
          <button
            key={next}
            type="submit"
            name="status"
            value={next}
            disabled={isPending}
            className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-sm font-semibold text-ink shadow-sm hover:bg-stone-50 disabled:opacity-50"
          >
            {isPending ? "Menyimpan…" : `Ubah ke ${STATUS_LABELS[next]}`}
          </button>
        ))}
      </form>
      {state?.error && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}
    </div>
  );
}
