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
 * Checks if a user has reached their collection limit
 */
export async function checkUserCollectionLimit(
  userId: string,
  limit: number = 5
) {
  const activeCollections = await prisma.gallery.count({
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

  if (activeCollections >= limit) {
    throw new Error("Collection limit reached");
  }

  return activeCollections;
}

/**
 * Checks if a user owns a specific collection
 */
export async function validateCollectionOwnership(
  userId: string,
  collectionId: string
) {
  const collection = await prisma.gallery.findFirst({
    where: {
      id: collectionId,
      userId,
    },
  });

  if (!collection) {
    throw new Error("Collection not found or unauthorized");
  }

  return collection;
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
 * Checks if collection has expired
 */
export async function isCollectionExpired(collectionId: string) {
  const collection = await prisma.gallery.findUnique({
    where: { id: collectionId },
  });

  if (!collection) {
    throw new Error("Collection not found");
  }

  return collection.expiresAt < new Date();
}
