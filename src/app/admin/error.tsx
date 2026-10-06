"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

// Catches errors in any /admin/* page. The sidebar (layout) stays usable.
export default function AdminError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    // In production: send to an error tracking service
    console.error(error);
  }, [error]);

  return (
    <section role="alert" className="max-w-xl rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="text-xl font-bold text-red-800">Data gagal dimuat</h1>
      <p className="mt-2 text-ink/70">
        Server sedang bermasalah. Coba lagi sebentar lagi.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-ink/50">Kode: {error.digest}</p>
      )}
      <button
        type="button"
        onClick={() => retry()}
        className="mt-4 rounded-lg bg-brand px-4 py-2 font-semibold text-white"
      >
        Coba lagi
      </button>
    </section>
  );
}