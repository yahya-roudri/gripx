import { ErrorMessages } from "@contracts/constants";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";
import { env } from "./lib/env";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const createRouter = t.router;
export const publicQuery = t.procedure;

// Simple shared-secret gate for the admin order dashboard.
// The frontend sends the password in the x-admin-password header.
const requireAdminPassword = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  const provided = ctx.req.headers.get("x-admin-password");

  if (!env.adminPassword || provided !== env.adminPassword) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: ErrorMessages.unauthenticated,
    });
  }

  return next({ ctx });
});

export const adminQuery = t.procedure.use(requireAdminPassword);
