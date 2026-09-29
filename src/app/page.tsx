import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [recentPoems, phapCount, myCount, authorCount, recentMoments] =
    await Promise.all([
      prisma.poem.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { author: true },
      }),
      prisma.poem.count({ where: { period: "chống Pháp" } }),
      prisma.poem.count({ where: { period: "chống Mỹ" } }),
      prisma.author.count(),
      prisma.moment.findMany({ take: 3, orderBy: { createdAt: "desc" } }),
    ]);

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Verses of Memory
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink/80">
          Một thư viện số lưu giữ thơ ca kháng chiến Việt Nam — từ thời kỳ chống
          thực dân Pháp đến thời kỳ chống Mỹ cứu nước. Mỗi bài thơ được lưu như
          một thẻ mục lục: đầy đủ với tác phẩm thuộc phạm vi công cộng, trích
          đoạn kèm nguồn gốc với tác phẩm còn bản quyền.
        </p>
        <Link
          href="/tho"
          className="mt-4 inline-block border border-ink bg-ink px-4 py-2 font-mono text-xs uppercase tracking-wide text-paper transition hover:bg-transparent hover:text-ink"
        >
          Duyệt toàn bộ thơ →
        </Link>
      </div>

      {/* Duyệt theo chuyên mục — kiểu các khối "Từ Wikipedia" trên trang chủ */}
      <div>
        <h2 className="catalog-label mb-3">Duyệt theo thời kỳ</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/tho?period=chống Pháp"
            className="block border border-border bg-sidebar p-4 transition hover:bg-border/40 hover:no-underline"
          >
            <p className="font-display text-lg font-semibold text-ink">
              Thời kỳ chống Pháp
            </p>
            <p className="mt-1 text-sm text-ink/70">
              Thơ ca giai đoạn kháng chiến chống thực dân Pháp.
            </p>
            <p className="catalog-label mt-3">{phapCount} bài thơ</p>
          </Link>
          <Link
            href="/tho?period=chống Mỹ"
            className="block border border-border bg-sidebar p-4 transition hover:bg-border/40 hover:no-underline"
          >
            <p className="font-display text-lg font-semibold text-ink">
              Thời kỳ chống Mỹ
            </p>
            <p className="mt-1 text-sm text-ink/70">
              Thơ ca giai đoạn kháng chiến chống Mỹ cứu nước.
            </p>
            <p className="catalog-label mt-3">{myCount} bài thơ</p>
          </Link>
        </div>
      </div>

      {/* Mục thêm gần đây — giống mục "Bài viết mới" trên trang chủ Wikipedia */}
      <div>
        <h2 className="catalog-label mb-3">Mới thêm vào thư viện</h2>
        {recentPoems.length === 0 ? (
          <p className="text-sm text-muted">Thư viện chưa có bài thơ nào.</p>
        ) : (
          <ul className="divide-y divide-border border border-border">
            {recentPoems.map((poem) => (
              <li
                key={poem.id}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3"
              >
                <div>
                  <Link
                    href={`/tho/${poem.slug}`}
                    className="font-medium hover:underline"
                  >
                    {poem.title}
                  </Link>
                  <span className="ml-2 text-sm text-muted">
                    —{" "}
                    <Link
                      href={`/tac-gia/${poem.author.slug}`}
                      className="hover:underline"
                    >
                      {poem.author.name}
                    </Link>
                  </span>
                </div>
                <span className="stamp-badge">{poem.period}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Khoảnh Khắc mới — video ngắn kể chuyện lịch sử */}
      {recentMoments.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="catalog-label">Khoảnh Khắc mới</h2>
            <Link href="/khoanh-khac" className="text-sm hover:underline">
              Xem tất cả →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {recentMoments.map((moment) => (
              <Link
                key={moment.id}
                href={`/khoanh-khac/${moment.slug}`}
                className="block border border-border bg-surface p-3 hover:bg-sidebar/40 hover:no-underline"
              >
                <span className="catalog-label">{moment.platform}</span>
                <p className="mt-1 font-display text-sm font-medium text-ink">
                  {moment.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <p className="catalog-label border-t border-border pt-4">
        {authorCount} tác giả trong thư viện
      </p>
    </div>
  );
}
