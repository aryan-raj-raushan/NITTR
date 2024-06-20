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
import bcrypt from 'bcryptjs'; // Add bcrypt for password hashing

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string,
      role?: UserPermissionRole;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserPermissionRole;
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(db),
  secret: "e3cd8aace069fd2056eab19e930a8abb",

  providers: [
    GoogleProvider({
      clientId: "502784863652-4khsfe3ojq5uhe0vgguhvdkme66tuqv6.apps.googleusercontent.com",
      clientSecret: "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",
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name,
          email: profile.email,
          role: UserPermissionRole.USER,
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
          name: user.name,
          email: user.email,
          role: user.role,
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
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
