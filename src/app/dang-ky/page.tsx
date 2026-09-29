import Link from "next/link";
import { registerUser } from "@/lib/actions/auth-actions";

export const metadata = { title: "Đăng ký | Verses of Memory" };

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="mx-auto max-w-sm space-y-6 py-4">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Đăng ký thẻ bạn đọc
        </h1>
        <p className="mt-1 text-sm text-muted">
          Tạo tài khoản để dùng thư viện Verses of Memory.
        </p>
      </div>

      {searchParams.error && (
        <p className="border border-dashed border-stamp/50 bg-stamp/[0.06] p-3 text-sm text-stamp">
          {searchParams.error}
        </p>
      )}

      <form action={registerUser} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="catalog-label">
            Họ tên (không bắt buộc)
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="border border-border bg-paper px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="catalog-label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="border border-border bg-paper px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="catalog-label">
            Mật khẩu (tối thiểu 8 ký tự)
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="border border-border bg-paper px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full border border-ink bg-ink px-4 py-2 font-mono text-xs uppercase tracking-wide text-paper transition hover:bg-transparent hover:text-ink"
        >
          Đăng ký
        </button>
      </form>

      <p className="text-sm text-muted">
        Đã có tài khoản?{" "}
        <Link href="/dang-nhap" className="hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
