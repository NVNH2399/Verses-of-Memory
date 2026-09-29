import type { Metadata } from "next";
import { IBM_Plex_Sans, Lora, Source_Serif_4, Courier_Prime } from "next/font/google";
import Link from "next/link";
import { getServerSession } from "next-auth";
import "./globals.css";
import { AdBanner } from "@/components/AdBanner";
import { LogoutButton } from "@/components/LogoutButton";
import { authOptions } from "@/lib/auth";

// Font UI / điều hướng
const plexSans = IBM_Plex_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  variable: "--font-ui",
  display: "swap",
});

// Font nội dung thơ
const lora = Lora({
  subsets: ["latin", "vietnamese"],
  variable: "--font-poem",
  display: "swap",
});

// Font tiêu đề, phong cách thẻ mục lục thư viện
const sourceSerif = Source_Serif_4({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Font kiểu máy đánh chữ cho nhãn / mã số catalog
const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-catalog",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Verses of Memory",
  description:
    "Thư viện thơ ca kháng chiến — lưu giữ và giới thiệu thơ chống Pháp, chống Mỹ.",
};

const NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/tho", label: "Toàn bộ thơ" },
  { href: "/tho?period=chống Pháp", label: "Thời kỳ chống Pháp" },
  { href: "/tho?period=chống Mỹ", label: "Thời kỳ chống Mỹ" },
  { href: "/tac-gia", label: "Mục lục tác giả" },
  { href: "/khoanh-khac", label: "Khoảnh Khắc" },
  { href: "/tho/ngau-nhien", label: "Thẻ ngẫu nhiên" },
];

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="vi">
      <body
        className={`${plexSans.variable} ${lora.variable} ${sourceSerif.variable} ${courierPrime.variable} font-sans antialiased`}
      >
        {/* Thanh trên cùng: logo + ô tra cứu, giống thanh tiêu đề của một trang bách khoa */}
        <div className="border-b border-border bg-surface">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="font-display text-xl font-semibold tracking-tight text-ink">
                Verses of Memory
              </span>
              <span className="hidden font-mono text-[11px] uppercase tracking-widest text-muted sm:inline">
                Thư viện thơ ca kháng chiến
              </span>
            </Link>
            <form action="/tho" method="get" className="flex w-full max-w-xs sm:w-auto">
              <input
                type="text"
                name="q"
                placeholder="Tra cứu bài thơ, tác giả…"
                className="w-full rounded-l-sm border border-border bg-paper px-3 py-1.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-link"
              />
              <button
                type="submit"
                className="rounded-r-sm border border-l-0 border-border bg-sidebar px-3 py-1.5 text-sm text-ink hover:bg-border"
              >
                Tìm
              </button>
            </form>

            {/* Trạng thái đăng nhập */}
            <div className="flex items-center gap-3 font-mono text-xs">
              {session ? (
                <>
                  <span className="text-muted">
                    Xin chào, {session.user.name ?? session.user.email}
                  </span>
                  {session.user.role === "ADMIN" && (
                    <Link href="/admin" className="text-link hover:underline">
                      Trang quản trị
                    </Link>
                  )}
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link href="/dang-nhap" className="hover:underline">
                    Đăng nhập
                  </Link>
                  <Link href="/dang-ky" className="hover:underline">
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Banner quảng cáo đầu trang — vị trí phổ biến nhất, dễ nhìn thấy */}
        <div className="border-b border-border bg-paper py-3">
          <AdBanner size="leaderboard" />
        </div>

        {/* Bố cục 2 cột: sidebar điều hướng bên trái (kiểu kệ mục lục) + nội dung chính */}
        <div className="mx-auto flex max-w-5xl items-start gap-6 px-4 py-6 sm:px-6">
          <aside className="sticky top-6 hidden w-48 shrink-0 space-y-4 md:block">
            <div className="border border-border bg-sidebar p-3">
              <p className="catalog-label mb-2">Danh mục</p>
              <nav className="flex flex-col gap-1 text-sm">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-sm px-2 py-1.5 text-ink hover:bg-border/50 hover:no-underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <AdBanner size="rectangle" />
          </aside>

          <main className="min-w-0 flex-1 content-frame p-5 sm:p-8">
            {children}
          </main>
        </div>

        <footer className="mx-auto max-w-5xl space-y-1 px-4 py-8 font-mono text-[11px] text-muted sm:px-6">
          <p>Verses of Memory — thư viện thơ ca kháng chiến. Bản demo MVP.</p>
          <p>
            Trang có sử dụng liên kết tiếp thị (affiliate) và có thể hiển thị
            quảng cáo để duy trì chi phí vận hành.
          </p>
        </footer>
      </body>
    </html>
  );
}
