import { Hono } from "hono";
import { createProfile, getProfile, updateProfile, deleteProfile } from "./functions";
import { createProfileSchema, getProfileSchema } from "./validation";
import { fromZodError } from "zod-validation-error";

const profileRouter = new Hono();

profileRouter.post("/", async (c) => {
    const result = createProfileSchema.safeParse(await c.req.json())
    if (!result.success) {
        return c.json({ error: fromZodError(result.error).message }, 400);
    }

    const profile = await createProfile(result.data);
    return c.json({
        data: profile,
        message: "Profile created successfully!"
    }, 200);
});

profileRouter.get("/:userID", async (c) => {
    const result = getProfileSchema.safeParse(c.req.param());
    if (!result.success) {
        return c.json({ error: fromZodError(result.error).message }, 400);
    }

    const { userID } = result.data;
    const profile = await getProfile(userID);
    if (!profile) {
        return c.json({ error: "Profile not found!" }, 404);
    }

    return c.json({
        data: profile,
        message: "Profile fetched successfully!"
    }, 200);
});


export default profileRouter;