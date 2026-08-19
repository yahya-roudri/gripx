import { desc } from "drizzle-orm";
import { orders } from "@db/schema";
import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";

export const adminRouter = createRouter({
  orders: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(orders).orderBy(desc(orders.createdAt)).limit(500);
  }),
});
