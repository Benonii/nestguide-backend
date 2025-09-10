import { Hono } from "hono";
import { fromZodError } from "zod-validation-error";
import schoolRouter from "./school";

const statsRouter = new Hono();

statsRouter.route('/school', schoolRouter);

export default statsRouter;