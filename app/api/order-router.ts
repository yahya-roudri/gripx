import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orders } from "@db/schema";

export const orderRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        productTitle: z.string().min(1).max(128),
        quantity: z.number().int().min(1).max(20),
        totalMAD: z.number().int().min(1),
        fullName: z.string().min(1).max(255),
        phone: z.string().min(8).max(32),
        city: z.string().min(1).max(128),
        address: z.string().min(1).max(512),
        note: z.string().max(2000).optional(),
        userId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(orders).values({
        userId: input.userId ?? null,
        productTitle: input.productTitle,
        quantity: input.quantity,
        totalMAD: input.totalMAD,
        fullName: input.fullName,
        phone: input.phone,
        city: input.city,
        address: input.address,
        note: input.note ?? null,
      });
      return { id: Number(result[0].insertId), success: true };
    }),
});
