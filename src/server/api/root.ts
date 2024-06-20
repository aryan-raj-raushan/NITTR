import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/authRouter";
import { roomRouter } from "./routers/roomRouter";
import { guestsRouter } from "./routers/guestsRouter";
import { bookingRouter } from "./routers/bookingRouter";
import { mailRouter } from "./routers/mailRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  room: roomRouter,
  auth: authRouter,
  guests: guestsRouter,
  booking: bookingRouter,
  mail: mailRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
