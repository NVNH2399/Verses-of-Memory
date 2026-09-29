import Link from "next/link";
import { requireAdmin } from "@/lib/require-admin";

const ADMIN_NAV = [
  { href: "/admin", label: "Tổng quan" },
  { href: "/admin/tho", label: "Quản lý Thơ" },
  { href: "/admin/tac-gia", label: "Quản lý Tác giả" },
  { href: "/admin/khoanh-khac", label: "Quản lý Khoảnh Khắc" },
  { href: "/admin/affiliate", label: "Quản lý Affiliate" },
  { href: "/admin/nguoi-dung", label: "Quản lý người dùng" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-border pb-4">
        <div>
          <p className="catalog-label">Khu vực quản trị</p>
          <h1 className="font-display text-xl font-semibold">Bàn quản lý thư viện</h1>
        </div>
        <Link href="/" className="text-sm text-muted hover:underline">
          ← Về trang chính
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-[180px_1fr]">
        <nav className="flex flex-row flex-wrap gap-1 border border-border bg-sidebar p-2 text-sm md:flex-col">
          {ADMIN_NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-sm px-2 py-1.5 text-ink hover:bg-border/50 hover:no-underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
