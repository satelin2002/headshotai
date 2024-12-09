import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";
import { prisma } from "@/lib/prisma";
import { validateUser } from "@/lib/auth-utils";

// Add this helper function at the top
function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphens
    .replace(/(^-|-$)/g, ""); // Remove leading/trailing hyphens
}

function generateSlug(title: string, userId: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Add a unique identifier to ensure uniqueness
  const uniqueId = Math.random().toString(36).slice(2, 7);
  return `${base}-${uniqueId}`;
}

export const POST = auth(async function POST(req) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Validate user
    try {
      await validateUser(req.auth.user.id);
    } catch (error) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const fullName = formData.get("fullName") as string;
    const gender = formData.get("gender") as string;
    const eyeColor = formData.get("eyeColor") as string;
    const hairColor = formData.get("hairColor") as string;
    const zipFile = formData.get("zipFile") as File;
    const photoCount = formData.get("photoCount");

    // Add validation logging
    console.log("Received data:", {
      title,
      fullName,
      gender,
      eyeColor,
      hairColor,
      photoCount,
      zipFileSize: zipFile?.size,
    });

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
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check for existing collection with same name
    const existingCollection = await prisma.gallery.findFirst({
      where: {
        userId: req.auth.user.id,
        title: title.trim(),
        status: { not: "EXPIRED" },
      },
      include: {
        ZipArchive: true,
      },
    });

    if (existingCollection?.ZipArchive?.key) {
      // Delete old zip file from S3
      try {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: existingCollection.ZipArchive.key,
          })
        );
      } catch (error) {
        console.error("Failed to delete old S3 object:", error);
      }

      // Delete old collection
      await prisma.gallery.delete({
        where: { id: existingCollection.id },
      });
    }

    // Create new S3 key and continue with upload
    const sanitizedTitle = sanitizeFileName(title);
    const key = `collections/${
      req.auth.user.id
    }/${sanitizedTitle}/${Date.now()}-photos.zip`;

    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: key,
          Body: Buffer.from(await zipFile.arrayBuffer()),
          ContentType: zipFile.type,
        })
      );
    } catch (s3Error) {
      console.error("S3 upload error:", s3Error);
      return NextResponse.json(
        { error: "Failed to upload files" },
        { status: 500 }
      );
    }

    // Create collection with error handling
    try {
      const slug = generateSlug(title, req.auth.user.id);

      const collection = await prisma.gallery.create({
        data: {
          title,
          slug,
          fullName,
          userId: req.auth.user.id,
          status: "PROCESSING",
          gender,
          eyeColor,
          hairColor,
          zipUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`,
          zipKey: key,
          photoCount: parseInt(photoCount as string),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          ZipArchive: {
            create: {
              url: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`,
              key: key,
              size: zipFile.size,
              fileCount: parseInt(photoCount as string),
            },
          },
        },
      });

      if (!collection) {
        throw new Error("Failed to create collection record");
      }

      console.log(collection);

      return NextResponse.json(collection);
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to save collection" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Collection creation error:", error);
    return NextResponse.json(
      { error: "Failed to create collection" },
      { status: 500 }
    );
  }
});
