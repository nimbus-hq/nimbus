import { showRoutes } from "hono/dev";
import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";

const app = new Hono().basePath("/api");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const router = app.get("/", (c) => c.text("Hello Cloudflare Workers!"));

showRoutes(app);

export const onRequest = handle(app);

export type AppType = typeof router;
