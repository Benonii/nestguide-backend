import { timestamp, varchar } from "drizzle-orm/pg-core";


export { createId } from "@paralleldrive/cuid2";
export const cuid = (name: string) => varchar(name, { length: 32 });

export const timestamps = {
  createdAt: timestamp("created_on", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_on", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow().$onUpdate(() => new Date()),
};


export const deleteAt = {deleteAt:timestamp("deleted_at", { withTimezone: true, mode: "date" })};
