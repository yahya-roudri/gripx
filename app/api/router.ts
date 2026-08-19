import { adminRouter } from "./admin-router";
import { orderRouter } from "./order-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  order: orderRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
