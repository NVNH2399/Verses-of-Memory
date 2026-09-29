import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateMoment } from "@/lib/actions/admin-actions";

export default async function EditMomentPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string };
}) {
  const moment = await prisma.moment.findUnique({ where: { id: params.id } });
  if (!moment) notFound();

  const updateWithId = updateMoment.bind(null, moment.id);

  return (
    <div className="max-w-xl space-y-4">
      <h2 className="font-display text-lg font-semibold">Sửa Khoảnh Khắc</h2>

      {searchParams.error && (
        <p className="border border-dashed border-stamp/50 bg-stamp/[0.06] p-3 text-sm text-stamp">
          {searchParams.error}
        </p>
      )}

      <form action={updateWithId} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="catalog-label">Tiêu đề</label>
          <input id="title" name="title" required defaultValue={moment.title} className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="platform" className="catalog-label">Nền tảng</label>
          <select id="platform" name="platform" defaultValue={moment.platform} className="border border-border bg-paper px-3 py-2 text-sm">
            <option value="youtube">YouTube</option>
            <option value="tiktok">TikTok</option>
            <option value="facebook">Facebook</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="externalUrl" className="catalog-label">Link gốc (xem trên nền tảng)</label>
          <input id="externalUrl" name="externalUrl" type="url" required defaultValue={moment.externalUrl} className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="embedUrl" className="catalog-label">
            Link nhúng iframe (chỉ áp dụng cho YouTube)
          </label>
          <input id="embedUrl" name="embedUrl" type="url" defaultValue={moment.embedUrl ?? ""} className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="catalog-label">Mô tả</label>
          <textarea id="description" name="description" rows={3} defaultValue={moment.description ?? ""} className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="period" className="catalog-label">Thời kỳ liên quan (không bắt buộc)</label>
          <input id="period" name="period" defaultValue={moment.period ?? ""} className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="tags" className="catalog-label">Từ khoá (cách nhau bởi dấu phẩy)</label>
          <input id="tags" name="tags" defaultValue={moment.tags.join(", ")} className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>

        <button type="submit" className="border border-ink bg-ink px-4 py-2 font-mono text-xs uppercase tracking-wide text-paper hover:bg-transparent hover:text-ink">
          Cập nhật khoảnh khắc
        </button>
      </form>
    </div>
  );
}
