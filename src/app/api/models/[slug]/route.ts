import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateUser } from "@/lib/auth-utils";

export const GET = auth(async function GET(req) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await validateUser(req.auth.user.id);
  } catch (error) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }
  const slug = req.url.split("/").pop();

  if (!slug) {
    return new NextResponse("Model slug is required", { status: 400 });
  }

  try {
    // Get the model with its photos
    const model = await prisma.model.findUnique({
      where: {
        slug: slug,
        userId: req.auth.user.id,
      },
      include: {
        generatedPhotos: true,
      },
    });

    if (!model) {
      return new NextResponse("Model not found", { status: 404 });
    }

    return NextResponse.json(model);
  } catch (error) {
    console.error("[MODEL_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
});
