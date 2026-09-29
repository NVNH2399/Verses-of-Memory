import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

/**
 * Bảo vệ tầng Server Component / Server Action: chỉ cho phép người dùng có
 * role ADMIN đi tiếp. Middleware đã chặn ở cấp route, hàm này là lớp bảo vệ
 * thứ hai (defense in depth) — dùng ở đầu mỗi trang/action trong /admin.
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dang-nhap");
  }
  return session;
}
