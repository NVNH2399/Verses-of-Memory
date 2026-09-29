import { createAffiliateProduct } from "@/lib/actions/admin-actions";

export default function NewAffiliateProductPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="max-w-lg space-y-4">
      <h2 className="font-display text-lg font-semibold">Thêm sản phẩm affiliate</h2>

      {searchParams.error && (
        <p className="border border-dashed border-stamp/50 bg-stamp/[0.06] p-3 text-sm text-stamp">
          {searchParams.error}
        </p>
      )}

      <form action={createAffiliateProduct} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="label" className="catalog-label">Tên sản phẩm</label>
          <input id="label" name="label" required className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="price" className="catalog-label">Giá hiển thị</label>
          <input id="price" name="price" placeholder="129.000đ" className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="imageUrl" className="catalog-label">Link ảnh sản phẩm</label>
          <input id="imageUrl" name="imageUrl" type="url" className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="shopeeUrl" className="catalog-label">Link affiliate Shopee</label>
          <input id="shopeeUrl" name="shopeeUrl" type="url" required className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="note" className="catalog-label">Ghi chú ngắn</label>
          <textarea id="note" name="note" rows={2} className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>
        <button type="submit" className="border border-ink bg-ink px-4 py-2 font-mono text-xs uppercase tracking-wide text-paper hover:bg-transparent hover:text-ink">
          Lưu sản phẩm
        </button>
      </form>
    </div>
  );
}
