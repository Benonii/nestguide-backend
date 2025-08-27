import { z } from "zod";

export const createLeadSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1),
    minPrice: z.coerce.number().min(0),
    maxPrice: z.coerce.number().optional().default(0),
    readyToBuyDate: z.coerce.date().optional(),
});

export const getLeadsSchema = z.object({
    q: z.string().optional(),
    _start: z.coerce.number().optional().default(0),
    _end: z.coerce.number().optional().default(10),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
    _sort: z.enum(["asc", "desc"]).default("desc"),
    _order: z.enum(["created_on", "updated_on", "ready_to_buy_date"]).default("created_on"),
    readyToBuyDate: z.coerce.date().optional().nullable(),
});

export const deleteLeadSchema = z.object({
    id: z.string().min(1),
});

export type CreateLeadSchema = z.infer<typeof createLeadSchema>;
export type GetLeadsSchema = z.infer<typeof getLeadsSchema>;