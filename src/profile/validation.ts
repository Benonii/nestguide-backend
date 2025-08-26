import { z } from "zod";

export const createProfileSchema = z.object({
    userID: z.string(),
    phone: z.string().min(10).max(15),
    address: z.string().min(10).max(100),
    city: z.string().min(3).max(50),
    state: z.string().min(2).max(50),
    zipCode: z.string().min(5).optional().nullable(),
    userType: z.enum(["buyer", "agent", "admin"]).default("buyer"),
});

export type CreateProfileSchema = z.infer<typeof createProfileSchema>;