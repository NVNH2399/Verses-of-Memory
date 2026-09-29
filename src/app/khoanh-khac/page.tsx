import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdBanner } from "@/components/AdBanner";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Khoảnh Khắc | Verses of Memory",
};

const PLATFORM_LABEL: Record<string, string> = {
  youtube: "YouTube",
  tiktok: "TikTok",
  facebook: "Facebook",
};

export default async function MomentsListPage() {
  const moments = await prisma.moment.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <nav className="font-mono text-[11px] uppercase tracking-wide text-muted">
        <Link href="/" className="hover:underline">
          Trang chủ
        </Link>{" "}
        / Khoảnh Khắc
      </nav>

      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Khoảnh Khắc
        </h1>
        <p className="mt-1 text-sm text-muted">
          Video ngắn kể chuyện lịch sử, ký ức và đời sống miền quê — góc mở
          rộng bên cạnh mục lục thơ.
        </p>
      </div>

      <AdBanner size="leaderboard" />

      {moments.length === 0 ? (
        <p className="border border-dashed border-border p-6 text-center text-sm text-muted">
          Chưa có khoảnh khắc nào được đăng.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {moments.map((moment) => (
            <Link
              key={moment.id}
              href={`/khoanh-khac/${moment.slug}`}
              className="block border border-border bg-surface p-4 hover:bg-sidebar/40 hover:no-underline"
            >
              <span className="catalog-label">
                {PLATFORM_LABEL[moment.platform] ?? moment.platform}
              </span>
              <p className="mt-1 font-display text-lg font-medium text-ink">
                {moment.title}
              </p>
              {moment.description && (
                <p className="mt-1 line-clamp-2 text-sm text-ink/70">
                  {moment.description}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {moment.period && (
                  <span className="stamp-badge">{moment.period}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
