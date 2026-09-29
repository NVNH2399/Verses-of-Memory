import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getAuthor(slug: string) {
  return prisma.author.findUnique({
    where: { slug },
    include: { poems: { orderBy: { createdAt: "desc" } } },
  });
}

function catalogNumber(id: string) {
  return `TG-${id.slice(-6).toUpperCase()}`;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const author = await getAuthor(params.slug);
  if (!author) return { title: "Không tìm thấy tác giả | Verses of Memory" };
  return { title: `${author.name} | Verses of Memory` };
}

export default async function AuthorDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const author = await getAuthor(params.slug);
  if (!author) notFound();

  return (
    <div className="space-y-6">
      <nav className="font-mono text-[11px] uppercase tracking-wide text-muted">
        <Link href="/" className="hover:underline">
          Trang chủ
        </Link>{" "}
        /{" "}
        <Link href="/tho" className="hover:underline">
          Thơ
        </Link>{" "}
        / {author.name}
      </nav>

      <div className="grid gap-6 md:grid-cols-[1fr_240px]">
        {/* Thẻ mục lục tác giả — kiểu infobox */}
        <aside className="catalog-card order-first md:order-last md:justify-self-end">
          <p className="catalog-label mb-2 border-b border-dashed border-border pb-2">
            Thẻ tác giả
          </p>
          <dl className="space-y-2">
            <div>
              <dt className="catalog-label">Mã số</dt>
              <dd className="catalog-value">{catalogNumber(author.id)}</dd>
            </div>
            <div>
              <dt className="catalog-label">Sinh</dt>
              <dd className="catalog-value">{author.birthYear ?? "Không rõ"}</dd>
            </div>
            <div>
              <dt className="catalog-label">Mất</dt>
              <dd className="catalog-value">{author.deathYear ?? "—"}</dd>
            </div>
            <div>
              <dt className="catalog-label">Tình trạng bản quyền</dt>
              <dd className="catalog-value">
                {author.isPublicDomain ? "Phạm vi công cộng" : "Còn bản quyền"}
              </dd>
            </div>
            <div>
              <dt className="catalog-label">Số tác phẩm</dt>
              <dd className="catalog-value">{author.poems.length}</dd>
            </div>
          </dl>
        </aside>

        <div className="min-w-0 space-y-6">
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {author.name}
          </h1>

          {author.bio && (
            <p className="text-base leading-relaxed text-ink/80">{author.bio}</p>
          )}

          <div>
            <h2 className="catalog-label mb-3 border-b border-border pb-2">
              Tác phẩm trong thư viện
            </h2>
            <ul className="border border-border">
              {author.poems.map((poem, i) => (
                <li
                  key={poem.id}
                  className="flex items-start gap-4 border-b border-border px-4 py-3 last:border-b-0 odd:bg-surface even:bg-sidebar/40"
                >
                  <span className="catalog-label w-8 shrink-0 pt-0.5 text-right">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/tho/${poem.slug}`}
                      className="font-display font-medium hover:underline"
                    >
                      {poem.title}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
                      <span className="stamp-badge">{poem.period}</span>
                      {poem.excerptOnly && (
                        <span className="catalog-label">trích đoạn</span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <Link href="/tho" className="text-sm text-muted hover:underline">
          ← Quay lại mục lục thơ
        </Link>
      </div>
    </div>
  );
}
