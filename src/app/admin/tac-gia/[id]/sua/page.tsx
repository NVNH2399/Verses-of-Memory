import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateAuthor } from "@/lib/actions/admin-actions";

export default async function EditAuthorPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string };
}) {
  const author = await prisma.author.findUnique({ where: { id: params.id } });
  if (!author) notFound();

  const updateWithId = updateAuthor.bind(null, author.id);

  return (
    <div className="max-w-lg space-y-4">
      <h2 className="font-display text-lg font-semibold">Sửa tác giả</h2>

      {searchParams.error && (
        <p className="border border-dashed border-stamp/50 bg-stamp/[0.06] p-3 text-sm text-stamp">
          {searchParams.error}
        </p>
      )}

      <form action={updateWithId} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="catalog-label">Tên tác giả</label>
          <input id="name" name="name" required defaultValue={author.name} className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="bio" className="catalog-label">Tiểu sử ngắn</label>
          <textarea id="bio" name="bio" rows={3} defaultValue={author.bio ?? ""} className="border border-border bg-paper px-3 py-2 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="birthYear" className="catalog-label">Năm sinh</label>
            <input id="birthYear" name="birthYear" type="number" defaultValue={author.birthYear ?? ""} className="border border-border bg-paper px-3 py-2 text-sm" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="deathYear" className="catalog-label">Năm mất</label>
            <input id="deathYear" name="deathYear" type="number" defaultValue={author.deathYear ?? ""} className="border border-border bg-paper px-3 py-2 text-sm" />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isPublicDomain" defaultChecked={author.isPublicDomain} className="border border-border" />
          Thuộc phạm vi công cộng (mất trên 50 năm)
        </label>
        <button type="submit" className="border border-ink bg-ink px-4 py-2 font-mono text-xs uppercase tracking-wide text-paper hover:bg-transparent hover:text-ink">
          Cập nhật tác giả
        </button>
      </form>
    </div>
  );
}
