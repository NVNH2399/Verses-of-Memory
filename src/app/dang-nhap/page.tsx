"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email hoặc mật khẩu không đúng.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm space-y-6 py-4">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Đăng nhập
        </h1>
        <p className="mt-1 text-sm text-muted">
          Đăng nhập vào thư viện Verses of Memory.
        </p>
      </div>

      {searchParams.get("registered") && (
        <p className="border border-dashed border-border bg-sidebar/60 p-3 text-sm text-ink">
          Đăng ký thành công, bạn có thể đăng nhập ngay.
        </p>
      )}
      {error && (
        <p className="border border-dashed border-stamp/50 bg-stamp/[0.06] p-3 text-sm text-stamp">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="catalog-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-border bg-paper px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="catalog-label">
            Mật khẩu
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-border bg-paper px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full border border-ink bg-ink px-4 py-2 font-mono text-xs uppercase tracking-wide text-paper transition hover:bg-transparent hover:text-ink disabled:opacity-50"
        >
          {loading ? "Đang đăng nhập…" : "Đăng nhập"}
        </button>
      </form>

      <p className="text-sm text-muted">
        Chưa có tài khoản?{" "}
        <Link href="/dang-ky" className="hover:underline">
          Đăng ký
        </Link>
      </p>
    </div>
  );
}
