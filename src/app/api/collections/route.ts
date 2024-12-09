import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";
import { prisma } from "@/lib/prisma";

export const POST = auth(async function POST(req) {
  if (!req.auth?.user?.id) {
    return new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": "Bearer",
      },
    });
  }

  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const fullName = formData.get("fullName") as string;
    const gender = formData.get("gender") as string;
    const eyeColor = formData.get("eyeColor") as string;
    const hairColor = formData.get("hairColor") as string;
    const zipFile = formData.get("zipFile") as File;
    const photoCount = formData.get("photoCount");

    // Validate required fields
    if (
      !title ||
      !fullName ||
      !gender ||
      !eyeColor ||
      !hairColor ||
      !zipFile ||
      !photoCount
    ) {
      return new Response("Missing required fields", { status: 400 });
    }

    // Upload zip to S3
    const key = `collections/${req.auth.user.id}/${Date.now()}-${zipFile.name}`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        Body: Buffer.from(await zipFile.arrayBuffer()),
        ContentType: zipFile.type,
      })
    );

    // Create collection
    const collection = await prisma.gallery.create({
      data: {
        title,
        fullName,
        userId: req.auth.user.id,
        status: "PROCESSING",
        gender,
        eyeColor,
        hairColor,
        zipUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`,
        zipKey: key,
        photoCount: parseInt(formData.get("photoCount") as string),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        ZipArchive: {
          create: {
            url: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`,
            key: key,
            size: zipFile.size,
            fileCount: parseInt(formData.get("photoCount") as string),
          },
        },
      },
    });

    return NextResponse.json(collection);
  } catch (error) {
    console.error("Collection creation error:", error);
    return new Response("Failed to create collection", { status: 500 });
  }
});
