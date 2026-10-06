"use client";

import { catchError, type ErrorInfo } from "next/error";

function WidgetErrorFallback(
  props: { title: string },
  { retry }: ErrorInfo,
) {
  return (
    <div
      role="alert"
      className="rounded-xl bg-red-50 p-5 text-sm shadow-sm"
    >
      <p className="font-semibold text-red-800">{props.title}</p>
      <p className="mt-1 text-red-700/70">Gagal memuat data ini.</p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-3 rounded-lg bg-red-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-800"
      >
        Coba lagi
      </button>
    </div>
  );
}

export default catchError(WidgetErrorFallback);
