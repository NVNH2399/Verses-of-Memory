import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AffiliateCard, AffiliateDisclosure } from "@/components/AffiliateCard";
import { AdBanner } from "@/components/AdBanner";

export const dynamic = "force-dynamic";

const PLATFORM_LABEL: Record<string, string> = {
  youtube: "YouTube",
  tiktok: "TikTok",
  facebook: "Facebook",
};

async function getMoment(slug: string) {
  return prisma.moment.findUnique({ where: { slug } });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const moment = await getMoment(params.slug);
  if (!moment) return { title: "Không tìm thấy khoảnh khắc | Verses of Memory" };
  return { title: `${moment.title} | Verses of Memory` };
}

export default async function MomentDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const moment = await getMoment(params.slug);
  if (!moment) notFound();

  const affiliateProducts = await prisma.affiliateProduct.findMany({
    take: 2,
    orderBy: { createdAt: "desc" },
  });

  return (
    <article className="space-y-6">
      <nav className="font-mono text-[11px] uppercase tracking-wide text-muted">
        <Link href="/" className="hover:underline">
          Trang chủ
        </Link>{" "}
        /{" "}
        <Link href="/khoanh-khac" className="hover:underline">
          Khoảnh Khắc
        </Link>{" "}
        / {moment.title}
      </nav>

      <div>
        <span className="catalog-label">
          {PLATFORM_LABEL[moment.platform] ?? moment.platform}
        </span>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {moment.title}
        </h1>
      </div>

      {moment.platform === "youtube" && moment.embedUrl ? (
        <div className="aspect-video w-full border border-border bg-black">
          <iframe
            src={moment.embedUrl}
            title={moment.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      ) : (
        <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 border border-dashed border-border bg-sidebar/40 text-center">
          <p className="text-sm text-muted">
            Video này được đăng trên {PLATFORM_LABEL[moment.platform] ?? moment.platform},
            nhấn để xem tại nền tảng gốc.
          </p>
          <a
            href={moment.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-ink bg-ink px-4 py-2 font-mono text-xs uppercase tracking-wide text-paper hover:bg-transparent hover:text-ink"
          >
            Xem trên {PLATFORM_LABEL[moment.platform] ?? moment.platform} →
          </a>
        </div>
      )}

      {moment.description && (
        <p className="text-base leading-relaxed text-ink/80">
          {moment.description}
        </p>
      )}

      {moment.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {moment.tags.map((tag) => (
            <span key={tag} className="stamp-badge">
              {tag}
            </span>
          ))}
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
        <Link href="/khoanh-khac" className="text-sm text-muted hover:underline">
          ← Quay lại Khoảnh Khắc
        </Link>
      </div>
    </article>
  );
}
