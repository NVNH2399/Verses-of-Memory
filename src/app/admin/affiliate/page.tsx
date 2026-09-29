import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteAffiliateProduct } from "@/lib/actions/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminAffiliateListPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const products = await prisma.affiliateProduct.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">
          Quản lý Affiliate ({products.length})
        </h2>
        <Link
          href="/admin/affiliate/moi"
          className="border border-ink bg-ink px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-paper hover:bg-transparent hover:text-ink"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      <p className="catalog-label border border-dashed border-border bg-sidebar/60 p-3 normal-case tracking-normal">
        Nhớ dùng link affiliate Shopee thật (có mã aff_id của bạn) và đảm bảo
        nhãn "Liên kết tiếp thị" luôn hiển thị công khai ở trang người dùng.
      </p>

      {searchParams.error && (
        <p className="border border-dashed border-stamp/50 bg-stamp/[0.06] p-3 text-sm text-stamp">
          {searchParams.error}
        </p>
      )}

      <ul className="border border-border">
        {products.map((product) => (
          <li
            key={product.id}
            className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 last:border-b-0 odd:bg-surface even:bg-sidebar/40"
          >
            <div className="min-w-0">
              <p className="font-medium">{product.label}</p>
              <p className="text-xs text-muted">{product.price}</p>
            </div>
            <div className="flex shrink-0 gap-3 text-sm">
              <a href={product.shopeeUrl} target="_blank" rel="noreferrer" className="hover:underline">
                Xem link
              </a>
              <Link href={`/admin/affiliate/${product.id}/sua`} className="hover:underline">
                Sửa
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deleteAffiliateProduct(product.id);
                }}
              >
                <button type="submit" className="text-stamp hover:underline">
                  Xoá
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
