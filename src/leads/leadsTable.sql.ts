import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { cuid, timestamps, deletedAt } from "@/utils";

export const leadsTable = pgTable("leads", {
    id: cuid("id").primaryKey(),
    ...timestamps,
    ...deletedAt,
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    address: text("address").notNull(),
    city: text("city").notNull(),
    state: text("state").notNull(),
    zipCode: text("zip_code").notNull(),
    minPrice: integer("min_price").notNull(),
    maxPrice: integer("max_price").default(0),
    readyToBuyDate: timestamp("ready_to_buy_date"),
});