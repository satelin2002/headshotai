import { prisma } from "@/lib/prisma";

export async function validateUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    console.error("User not found:", userId);
    throw new Error("User not found");
  }

  return user;
}

/**
 * Checks if a user has reached their model limit
 */
export async function checkUserModelLimit(userId: string, limit: number = 5) {
  const activeModels = await prisma.model.count({
    where: {
      userId,
      status: {
        not: "EXPIRED",
      },
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (activeModels >= limit) {
    throw new Error("Model limit reached");
  }

  return activeModels;
}

/**
 * Checks if a user owns a specific model
 */
export async function validateModelOwnership(userId: string, modelId: string) {
  const model = await prisma.model.findFirst({
    where: {
      id: modelId,
      userId,
    },
  });

  if (!model) {
    throw new Error("Model not found or unauthorized");
  }

  return model;
}

/**
 * Gets user subscription status and limits
 */
export async function getUserLimits(userId: string) {
  const user = await validateUser(userId);

  // Default limits
  const limits = {
    maxCollections: 5,
    maxPhotosPerCollection: 50,
    maxStorageGB: 2,
    isSubscribed: false,
  };

  // Could expand this to check subscription status
  // and adjust limits accordingly

  return limits;
}

/**
 * Checks if model has expired
 */
export async function isModelExpired(modelId: string) {
  const model = await prisma.model.findUnique({
    where: { id: modelId },
  });

  if (!model) {
    throw new Error("Model not found");
  }

  return model.expiresAt < new Date();
}
