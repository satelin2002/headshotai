import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    console.log("[REPLICATE_WEBHOOK] Received webhook request");
    const payload = await req.json();
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
      const replicateData = model.replicateData as Prisma.JsonObject;
      console.log("[REPLICATE_WEBHOOK] Updating model with completed status");
      await prisma.model.update({
        where: { id: model.id },
        data: {
          status: "READY",
          modelId: output.model,
          trainingStatus: status,
          trainingEnded: new Date(),
          replicateData: {
            ...replicateData,
            output,
            status,
            completed_at: new Date(),
          },
        },
      });
      console.log("[REPLICATE_WEBHOOK] Model updated successfully");
    } else if (status === "failed") {
      console.log("[REPLICATE_WEBHOOK] Processing failed training");
      const replicateData = model.replicateData as Prisma.JsonObject;
      console.log("[REPLICATE_WEBHOOK] Updating model with failed status");
      await prisma.model.update({
        where: { id: model.id },
        data: {
          status: "FAILED",
          trainingStatus: status,
          trainingErrorMessage: error || "Training failed",
          trainingEnded: new Date(),
          replicateData: {
            ...replicateData,
            error,
            status,
            completed_at: new Date(),
          },
        },
      });
      console.log("[REPLICATE_WEBHOOK] Model updated with failure status");
    }

    console.log("[REPLICATE_WEBHOOK] Webhook processed successfully");
    return new NextResponse("OK");
  } catch (error) {
    console.error("[REPLICATE_WEBHOOK] Error processing webhook:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
