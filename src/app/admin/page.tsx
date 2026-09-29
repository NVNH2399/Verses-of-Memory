import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [poems, authors, moments, affiliateProducts, users] = await Promise.all([
    prisma.poem.count(),
    prisma.author.count(),
    prisma.moment.count(),
    prisma.affiliateProduct.count(),
    prisma.user.count(),
  ]);

  const cards = [
    { label: "Bài thơ", count: poems, href: "/admin/tho" },
    { label: "Tác giả", count: authors, href: "/admin/tac-gia" },
    { label: "Khoảnh Khắc", count: moments, href: "/admin/khoanh-khac" },
    { label: "Sản phẩm affiliate", count: affiliateProducts, href: "/admin/affiliate" },
    { label: "Người dùng", count: users, href: "/admin/nguoi-dung" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="catalog-card block hover:bg-sidebar/40 hover:no-underline"
        >
          <p className="catalog-label mb-1">{card.label}</p>
          <p className="font-display text-3xl font-semibold text-ink">
            {card.count}
          </p>
        </Link>
      ))}
    </div>
  );
}
