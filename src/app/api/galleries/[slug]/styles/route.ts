import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = auth(async function POST(req, context) {
  const params = await context.params;
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  if (!req.auth?.user?.id || !slug) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { styles } = await req.json();

    if (!Array.isArray(styles) || styles.length !== 2) {
      return NextResponse.json(
        { error: "Invalid styles selection" },
        { status: 400 }
      );
    }

    const gallery = await prisma.gallery.update({
      where: {
        slug: slug,
        userId: req.auth.user.id,
      },
      data: {
        selectedStyles: styles,
      },
    });

    return NextResponse.json(gallery);
  } catch (error) {
    console.error("Style selection error:", error);
    return NextResponse.json(
      { error: "Failed to update styles" },
      { status: 500 }
    );
  }
});
