import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    console.log("[REPLICATE_WEBHOOK] Received webhook request");
    const payload = await req.json();

    if (!payload || typeof payload !== "object") {
      console.log("[REPLICATE_WEBHOOK] Invalid payload received:", payload);
      return new NextResponse("Invalid payload", { status: 400 });
    }

    const { status, id, output, error } = payload;
    console.log("[REPLICATE_WEBHOOK] Payload:", { status, id, output, error });

    if (!id) {
      console.log("[REPLICATE_WEBHOOK] Missing training ID");
      return new NextResponse("Missing training ID", { status: 400 });
    }

    // Find the model with this training ID
    console.log("[REPLICATE_WEBHOOK] Finding model with training ID:", id);
    const model = await prisma.model.findFirst({
      where: {
        trainingId: id,
      },
    });

    if (!model) {
      console.log("[REPLICATE_WEBHOOK] Model not found for training ID:", id);
      return new NextResponse("Model not found", { status: 404 });
    }
    console.log("[REPLICATE_WEBHOOK] Found model:", model.id);

    // Update model based on training status
    if (status === "completed") {
      console.log("[REPLICATE_WEBHOOK] Processing completed training");
      await prisma.model.update({
        where: { id: model.id },
        data: {
          status: "READY",
          modelId: output.model,
          trainingStatus: status,
          trainingEnded: new Date(),
        },
      });
      console.log("[REPLICATE_WEBHOOK] Model updated successfully");
    } else if (status === "failed") {
      console.log("[REPLICATE_WEBHOOK] Processing failed training");
      await prisma.model.update({
        where: { id: model.id },
        data: {
          status: "FAILED",
          trainingStatus: status,
          trainingErrorMessage: error || "Training failed",
          trainingEnded: new Date(),
        },
      });
      console.log("[REPLICATE_WEBHOOK] Model updated with failure status");
    } else if (status === "canceled") {
      console.log("[REPLICATE_WEBHOOK] Processing cancelled training");
      await prisma.model.update({
        where: { id: model.id },
        data: {
          status: "CANCELLED",
          trainingStatus: status,
          trainingErrorMessage: "Training was cancelled",
          trainingEnded: new Date(),
        },
      });
      console.log("[REPLICATE_WEBHOOK] Model updated with cancelled status");
    }

    console.log("[REPLICATE_WEBHOOK] Webhook processed successfully");
    return new NextResponse("OK");
  } catch (error) {
    console.error("[REPLICATE_WEBHOOK] Error processing webhook:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
