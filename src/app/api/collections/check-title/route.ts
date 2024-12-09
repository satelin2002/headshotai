import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = auth(async function POST(req) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title } = await req.json();

    const existingCollection = await prisma.gallery.findFirst({
      where: {
        userId: req.auth.user.id,
        title: title.trim(),
        status: { not: "EXPIRED" },
      },
    });

    return NextResponse.json({ exists: !!existingCollection });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check title" },
      { status: 500 }
    );
  }
});
