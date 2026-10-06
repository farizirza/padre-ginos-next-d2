"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Produk" },
  { href: "/admin/orders", label: "Order" },
];

function NavLinks({ pathname }: { pathname: string | null }) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {LINKS.map(({ href, label }) => {
        const active =
          pathname !== null &&
          (href === "/admin" ? pathname === href : pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`rounded-lg px-3 py-2 font-medium ${
              active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

// The only client part of the sidebar: it needs the current URL to highlight a link
export default function AdminNav() {
  return <NavLinks pathname={usePathname()} />;
}

// Shown in the static shell until the URL is known (no link highlighted yet)
export function AdminNavFallback() {
  return <NavLinks pathname={null} />;
}