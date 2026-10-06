"use client";

import { useActionState } from "react";
import { updatePricesAction } from "@/app/admin/actions";
import type { PizzaSize } from "@/lib/types";

export default function PriceForm({
  pizzaId,
  sizes,
}: {
  pizzaId: string;
  sizes: Record<PizzaSize, number>;
}) {
  const [state, formAction, isPending] = useActionState(updatePricesAction, null);

  return (
    <form action={formAction} className="mt-2" noValidate>
      <input type="hidden" name="id" value={pizzaId} />
      <div className="grid grid-cols-3 gap-3">
        {(["S", "M", "L"] as const).map((size) => (
          <label key={size} className="rounded-xl bg-white p-4 shadow-sm">
            <span className="text-xs font-semibold uppercase text-ink/60">
              Harga {size}
            </span>
            <input
              name={size}
              inputMode="decimal"
              // React resets the form after the action; show what was typed again
              defaultValue={state?.values[size] ?? sizes[size].toFixed(2)}
              aria-invalid={state?.errors[size] ? true : undefined}
              aria-describedby={`price-${size}-error`}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-lg font-bold aria-invalid:border-red-500"
            />
            <span id={`price-${size}-error`} className="mt-1 block text-xs text-red-700">
              {state?.errors[size]}
            </span>
          </label>
        ))}
      </div>
      {state?.errors.form && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {state.errors.form}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="mt-4 rounded-lg bg-brand px-5 py-2 font-semibold text-white disabled:opacity-50"
      >
        {isPending ? "Menyimpan…" : "Simpan harga"}
      </button>
    </form>
  );
}