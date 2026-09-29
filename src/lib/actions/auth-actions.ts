"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function registerUser(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/dang-ky?error=Vui%20lòng%20nhập%20đầy%20đủ%20email%20và%20mật%20khẩu");
  }
  if (password.length < 8) {
    redirect("/dang-ky?error=Mật%20khẩu%20cần%20ít%20nhất%208%20ký%20tự");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirect("/dang-ky?error=Email%20này%20đã%20được%20đăng%20ký");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      name: name || null,
      email,
      passwordHash,
      role: "USER", // tài khoản tự đăng ký luôn là USER; nâng lên ADMIN qua trang quản trị
    },
  });

  redirect("/dang-nhap?registered=1");
}
