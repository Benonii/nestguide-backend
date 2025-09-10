import { logger } from "hono/logger";
import index from "@/routes/index.routes"

import { cors } from "hono/cors";

import { Hono } from "hono";
import { env } from "@/utils/env";
import { auth } from "./utils/auth";
import profileRouter from "./profile";
import { leadsRouter } from "./leads";
import statsRouter from "./stats";


const app = new Hono();

app.use("*", cors({
  origin: env.CORS_WHITELIST.split(","),
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["POST", "GET", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
  credentials: true,
}));

app.use("*", logger());

const routes = [
  index,
] as const;

routes.forEach((route) => {
  app.route("/api", route);
});

app.on(["POST", "GET"], "/api/auth/**", (c) =>  auth.handler(c.req.raw));

app.route("/api/profile", profileRouter);
app.route("/api/lead", leadsRouter);
app.route("/api/stats", statsRouter);

export default app;
