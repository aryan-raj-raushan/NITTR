import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { parse } from 'cookie';

import { db } from "~/server/db";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  let userData = {};
  const cookies = opts.headers.get('cookie');
  if (cookies) {
    const parsedCookies = parse(cookies);
    const authData = parsedCookies.authData;

    if (authData) {
      try {
        const parsedAuthData = JSON.parse(decodeURIComponent(authData));
        userData = {
          authState: JSON.parse(parsedAuthData.authState),
          id: JSON.parse(parsedAuthData.id),
          name: JSON.parse(parsedAuthData.name),
          role: JSON.parse(parsedAuthData.role),
          email: JSON.parse(parsedAuthData.email),
          number: JSON.parse(parsedAuthData.number),
        };
      } catch (error) {
        console.error('Error parsing auth data from cookie', error);
      }
    }
  }

  const session ={
    user:userData
  };

  return {
    db,
    session,
    ...opts,
  };
};


const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;


export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
 