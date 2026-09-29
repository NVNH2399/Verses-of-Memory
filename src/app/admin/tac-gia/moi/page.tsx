import { createAuthor } from "@/lib/actions/admin-actions";

export default function NewAuthorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="max-w-lg space-y-4">
      <h2 className="font-display text-lg font-semibold">Thêm tác giả</h2>

      {searchParams.error && (
        <p className="border border-dashed border-stamp/50 bg-stamp/[0.06] p-3 text-sm text-stamp">
          {searchParams.error}
        </p>
      )}

      <form action={createAuthor} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="catalog-label">Tên tác giả</label>
          <input id="name" name="name" required className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="bio" className="catalog-label">Tiểu sử ngắn</label>
          <textarea id="bio" name="bio" rows={3} className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="birthYear" className="catalog-label">Năm sinh</label>
            <input id="birthYear" name="birthYear" type="number" className="border border-border bg-paper px-3 py-2 text-sm" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="deathYear" className="catalog-label">Năm mất</label>
            <input id="deathYear" name="deathYear" type="number" className="border border-border bg-paper px-3 py-2 text-sm" />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isPublicDomain" className="border border-border" />
          Thuộc phạm vi công cộng (mất trên 50 năm)
        </label>
        <button type="submit" className="border border-ink bg-ink px-4 py-2 font-mono text-xs uppercase tracking-wide text-paper hover:bg-transparent hover:text-ink">
          Lưu tác giả
        </button>
      </form>
    </div>
  );
}
