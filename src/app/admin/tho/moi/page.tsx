import { prisma } from "@/lib/prisma";
import { createPoem } from "@/lib/actions/admin-actions";

const PERIODS = ["chống Pháp", "chống Mỹ", "khác"];

export default async function NewPoemPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const authors = await prisma.author.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="max-w-xl space-y-4">
      <h2 className="font-display text-lg font-semibold">Thêm bài thơ</h2>

      {searchParams.error && (
        <p className="border border-dashed border-stamp/50 bg-stamp/[0.06] p-3 text-sm text-stamp">
          {searchParams.error}
        </p>
      )}

      <form action={createPoem} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="catalog-label">Tiêu đề</label>
          <input id="title" name="title" required className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="authorId" className="catalog-label">Tác giả</label>
          <select id="authorId" name="authorId" required className="border border-border bg-paper px-3 py-2 text-sm">
            <option value="">— Chọn tác giả —</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="period" className="catalog-label">Thời kỳ</label>
          <select id="period" name="period" required className="border border-border bg-paper px-3 py-2 text-sm">
            {PERIODS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="tags" className="catalog-label">Từ khoá (cách nhau bởi dấu phẩy)</label>
          <input id="tags" name="tags" placeholder="chống Pháp, quê hương" className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="excerptOnly" className="border border-border" />
          Chỉ hiển thị trích đoạn (tác giả còn bản quyền)
        </label>

        <div className="flex flex-col gap-1">
          <label htmlFor="content" className="catalog-label">Nội dung đầy đủ</label>
          <textarea id="content" name="content" rows={6} className="border border-border bg-paper px-3 py-2 text-sm font-serif" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="excerpt" className="catalog-label">Trích đoạn</label>
          <textarea id="excerpt" name="excerpt" rows={3} className="border border-border bg-paper px-3 py-2 text-sm font-serif" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="sourceUrl" className="catalog-label">Link nguồn (nếu là trích đoạn)</label>
          <input id="sourceUrl" name="sourceUrl" type="url" className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>

        <button type="submit" className="border border-ink bg-ink px-4 py-2 font-mono text-xs uppercase tracking-wide text-paper hover:bg-transparent hover:text-ink">
          Lưu bài thơ
        </button>
      </form>
    </div>
  );
}
