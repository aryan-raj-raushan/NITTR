import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { UserPermissionRole } from "@prisma/client";
import { db } from "~/server/db";
// import bcrypt from 'bcryptjs'; // Add bcrypt for password hashing

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: UserPermissionRole;
      number?: string; // Add number to the user session
    } & DefaultSession["user"];
  }

  interface User {
    role: UserPermissionRole;
    number?: string; // Add number to the user object
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
    signOut: '/',
  },
  session: {
    strategy: 'jwt',
  },
  adapter: PrismaAdapter(db),
  secret: "e3cd8aace069fd2056eab19e930a8abb",

  providers: [
    GoogleProvider({
      clientId: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name,
          email: profile.email,
          role: UserPermissionRole.USER,
          number: profile.number as string | undefined,
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        return {
          id: user.id,
          name: user?.name,
          email: user?.email,
          role: user?.role,
          number: user?.number ?? undefined, // Ensure number is string | undefined
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ account, profile }) {
      return true;
    },
    session: ({ session, token }) => {
      session.user.role = token.role as UserPermissionRole;
      session.user.number = token.number as string; // Add number to the session user
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.number = user.number; // Add number to the token
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
