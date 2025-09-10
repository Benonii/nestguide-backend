import { z } from "zod";

// US state abbreviations
const US_STATE_ABBREVIATIONS = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
] as const;

export const getSchoolStatsSchema = z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.enum(US_STATE_ABBREVIATIONS).optional(),
    zipCode: z.string().max(5),
});

export type GetSchoolStatsSchema = z.infer<typeof getSchoolStatsSchema>;

export interface SchoolDistrictResult {
  data: {
    name: string
    id: string
    found: boolean
  }
}