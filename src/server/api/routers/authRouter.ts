import { UserPermissionRole } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";


const AuthCredentialsValidator = z
  .object({
    name: z.string().min(2, {
      message: 'Name must be at least 2 characters long.',
    }),
    email: z.string().email(),
    number: z.string(),
    password: z.string().min(6, {
      message: 'Password must be at least 6 characters long.',
    }),
    confirmPassword: z.string().min(6, {
      message: 'Password must be at least 6 characters long.',
    }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      return ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'The passwords did not match',
      });
    }
  });

type TAuthCredentialsValidator = z.infer<
  typeof AuthCredentialsValidator
>;

export const authRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),


  createUser: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({ input, ctx }) => {
      const { name, email, password, number } = input;

      const user = await ctx.db.user.findFirst({
        where: {
          email: {
            equals: email,
          },
        },
      });

      if (user) throw new TRPCError({ code: 'CONFLICT' });
      try {
        const createdUser = await ctx.db.user.create({
          data: {
            name,
            email,
            number,
            role: UserPermissionRole.USER,
            password,
          },
        });
      } catch (err) {
        console.log(err);
        throw new TRPCError({ code: 'CONFLICT' });
      }
      return { success: true, email: email, password: password };
    }),

});
