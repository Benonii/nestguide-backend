import { type CreateLeadSchema, type GetLeadsSchema } from "./validation";
import { db } from "@/db";
import { leadsTable } from "./leadsTable.sql";
import { createId } from "@/utils";
import { and, eq, gte, ilike, isNull, lte, or, asc, desc } from "drizzle-orm";

export const createLead = async (lead: CreateLeadSchema) => {
    const newLead = await db.insert(leadsTable).values({
        id: createId(),
        ...lead,
    }).returning();

    return newLead[0];
};

export const getLeads = async (query: GetLeadsSchema) => {
    const { q, _start, _end, minPrice, maxPrice, state, city, zipCode, _sort, _order } = query;

    const leads = await db.select().from(leadsTable)
        .where(
            and(
                isNull(leadsTable.deletedAt),
                q ? or(
                    ilike(leadsTable.firstName, `%${q}%`),
                    ilike(leadsTable.lastName, `%${q}%`),
                    ilike(leadsTable.email, `%${q}%`),
                ) : undefined,
                minPrice ? gte(leadsTable.minPrice, minPrice) : undefined,
                maxPrice ? lte(leadsTable.maxPrice, maxPrice) : undefined,
                state ? eq(leadsTable.state, state) : undefined,
                city ? eq(leadsTable.city, city) : undefined,
                zipCode ? eq(leadsTable.zipCode, zipCode) : undefined,
            )
        )
        .limit(_end - _start)
        .offset(_start)
        .orderBy(
            _order === "created_on" && _sort === "asc" ? asc(leadsTable.createdAt) :
            _order === "created_on" && _sort === "desc" ? desc(leadsTable.createdAt) :
            _order === "updated_on" && _sort === "asc" ? asc(leadsTable.updatedAt) :
            _order === "updated_on" && _sort === "desc" ? desc(leadsTable.updatedAt) :
            _order === "ready_to_buy_date" && _sort === "asc" ? asc(leadsTable.readyToBuyDate) :
            _order === "ready_to_buy_date" && _sort === "desc" ? desc(leadsTable.readyToBuyDate) :
            asc(leadsTable.createdAt),
        )
    ;

    return {
        list: leads,
        total: leads.length,
    };
};

export const getLead = async (id: string) => {
    const lead = await db.select().from(leadsTable).where(eq(leadsTable.id, id)).limit(1);

    return lead[0];
};

export const deleteLead = async (id: string) => {
    await db.update(leadsTable).set({
        deletedAt: new Date(),
    }).where(eq(leadsTable.id, id));
};