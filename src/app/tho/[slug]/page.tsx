import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AffiliateCard, AffiliateDisclosure } from "@/components/AffiliateCard";
import { AdBanner } from "@/components/AdBanner";

export const dynamic = "force-dynamic";

async function getPoem(slug: string) {
  return prisma.poem.findUnique({
    where: { slug },
    include: { author: true },
  });
}

function catalogNumber(id: string) {
  return `POM-${id.slice(-6).toUpperCase()}`;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const poem = await getPoem(params.slug);
  if (!poem) return { title: "Không tìm thấy bài thơ | Verses of Memory" };
  return { title: `${poem.title} | Verses of Memory` };
}

export default async function PoemDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const poem = await getPoem(params.slug);
  if (!poem) notFound();

  const related = await prisma.poem.findMany({
    where: {
      id: { not: poem.id },
      OR: [{ authorId: poem.authorId }, { period: poem.period }],
    },
    include: { author: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  const affiliateProducts = await prisma.affiliateProduct.findMany({
    take: 2,
    orderBy: { createdAt: "desc" },
  });

  // Quy tắc bản quyền: chỉ hiển thị nội dung đầy đủ khi tác giả public domain
  // VÀ bài thơ không bị đánh dấu excerptOnly. Ngược lại chỉ hiện excerpt + nguồn.
  const canShowFullContent = poem.author.isPublicDomain && !poem.excerptOnly;

  return (
    <article className="space-y-6">
      <nav className="font-mono text-[11px] uppercase tracking-wide text-muted">
        <Link href="/" className="hover:underline">
          Trang chủ
        </Link>{" "}
        /{" "}
        <Link href="/tho" className="hover:underline">
          Thơ
        </Link>{" "}
        / {poem.title}
      </nav>

      <div className="grid gap-6 md:grid-cols-[1fr_240px]">
        {/* Thẻ mục lục — hiện trước trên mobile, nổi bên phải trên desktop */}
        <aside className="catalog-card order-first md:order-last md:justify-self-end">
          <p className="catalog-label mb-2 border-b border-dashed border-border pb-2">
            Thẻ mục lục
          </p>
          <dl className="space-y-2">
            <div>
              <dt className="catalog-label">Mã số</dt>
              <dd className="catalog-value">{catalogNumber(poem.id)}</dd>
            </div>
            <div>
              <dt className="catalog-label">Tác giả</dt>
              <dd className="catalog-value">
                <Link href={`/tac-gia/${poem.author.slug}`} className="hover:underline">
                  {poem.author.name}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="catalog-label">Thời kỳ</dt>
              <dd className="catalog-value">{poem.period}</dd>
            </div>
            <div>
              <dt className="catalog-label">Tình trạng</dt>
              <dd className="catalog-value">
                {poem.author.isPublicDomain ? "Phạm vi công cộng" : "Còn bản quyền"}
              </dd>
            </div>
            {poem.tags.length > 0 && (
              <div>
                <dt className="catalog-label">Từ khoá</dt>
                <dd className="mt-1 flex flex-wrap gap-1">
                  {poem.tags.map((tag) => (
                    <span key={tag} className="stamp-badge">
                      {tag}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </aside>

        <div className="min-w-0 space-y-6">
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {poem.title}
          </h1>

          {canShowFullContent ? (
            <div className="poem-content">{poem.content}</div>
          ) : (
            <div className="space-y-4 border border-dashed border-stamp/40 bg-stamp/[0.04] p-4">
              <p className="catalog-label text-stamp">
                Trích đoạn — tác phẩm còn bản quyền
              </p>
              <div className="poem-excerpt">{poem.excerpt}</div>
              {poem.sourceUrl && (
                <a
                  href={poem.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm underline"
                >
                  Đọc đầy đủ tại nguồn gốc →
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="border-t border-border pt-4">
          <h2 className="catalog-label mb-3">Có thể bạn quan tâm</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {related.map((r) => (
              <li
                key={r.id}
                className="border border-dashed border-border bg-sidebar/40 px-3 py-2"
              >
                <Link
                  href={`/tho/${r.slug}`}
                  className="font-display text-sm font-medium hover:underline"
                >
                  {r.title}
                </Link>
                <div className="mt-0.5 text-xs text-muted">
                  {r.author.name} · {r.period}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <AdBanner size="rectangle" />

      {affiliateProducts.length > 0 && (
        <div className="space-y-3 border-t border-border pt-4">
          <h2 className="catalog-label">Có thể bạn cần</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {affiliateProducts.map((product) => (
              <AffiliateCard key={product.id} product={product} />
            ))}
          </div>
          <AffiliateDisclosure />
        </div>
      )}

      <div className="border-t border-border pt-4">
        <Link href="/tho" className="text-sm text-muted hover:underline">
          ← Quay lại mục lục thơ
        </Link>
      </div>
    </article>
  );
}
