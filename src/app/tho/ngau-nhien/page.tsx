import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function RandomPoemPage() {
  const count = await prisma.poem.count();

  if (count === 0) {
    redirect("/tho");
  }

  const skip = Math.floor(Math.random() * count);
  const [poem] = await prisma.poem.findMany({
    take: 1,
    skip,
    select: { slug: true },
  });

  redirect(poem ? `/tho/${poem.slug}` : "/tho");
}
