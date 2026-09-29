import { prisma } from "@/lib/prisma";
import { toggleUserRole } from "@/lib/actions/admin-actions";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

export default async function AdminUserListPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const session = await requireAdmin();
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-semibold">
        Quản lý người dùng ({users.length})
      </h2>

      {searchParams.error && (
        <p className="border border-dashed border-stamp/50 bg-stamp/[0.06] p-3 text-sm text-stamp">
          {searchParams.error}
        </p>
      )}

      <ul className="border border-border">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 last:border-b-0 odd:bg-surface even:bg-sidebar/40"
          >
            <div className="min-w-0">
              <p className="font-medium">
                {user.name ?? user.email}
                {user.id === session.user.id && (
                  <span className="ml-2 catalog-label">bạn</span>
                )}
              </p>
              <p className="text-xs text-muted">{user.email}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-sm">
              <span className="stamp-badge">{user.role}</span>
              {user.id !== session.user.id && (
                <form
                  action={async () => {
                    "use server";
                    await toggleUserRole(user.id, user.role);
                  }}
                >
                  <button type="submit" className="hover:underline">
                    {user.role === "ADMIN" ? "Hạ xuống USER" : "Nâng lên ADMIN"}
                  </button>
                </form>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
