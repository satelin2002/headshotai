import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";
import { prisma } from "@/lib/prisma";
import { validateUser } from "@/lib/auth-utils";
import { type Ethnicity } from "@prisma/client";

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

export const GET = auth(async function GET(req) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    try {
      await validateUser(req.auth.user.id);
    } catch (error) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const models = await prisma.model.findMany({
      where: {
        userId: req.auth.user.id,
      },
      include: {
        generatedPhotos: {
          select: {
            url: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(models);
  } catch (error) {
    console.error("[MODELS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});

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
    const age = parseInt(formData.get("age") as string);
    const ethnicity = formData.get("ethnicity") as string;
    const photoCount = parseInt(formData.get("photoCount") as string);
    const zipFile = formData.get("zipFile") as File;

    // Validate required fields
    if (
      !title ||
      !fullName ||
      !gender ||
      !eyeColor ||
      !hairColor ||
      !age ||
      !ethnicity ||
      !zipFile
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate age
    if (age < 18) {
      return NextResponse.json(
        { error: "Must be 18 or older" },
        { status: 400 }
      );
    }

    // Check for existing model with same name
    const existingModel = await prisma.model.findFirst({
      where: {
        userId: req.auth.user.id,
        title: title.trim(),
        status: { not: "EXPIRED" },
      },
      include: {
        ZipArchive: true,
      },
    });

    if (existingModel?.ZipArchive?.key) {
      // Delete old zip file from S3
      try {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: existingModel.ZipArchive.key,
          })
        );
      } catch (error) {
        console.error("Failed to delete old S3 object:", error);
      }

      // Delete old model
      await prisma.model.delete({
        where: { id: existingModel.id },
      });
    }

    // Create new S3 key and continue with upload
    const sanitizedTitle = sanitizeFileName(title);
    const key = `models/${
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

    // Create model with error handling
    try {
      const slug = generateSlug(title, req.auth.user.id);

      const model = await prisma.model.create({
        data: {
          title,
          slug,
          fullName,
          userId: req.auth.user.id,
          status: "PROCESSING",
          gender,
          eyeColor,
          hairColor,
          age,
          ethnicity: ethnicity as Ethnicity,
          zipUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`,
          zipKey: key,
          photoCount,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          ZipArchive: {
            create: {
              url: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`,
              key: key,
              size: zipFile.size,
              fileCount: photoCount,
            },
          },
        },
      });

      if (!model) {
        throw new Error("Failed to create model record");
      }

      console.log(model);

      return NextResponse.json(model);
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to save model" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Model creation error:", error);
    return NextResponse.json(
      { error: "Failed to create model" },
      { status: 500 }
    );
  }
});
