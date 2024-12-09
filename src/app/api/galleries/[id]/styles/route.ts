import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = auth(async function POST(req, context) {
  if (!req.auth?.user?.id || !context.params?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { styles } = await req.json();

    if (!Array.isArray(styles) || styles.length !== 2) {
      return new Response("Invalid styles selection", { status: 400 });
    }

    const gallery = await prisma.gallery.update({
      where: {
        id: context.params.id as string,
        userId: req.auth.user.id,
      },
      data: {
        selectedStyles: styles,
      },
    });

    return NextResponse.json(gallery);
  } catch (error) {
    console.error("Style selection error:", error);
    return new Response("Failed to update styles", { status: 500 });
  }
});
