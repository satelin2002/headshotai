import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";
import { prisma } from "@/lib/prisma";
import { validateUser } from "@/lib/auth-utils";
import { type Ethnicity } from "@prisma/client";
import { replicate } from "@/lib/replicate";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import JSZip from "jszip";

function sanitizeFileName(name: string): string {
  console.log("[sanitizeFileName] Input name:", name);
  const sanitized = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphens
    .replace(/(^-|-$)/g, ""); // Remove leading/trailing hyphens
  console.log("[sanitizeFileName] Sanitized output:", sanitized);
  return sanitized;
}

function generateSlug(title: string): string {
  console.log("[generateSlug] Input title:", title);
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Add a unique identifier to ensure uniqueness
  const uniqueId = Math.random().toString(36).slice(2, 7);
  const slug = `${base}-${uniqueId}`;
  console.log("[generateSlug] Generated slug:", slug);
  return slug;
}

function generateTriggerWord(title: string, fullName: string): string {
  console.log("[generateTriggerWord] Inputs:", { title, fullName });
  // Take first two letters of first and last name
  const [firstName] = fullName.split(" ");
  const namePart = firstName.slice(0, 2).toUpperCase();

  // Add FLUX suffix
  const triggerWord = `${namePart}_FLUX`;
  console.log("[generateTriggerWord] Generated trigger word:", triggerWord);
  return triggerWord;
}

