import { pgTable, text } from "drizzle-orm/pg-core";
import { cuid, timestamps, deleteAt } from "@/utils";
import { user } from "@/db/schema";

export const profileTable = pgTable("profiles", {
    userID: text("user_id").primaryKey().references(() => user.id, { onDelete: "cascade" }),
    ...timestamps,
    ...deleteAt,
    phone: text("phone"),
    address: text("address"),
    city: text("city"),
    state: text("state"),
    zipCode: text("zip_code"),
    userType: text("user_type", { enum: ["buyer", "agent", "admin"] }).notNull().default("buyer"),
});