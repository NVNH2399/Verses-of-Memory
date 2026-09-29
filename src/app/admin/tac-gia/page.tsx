import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteAuthor } from "@/lib/actions/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminAuthorListPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const authors = await prisma.author.findMany({
    include: { _count: { select: { poems: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Quản lý Tác giả ({authors.length})</h2>
        <Link
          href="/admin/tac-gia/moi"
          className="border border-ink bg-ink px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-paper hover:bg-transparent hover:text-ink"
        >
          + Thêm tác giả
        </Link>
      </div>

      {searchParams.error && (
        <p className="border border-dashed border-stamp/50 bg-stamp/[0.06] p-3 text-sm text-stamp">
          {searchParams.error}
        </p>
      )}

      <ul className="border border-border">
        {authors.map((author) => (
          <li
            key={author.id}
            className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 last:border-b-0 odd:bg-surface even:bg-sidebar/40"
          >
            <div className="min-w-0">
              <p className="font-medium">{author.name}</p>
              <p className="text-xs text-muted">
                {author._count.poems} bài ·{" "}
                {author.isPublicDomain ? "công cộng" : "còn bản quyền"}
              </p>
            </div>
            <div className="flex shrink-0 gap-3 text-sm">
              <Link href={`/tac-gia/${author.slug}`} className="hover:underline" target="_blank">
                Xem
              </Link>
              <Link href={`/admin/tac-gia/${author.id}/sua`} className="hover:underline">
                Sửa
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deleteAuthor(author.id);
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
