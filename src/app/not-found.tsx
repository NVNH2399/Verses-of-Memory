import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-6 py-8 text-center">
      <p className="catalog-label">Mã lỗi 404</p>
      <h1 className="font-display text-2xl font-semibold tracking-tight">
        Không tìm thấy thẻ mục lục này
      </h1>
      <p className="mx-auto max-w-md text-sm text-ink/70">
        Thẻ bạn tra cứu có thể đã bị gỡ khỏi ngăn catalog, hoặc đường dẫn không
        chính xác. Thử quay lại mục lục thơ hoặc tìm kiếm lại.
      </p>
      <div className="flex justify-center gap-3">
        <Link
          href="/tho"
          className="border border-ink bg-ink px-4 py-2 font-mono text-xs uppercase tracking-wide text-paper transition hover:bg-transparent hover:text-ink"
        >
          Về mục lục thơ
        </Link>
        <Link
          href="/"
          className="border border-border px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink hover:bg-sidebar"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
