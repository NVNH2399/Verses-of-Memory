import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateAffiliateProduct } from "@/lib/actions/admin-actions";

export default async function EditAffiliateProductPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string };
}) {
  const product = await prisma.affiliateProduct.findUnique({ where: { id: params.id } });
  if (!product) notFound();

  const updateWithId = updateAffiliateProduct.bind(null, product.id);

  return (
    <div className="max-w-lg space-y-4">
      <h2 className="font-display text-lg font-semibold">Sửa sản phẩm affiliate</h2>

      {searchParams.error && (
        <p className="border border-dashed border-stamp/50 bg-stamp/[0.06] p-3 text-sm text-stamp">
          {searchParams.error}
        </p>
      )}

      <form action={updateWithId} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="label" className="catalog-label">Tên sản phẩm</label>
          <input id="label" name="label" required defaultValue={product.label} className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="price" className="catalog-label">Giá hiển thị</label>
          <input id="price" name="price" defaultValue={product.price ?? ""} className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="imageUrl" className="catalog-label">Link ảnh sản phẩm</label>
          <input id="imageUrl" name="imageUrl" type="url" defaultValue={product.imageUrl ?? ""} className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="shopeeUrl" className="catalog-label">Link affiliate Shopee</label>
          <input id="shopeeUrl" name="shopeeUrl" type="url" required defaultValue={product.shopeeUrl} className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="note" className="catalog-label">Ghi chú ngắn</label>
          <textarea id="note" name="note" rows={2} defaultValue={product.note ?? ""} className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>
        <button type="submit" className="border border-ink bg-ink px-4 py-2 font-mono text-xs uppercase tracking-wide text-paper hover:bg-transparent hover:text-ink">
          Cập nhật sản phẩm
        </button>
      </form>
    </div>
  );
}
