import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mục lục tác giả | Verses of Memory",
};

function firstLetter(name: string) {
  // Lấy chữ cái đầu của TỪ CUỐI trong tên (thường là tên gọi/bút danh chính ở tiếng Việt)
  // vd: "Nguyễn Đình Chiểu" -> nhóm theo "C" (Chiểu)
  const parts = name.trim().split(/\s+/);
  const lastWord = parts[parts.length - 1];
  return lastWord.charAt(0).toLocaleUpperCase("vi");
}

export default async function AuthorIndexPage() {
  const authors = await prisma.author.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { poems: true } } },
  });

  const groups = new Map<string, typeof authors>();
  for (const author of authors) {
    const letter = firstLetter(author.name);
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter)!.push(author);
  }
  const letters = Array.from(groups.keys()).sort((a, b) =>
    a.localeCompare(b, "vi")
  );

  return (
    <div className="space-y-6">
      <nav className="font-mono text-[11px] uppercase tracking-wide text-muted">
        <Link href="/" className="hover:underline">
          Trang chủ
        </Link>{" "}
        / Mục lục tác giả
      </nav>

      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Mục lục tác giả
        </h1>
        <p className="mt-1 text-sm text-muted">
          {authors.length} tác giả, sắp xếp theo ngăn kéo A–Z (dựa theo tên gọi
          chính).
        </p>
      </div>

      {letters.length === 0 ? (
        <p className="border border-dashed border-border p-6 text-center text-sm text-muted">
          Thư viện chưa có tác giả nào.
        </p>
      ) : (
        <div className="space-y-6">
          {/* Thanh nhảy nhanh tới từng ngăn chữ cái */}
          <div className="flex flex-wrap gap-1 border border-dashed border-border bg-sidebar p-2">
            {letters.map((letter) => (
              <a
                key={letter}
                href={`#chu-${letter}`}
                className="flex h-7 w-7 items-center justify-center font-mono text-xs text-ink hover:bg-border/60"
              >
                {letter}
              </a>
            ))}
          </div>

          {letters.map((letter) => (
            <section key={letter} id={`chu-${letter}`}>
              <h2 className="catalog-label mb-2 border-b border-border pb-1">
                Ngăn {letter}
              </h2>
              <ul className="border border-border">
                {groups.get(letter)!.map((author) => (
                  <li
                    key={author.id}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border px-4 py-3 last:border-b-0 odd:bg-surface even:bg-sidebar/40"
                  >
                    <div>
                      <Link
                        href={`/tac-gia/${author.slug}`}
                        className="font-display font-medium hover:underline"
                      >
                        {author.name}
                      </Link>
                      <span className="ml-2 text-sm text-muted">
                        ({author.birthYear ?? "?"}–{author.deathYear ?? "nay"})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="stamp-badge">
                        {author.isPublicDomain ? "công cộng" : "còn bản quyền"}
                      </span>
                      <span className="catalog-label">
                        {author._count.poems} bài
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
