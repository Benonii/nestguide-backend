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


export const getProfileSchema = z.object({ 
    userID: z.string(),
});

export type GetProfileSchema = z.infer<typeof getProfileSchema>;

export const updateProfileSchema = z.object({
    phone: z.string().min(10).max(15).optional().nullable() ,
    address: z.string().min(10).max(100).optional().nullable(),
    city: z.string().min(3).max(50).optional().nullable(),
    state: z.string().min(2).max(50).optional().nullable(),
    zipCode: z.string().min(5).optional().nullable(),
    userType: z.enum(["buyer", "agent", "admin"]).default("buyer").optional().nullable(),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
