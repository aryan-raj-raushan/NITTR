// import { z } from "zod";
// import { sendMail } from "~/lib/mail";

// import {
//   createTRPCRouter,
//   protectedProcedure,
//   publicProcedure,
// } from "~/server/api/trpc";

// export const mailRouter = createTRPCRouter({
//   sendMail: protectedProcedure
//     .input(z.object({ subject: z.string(), text: z.string(), templatePath: z.any().optional() }))
//     .mutation(async ({ ctx, input }) => {
//       const { subject, text, templatePath } = input
//       return await sendMail({ subject, text, templatePath });
//     }),

// });


import { z } from "zod";
import { sendMail } from "~/lib/mail";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const mailRouter = createTRPCRouter({
  sendMail: protectedProcedure
    .input(z.object({ to: z.string(), subject: z.string(), text: z.string(), templatePath: z.any().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { to, subject, text} = input;
      return await sendMail({ to, subject, text });
    }),
});