export const GET = auth(async function GET(req) {
  console.log("[GET] Request received");
  if (!req.auth?.user?.id) {
    console.log("[GET] Unauthorized - no user ID");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    try {
      console.log("[GET] Validating user:", req.auth.user.id);
      await validateUser(req.auth.user.id);
    } catch (error) {
      console.log("[GET] User validation failed:", error);
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    console.log("[GET] Fetching models for user:", req.auth.user.id);
    const models = await prisma.model.findMany({
      where: {
        userId: req.auth.user.id,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        createdAt: true,
        coverImage: true,
        photoCount: true,
        expiresAt: true,
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

    console.log("[GET] Found models:", models);

    return NextResponse.json(models);
  } catch (error) {
    console.error("[GET] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});

export const POST = auth(async function POST(req) {
  console.log("[POST] Request received");
  if (!req.auth?.user?.id) {
    console.log("[POST] Unauthorized - no user ID");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Validate user
    try {
      console.log("[POST] Validating user:", req.auth.user.id);
      await validateUser(req.auth.user.id);
    } catch (error) {
      console.log("[POST] User validation failed:", error);
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const formData = await req.formData();
    console.log("[POST] Form data received");
    const title = formData.get("title") as string;
    const fullName = formData.get("fullName") as string;
    const gender = formData.get("gender") as string;
    const eyeColor = formData.get("eyeColor") as string;
    const hairColor = formData.get("hairColor") as string;
    const age = parseInt(formData.get("age") as string);
    const ethnicity = formData.get("ethnicity") as string;
    const photoCount = parseInt(formData.get("photoCount") as string);
    const zipFile = formData.get("zipFile") as File;

    console.log("[POST] Parsed form data:", {
      title,
      fullName,
      gender,
      eyeColor,
      hairColor,
      age,
      ethnicity,
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
      !age ||
      !ethnicity ||
      !zipFile
    ) {
      console.log("[POST] Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate age
    if (age < 18) {
      console.log("[POST] Age validation failed:", age);
      return NextResponse.json(
        { error: "Must be 18 or older" },
        { status: 400 }
      );
    }

    // Check for existing model with same name
    console.log("[POST] Checking for existing model with title:", title);
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
      console.log("[POST] Found existing model, deleting old files");
      // Try to delete old zip file from S3, but don't block if it fails
      try {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: existingModel.ZipArchive.key,
          })
        );
        console.log("[POST] Successfully deleted old S3 file");
      } catch (error) {
        // Log error but continue with model creation
        console.warn("[POST] S3 deletion failed, continuing anyway:", error);
      }

      // Delete old model from database
      console.log("[POST] Deleting old model from database");
      await prisma.model.delete({
        where: { id: existingModel.id },
      });
    }

    // Create new S3 key and continue with upload
    const sanitizedTitle = sanitizeFileName(title);
    const modelBasePath = `models/${req.auth.user.id}/${sanitizedTitle}`;
    const key = `${modelBasePath}/photos.zip`;
    console.log("[POST] Generated S3 paths:", { modelBasePath, key });

    // Extract a random image from the zip file to use as cover
    console.log("[POST] Processing zip file");
    const zipBuffer = Buffer.from(await zipFile.arrayBuffer());
    const zip = await JSZip.loadAsync(zipBuffer);

    // Get all image files from the zip
    const imageFiles = Object.values(zip.files).filter(
      (file) =>
        !file.dir &&
        (file.name.endsWith(".jpg") ||
          file.name.endsWith(".jpeg") ||
          file.name.endsWith(".png") ||
          file.name.endsWith(".webp"))
    );
    console.log("[POST] Found image files in zip:", imageFiles.length);

    // Select first image as cover
    const coverImage = imageFiles[0];
    const imageBuffer = await coverImage.async("nodebuffer");
    // Upload the cover image to S3 with consistent name
    const extension = coverImage.name.split(".").pop();
    const coverImageKey = `${modelBasePath}/cover.${extension}`;
    console.log("[POST] Preparing cover image:", { coverImageKey });

    console.log("[POST] Uploading cover image to S3");
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: coverImageKey,
        Body: imageBuffer,
        ContentType: `image/${extension}`,
      })
    );

    try {
      console.log("[POST] Uploading zip file to S3");
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: key,
          Body: zipBuffer,
          ContentType: zipFile.type,
        })
      );
    } catch (s3Error) {
      console.error("[POST] S3 upload error:", s3Error);
      return NextResponse.json(
        { error: "Failed to upload files" },
        { status: 500 }
      );
    }

    // Generate a pre-signed URL valid for 1 hour
    console.log("[POST] Generating pre-signed URL");
    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
      }),
      { expiresIn: 3600 } // 1 hour in seconds
    );

    // Create model with error handling
    try {
      const slug = generateSlug(title);
      const triggerWord = generateTriggerWord(title, fullName);

      // Create the model record first
      console.log("[POST] Creating model record");
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
          triggerWord,
          coverImage: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${coverImageKey}`,
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
        console.log("[POST] Failed to create model record");
        throw new Error("Failed to create model record");
      }

      const modelName = `${fullName.toLowerCase().replace(/\s+/g, "-")}-${
        model.slug
      }`;
      console.log("[POST] Generated model name:", modelName);

      // First create the model on Replicate
      try {
        console.log("[POST] Creating Replicate model");
        await replicate.models.create(
          process.env.REPLICATE_USERNAME!,
          modelName,
          {
            visibility: "private",
            hardware: "gpu-t4",
            description: `Fine-tuned model for ${fullName} (${gender}, ${age}, ${ethnicity})`,
          }
        );
      } catch (error) {
        console.error("[POST] Failed to create Replicate model:", error);
        throw error;
      }

      const trainingConfig = {
        baseModel: {
          owner: "ostris",
          model: "flux-dev-lora-trainer",
          version:
            "e440909d3512c31646ee2e0c7d6f6f4923224863a6a10c494606e79fb5844497",
          destination:
            `${process.env.REPLICATE_USERNAME}/${modelName}` as const,
        },
        parameters: {
          steps: 2000,
          lora_rank: 16,
          optimizer: "adamw8bit",
          batch_size: 1,
          resolution: "512,768,1024",
          autocaption: true,
          autocaption_prefix: `a photo of ${triggerWord}, a ${age} year old ${ethnicity.toLowerCase()} ${gender.toLowerCase()} with ${eyeColor.toLowerCase()} eyes and ${hairColor.toLowerCase()} hair, `,
          input_images: signedUrl,
          trigger_word: triggerWord,
          learning_rate: 0.0004,
          wandb_project: "flux_train_replicate",
          wandb_save_interval: 100,
          caption_dropout_rate: 0.05,
          cache_latents_to_disk: false,
          wandb_sample_interval: 100,
        },
      };
      console.log("[POST] Created training config:", trainingConfig);

      // Start the fine-tuning process with Replicate
      console.log("[POST] Starting Replicate training");
      const training = await replicate.trainings.create(
        trainingConfig.baseModel.owner,
        trainingConfig.baseModel.model,
        trainingConfig.baseModel.version,
        {
          destination: trainingConfig.baseModel.destination,
          input: {
            ...trainingConfig.parameters,
            input_images: signedUrl,
            trigger_word: triggerWord,
          },
          webhook: `${process.env.NEXT_PUBLIC_URL}/api/webhooks/replicate/training`,
          webhook_events_filter: ["start", "completed"],
        }
      );
      console.log("[POST] Training started:", training);

      // Update model with training information
      console.log("[POST] Updating model with training info");
      await prisma.model.update({
        where: { id: model.id },
        data: {
          trainingId: training.id,
          status: "TRAINING",
          trainingConfig,
          replicateData: JSON.parse(JSON.stringify(training)),
          trainingStatus: "started",
          trainingStarted: new Date(),
          triggerWord,
        },
      });

      console.log("[POST] Successfully created and started training model");
      return NextResponse.json(model);
    } catch (dbError) {
      console.error("[POST] Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to save model" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[POST] Model creation error:", error);
    return NextResponse.json(
      { error: "Failed to create model" },
      { status: 500 }
    );
  }
});
