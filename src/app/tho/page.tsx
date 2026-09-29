import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const PERIODS = ["chống Pháp", "chống Mỹ", "khác"];
const PAGE_SIZE = 8;

function buildQuery(
  params: Record<string, string | undefined>,
  overrides: Record<string, string | undefined>
) {
  const merged = { ...params, ...overrides };
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(merged)) {
    if (value) search.set(key, value);
  }
  const qs = search.toString();
  return qs ? `/tho?${qs}` : "/tho";
}

export default async function PoemListPage({
  searchParams,
}: {
  searchParams: {
    author?: string;
    period?: string;
    q?: string;
    sort?: string;
    page?: string;
  };
}) {
  const { author, period, q } = searchParams;
  const sort = searchParams.sort === "ten" ? "ten" : "moi-nhat";
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);

  const where: Prisma.PoemWhereInput = {
    ...(author ? { author: { slug: author } } : {}),
    ...(period ? { period } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { author: { name: { contains: q, mode: "insensitive" } } },
            { tags: { has: q } },
          ],
        }
      : {}),
  };

  const orderBy: Prisma.PoemOrderByWithRelationInput =
    sort === "ten" ? { title: "asc" } : { createdAt: "desc" };

  const [poems, total, authors] = await Promise.all([
    prisma.poem.findMany({
      where,
      include: { author: true },
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.poem.count({ where }),
    prisma.author.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;

  return (
    <div className="space-y-6">
      <nav className="font-mono text-[11px] uppercase tracking-wide text-muted">
        <Link href="/" className="hover:underline">
          Trang chủ
        </Link>{" "}
        / Thơ
      </nav>

      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Mục lục thơ
        </h1>
        <p className="mt-1 text-sm text-muted">
          {q ? (
            <>
              Kết quả tra cứu cho <span className="text-ink">“{q}”</span> —{" "}
              {total} thẻ mục lục.
            </>
          ) : (
            <>{total} thẻ mục lục trong thư viện. Lọc theo tác giả hoặc thời kỳ bên dưới.</>
          )}
        </p>
      </div>

      {/* Bộ lọc + sắp xếp: form GET, không cần JS, giữ state qua query param */}
      <form
        method="get"
        className="flex flex-col gap-3 border border-dashed border-border bg-sidebar p-4 sm:flex-row sm:items-end sm:flex-wrap"
      >
        {q && <input type="hidden" name="q" value={q} />}

        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="author" className="catalog-label">
            Tác giả
          </label>
          <select
            id="author"
            name="author"
            defaultValue={author ?? ""}
            className="border border-border bg-paper px-3 py-2 text-sm"
          >
            <option value="">Tất cả tác giả</option>
            {authors.map((a) => (
              <option key={a.id} value={a.slug}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="period" className="catalog-label">
            Thời kỳ
          </label>
          <select
            id="period"
            name="period"
            defaultValue={period ?? ""}
            className="border border-border bg-paper px-3 py-2 text-sm"
          >
            <option value="">Tất cả thời kỳ</option>
            {PERIODS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="sort" className="catalog-label">
            Sắp xếp
          </label>
          <select
            id="sort"
            name="sort"
            defaultValue={sort}
            className="border border-border bg-paper px-3 py-2 text-sm"
          >
            <option value="moi-nhat">Mới thêm trước</option>
            <option value="ten">Tên bài thơ (A–Z)</option>
          </select>
        </div>

        <button
          type="submit"
          className="border border-ink bg-ink px-4 py-2 font-mono text-xs uppercase tracking-wide text-paper transition hover:bg-transparent hover:text-ink"
        >
          Lọc
        </button>
        {(author || period || q || sort !== "moi-nhat") && (
          <Link
            href="/tho"
            className="text-center text-sm text-muted underline sm:mb-2"
          >
            Xoá bộ lọc
          </Link>
        )}
      </form>

      {poems.length === 0 ? (
        <p className="border border-dashed border-border p-6 text-center text-sm text-muted">
          Không tìm thấy thẻ mục lục nào phù hợp.
        </p>
      ) : (
        <>
          <ul className="border border-border">
            {poems.map((poem, i) => (
              <li
                key={poem.id}
                className="flex items-start gap-4 border-b border-border px-4 py-3 last:border-b-0 odd:bg-surface even:bg-sidebar/40"
              >
                <span className="catalog-label w-10 shrink-0 pt-0.5 text-right">
                  {String(startIndex + i + 1).padStart(3, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/tho/${poem.slug}`}
                    className="font-display text-lg font-medium hover:underline"
                  >
                    {poem.title}
                  </Link>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
                    <Link
                      href={`/tac-gia/${poem.author.slug}`}
                      className="hover:underline"
                    >
                      {poem.author.name}
                    </Link>
                    <span aria-hidden>·</span>
                    <span className="stamp-badge">{poem.period}</span>
                    {poem.excerptOnly && (
                      <span className="catalog-label">trích đoạn</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Phân trang kiểu điều hướng ngăn kéo */}
          {totalPages > 1 && (
            <nav className="flex items-center justify-between border border-border bg-sidebar px-4 py-3 text-sm">
              {page > 1 ? (
                <Link
                  href={buildQuery(searchParams, { page: String(page - 1) })}
                  className="hover:underline"
                >
                  ← Ngăn trước
                </Link>
              ) : (
                <span className="text-muted">← Ngăn trước</span>
              )}
              <span className="catalog-label">
                Trang {page} / {totalPages}
              </span>
              {page < totalPages ? (
                <Link
                  href={buildQuery(searchParams, { page: String(page + 1) })}
                  className="hover:underline"
                >
                  Ngăn sau →
                </Link>
              ) : (
                <span className="text-muted">Ngăn sau →</span>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
