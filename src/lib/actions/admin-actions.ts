"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { slugify } from "@/lib/slugify";

function parseTags(raw: FormData): string[] {
  const raw_tags = String(raw.get("tags") ?? "");
  return raw_tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

// ---------------- Author ----------------

export async function createAuthor(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim() || null;
  const birthYear = formData.get("birthYear")
    ? Number(formData.get("birthYear"))
    : null;
  const deathYear = formData.get("deathYear")
    ? Number(formData.get("deathYear"))
    : null;
  const isPublicDomain = formData.get("isPublicDomain") === "on";

  if (!name) redirect("/admin/tac-gia/moi?error=Tên%20tác%20giả%20là%20bắt%20buộc");

  await prisma.author.create({
    data: {
      name,
      slug: slugify(name),
      bio,
      birthYear,
      deathYear,
      isPublicDomain,
    },
  });

  revalidatePath("/tac-gia");
  revalidatePath("/admin/tac-gia");
  redirect("/admin/tac-gia");
}

export async function updateAuthor(id: string, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim() || null;
  const birthYear = formData.get("birthYear")
    ? Number(formData.get("birthYear"))
    : null;
  const deathYear = formData.get("deathYear")
    ? Number(formData.get("deathYear"))
    : null;
  const isPublicDomain = formData.get("isPublicDomain") === "on";

  if (!name)
    redirect(`/admin/tac-gia/${id}/sua?error=Tên%20tác%20giả%20là%20bắt%20buộc`);

  await prisma.author.update({
    where: { id },
    data: { name, bio, birthYear, deathYear, isPublicDomain },
  });

  revalidatePath("/tac-gia");
  revalidatePath("/admin/tac-gia");
  redirect("/admin/tac-gia");
}

export async function deleteAuthor(id: string) {
  await requireAdmin();
  // Xoá tác giả sẽ lỗi nếu còn bài thơ tham chiếu (khoá ngoại) — chặn sớm cho rõ ràng.
  const poemCount = await prisma.poem.count({ where: { authorId: id } });
  if (poemCount > 0) {
    redirect(
      "/admin/tac-gia?error=Không%20thể%20xoá%3A%20tác%20giả%20còn%20bài%20thơ"
    );
  }
  await prisma.author.delete({ where: { id } });
  revalidatePath("/tac-gia");
  revalidatePath("/admin/tac-gia");
  redirect("/admin/tac-gia");
}

// ---------------- Poem ----------------

export async function createPoem(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const authorId = String(formData.get("authorId") ?? "");
  const period = String(formData.get("period") ?? "");
  const excerptOnly = formData.get("excerptOnly") === "on";
  const content = String(formData.get("content") ?? "").trim() || null;
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const sourceUrl = String(formData.get("sourceUrl") ?? "").trim() || null;
  const tags = parseTags(formData);

  if (!title || !authorId || !period) {
    redirect("/admin/tho/moi?error=Thiếu%20thông%20tin%20bắt%20buộc");
  }

  await prisma.poem.create({
    data: {
      title,
      slug: slugify(title),
      authorId,
      period,
      excerptOnly,
      content,
      excerpt,
      sourceUrl,
      tags,
    },
  });

  revalidatePath("/tho");
  revalidatePath("/admin/tho");
  redirect("/admin/tho");
}

export async function updatePoem(id: string, formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const authorId = String(formData.get("authorId") ?? "");
  const period = String(formData.get("period") ?? "");
  const excerptOnly = formData.get("excerptOnly") === "on";
  const content = String(formData.get("content") ?? "").trim() || null;
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const sourceUrl = String(formData.get("sourceUrl") ?? "").trim() || null;
  const tags = parseTags(formData);

  if (!title || !authorId || !period) {
    redirect(`/admin/tho/${id}/sua?error=Thiếu%20thông%20tin%20bắt%20buộc`);
  }

  await prisma.poem.update({
    where: { id },
    data: { title, authorId, period, excerptOnly, content, excerpt, sourceUrl, tags },
  });

  revalidatePath("/tho");
  revalidatePath("/admin/tho");
  redirect("/admin/tho");
}

export async function deletePoem(id: string) {
  await requireAdmin();
  await prisma.poem.delete({ where: { id } });
  revalidatePath("/tho");
  revalidatePath("/admin/tho");
  redirect("/admin/tho");
}

// ---------------- Moment ----------------

export async function createMoment(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const platform = String(formData.get("platform") ?? "youtube");
  const externalUrl = String(formData.get("externalUrl") ?? "").trim();
  const embedUrl = String(formData.get("embedUrl") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;
  const period = String(formData.get("period") ?? "").trim() || null;
  const tags = parseTags(formData);

  if (!title || !externalUrl) {
    redirect("/admin/khoanh-khac/moi?error=Thiếu%20thông%20tin%20bắt%20buộc");
  }

  await prisma.moment.create({
    data: { title, slug: slugify(title), platform, externalUrl, embedUrl, description, period, tags },
  });

  revalidatePath("/khoanh-khac");
  revalidatePath("/admin/khoanh-khac");
  redirect("/admin/khoanh-khac");
}

export async function updateMoment(id: string, formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const platform = String(formData.get("platform") ?? "youtube");
  const externalUrl = String(formData.get("externalUrl") ?? "").trim();
  const embedUrl = String(formData.get("embedUrl") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;
  const period = String(formData.get("period") ?? "").trim() || null;
  const tags = parseTags(formData);

  if (!title || !externalUrl) {
    redirect(`/admin/khoanh-khac/${id}/sua?error=Thiếu%20thông%20tin%20bắt%20buộc`);
  }

  await prisma.moment.update({
    where: { id },
    data: { title, platform, externalUrl, embedUrl, description, period, tags },
  });

  revalidatePath("/khoanh-khac");
  revalidatePath("/admin/khoanh-khac");
  redirect("/admin/khoanh-khac");
}

export async function deleteMoment(id: string) {
  await requireAdmin();
  await prisma.moment.delete({ where: { id } });
  revalidatePath("/khoanh-khac");
  revalidatePath("/admin/khoanh-khac");
  redirect("/admin/khoanh-khac");
}

// ---------------- AffiliateProduct ----------------

export async function createAffiliateProduct(formData: FormData) {
  await requireAdmin();
  const label = String(formData.get("label") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim() || null;
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
  const shopeeUrl = String(formData.get("shopeeUrl") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim() || null;

  if (!label || !shopeeUrl) {
    redirect("/admin/affiliate/moi?error=Thiếu%20thông%20tin%20bắt%20buộc");
  }

  await prisma.affiliateProduct.create({
    data: { label, price, imageUrl, shopeeUrl, note },
  });

  revalidatePath("/admin/affiliate");
  redirect("/admin/affiliate");
}

export async function updateAffiliateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const label = String(formData.get("label") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim() || null;
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
  const shopeeUrl = String(formData.get("shopeeUrl") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim() || null;

  if (!label || !shopeeUrl) {
    redirect(`/admin/affiliate/${id}/sua?error=Thiếu%20thông%20tin%20bắt%20buộc`);
  }

  await prisma.affiliateProduct.update({
    where: { id },
    data: { label, price, imageUrl, shopeeUrl, note },
  });

  revalidatePath("/admin/affiliate");
  redirect("/admin/affiliate");
}

export async function deleteAffiliateProduct(id: string) {
  await requireAdmin();
  await prisma.affiliateProduct.delete({ where: { id } });
  revalidatePath("/admin/affiliate");
  redirect("/admin/affiliate");
}

// ---------------- User (chỉ đổi role) ----------------

export async function toggleUserRole(id: string, currentRole: string) {
  const session = await requireAdmin();
  if (session.user.id === id) {
    // Không cho tự hạ quyền chính mình để tránh tự khoá khỏi trang quản trị
    redirect("/admin/nguoi-dung?error=Không%20thể%20tự%20đổi%20quyền%20của%20chính%20mình");
  }
  await prisma.user.update({
    where: { id },
    data: { role: currentRole === "ADMIN" ? "USER" : "ADMIN" },
  });
  revalidatePath("/admin/nguoi-dung");
  redirect("/admin/nguoi-dung");
}
