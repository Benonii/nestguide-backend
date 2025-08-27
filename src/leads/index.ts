import { Hono } from "hono";
import { createLead, deleteLead, getLead, getLeads } from "./functions";
import { createLeadSchema, deleteLeadSchema, getLeadsSchema } from "./validation";
import { fromZodError } from "zod-validation-error";

export const leadsRouter = new Hono();

leadsRouter.post("/", async (c) => {
    const result = createLeadSchema.safeParse(await c.req.json());

    if (!result.success) {
        return c.json({ error: fromZodError(result.error).message }, 400);
    }

    const lead = await createLead(result.data);
    return c.json({
        data: lead,
        message: "Lead created successfully!",
    });
});

leadsRouter.get("/", async (c) => {
    const result = getLeadsSchema.safeParse(c.req.query());

    if (!result.success) {
        return c.json({ error: fromZodError(result.error).message }, 400);
    }

    const { _start, _end } = result.data;
    const leads = await getLeads(result.data);
    return c.json({
        data: leads.list,
        page: _start / _end,
        pageSize: _end - _start,
        total: leads.total,
    });
});

leadsRouter.delete("/:id", async (c) => {
    const result = deleteLeadSchema.safeParse(c.req.param("id"));

    if (!result.success) {
        return c.json({ error: fromZodError(result.error).message }, 400);
    }

    const lead = await getLead(result.data.id);

    if (!lead) {
        return c.json({ error: "Lead not found" }, 404);
    }

    await deleteLead(result.data.id);
    return c.json({
        data: lead,
        message: "Lead deleted successfully!",
    });
});