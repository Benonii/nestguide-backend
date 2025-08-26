import { type CreateProfileSchema  } from "./validation";
import { profileTable } from "@/db/schema"
import { db } from "@/db";
import { eq, isNull, and } from "drizzle-orm";

export const createProfile = async (profile: CreateProfileSchema) => {
  const response = await db.insert(profileTable).values({
    ...profile,
  }).returning();
  return response;
};

export const getProfile = async (userID: string) => {
    const response = await db.query.profileTable.findFirst({
        where: and(
            eq(profileTable.userID, userID),
            isNull(profileTable.deletedAt)
        )
    });
    return response;
}

export const updateProfile = async (userID: string, profile: CreateProfileSchema) => {
    const response = await db.update(profileTable).set({
        ...profile,
    }).where(and(eq(profileTable.userID, userID), isNull(profileTable.deletedAt)));
    return response;
}

export const deleteProfile = async (userID: string) => {
    const response = await db.update(profileTable).set({
        deletedAt: new Date(),
    }).where(and(eq(profileTable.userID, userID), isNull(profileTable.deletedAt)));
    return response;
}