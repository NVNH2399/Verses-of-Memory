import { createMoment } from "@/lib/actions/admin-actions";

export default function NewMomentPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="max-w-xl space-y-4">
      <h2 className="font-display text-lg font-semibold">Thêm Khoảnh Khắc</h2>

      {searchParams.error && (
        <p className="border border-dashed border-stamp/50 bg-stamp/[0.06] p-3 text-sm text-stamp">
          {searchParams.error}
        </p>
      )}

      <form action={createMoment} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="catalog-label">Tiêu đề</label>
          <input id="title" name="title" required className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="platform" className="catalog-label">Nền tảng</label>
          <select id="platform" name="platform" className="border border-border bg-paper px-3 py-2 text-sm">
            <option value="youtube">YouTube</option>
            <option value="tiktok">TikTok</option>
            <option value="facebook">Facebook</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="externalUrl" className="catalog-label">Link gốc (xem trên nền tảng)</label>
          <input id="externalUrl" name="externalUrl" type="url" required className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="embedUrl" className="catalog-label">
            Link nhúng iframe (chỉ áp dụng cho YouTube, dạng .../embed/VIDEO_ID)
          </label>
          <input id="embedUrl" name="embedUrl" type="url" className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="catalog-label">Mô tả</label>
          <textarea id="description" name="description" rows={3} className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="period" className="catalog-label">Thời kỳ liên quan (không bắt buộc)</label>
          <input id="period" name="period" placeholder="chống Pháp / chống Mỹ" className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="tags" className="catalog-label">Từ khoá (cách nhau bởi dấu phẩy)</label>
          <input id="tags" name="tags" className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>

        <button type="submit" className="border border-ink bg-ink px-4 py-2 font-mono text-xs uppercase tracking-wide text-paper hover:bg-transparent hover:text-ink">
          Lưu khoảnh khắc
        </button>
      </form>
    </div>
  );
}
