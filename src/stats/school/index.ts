import { Hono } from "hono";
import { fromZodError } from "zod-validation-error";
import { getSchoolStatsSchema, type SchoolDistrictResult } from "./validation";
import { getDistrict, getSchoolStats } from "./functions";
import { geocodeAddress, getCentroidFromZipCode } from "@/utils";
import type { Coordinates } from "@/geocoding/validation";

const schoolRouter = new Hono();

schoolRouter.post('/', async (c) => {
    const result = getSchoolStatsSchema.safeParse(await c.req.json());
    if (!result.success) {
        return c.json({ error: fromZodError(result.error).message }, 400);
    }

    const { street, city, state, zipCode } = result.data;
    
    let coordinates: Coordinates | null = null;
    if (street && city && state) {
        coordinates = await geocodeAddress({ street, city, state, zipCode });
        if (!coordinates) {
            return c.json({ message: "Invalid address" }, 400);
        }
    } else {
        coordinates = await getCentroidFromZipCode(zipCode);
        if (!coordinates) {
            return c.json({ message: "Invalid zip code" }, 400);
        }
    }

    const districtInfo: SchoolDistrictResult = await getDistrict(coordinates);
    
    if (!districtInfo.data.found) {
        return c.json({ message: "District not found" }, 404);
    }

    const schoolStats = await getSchoolStats(districtInfo.data.id);
});

export default schoolRouter;