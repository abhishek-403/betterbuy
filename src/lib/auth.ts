import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaClient } from "@prisma/client";
import prisma from "./prisma";


export const NEXT_AUTH_CONFIG = {
  providers: [
  
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    signIn: async (data: any) => {
      
      const user = await prisma.user.findFirst({
        where: {
          email: data.user.email,
        },
      });
      
      if (user) return true;
      const newUser = await prisma.user.create({
        data: {
          name: data.user.name,
          email: data.user.email,
          image: data.user.image,
        },
      });
      if (newUser) return true;
      return false;
    },
    jwt: async ({ user, token }: any) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
    session: ({ session, token, user }: any) => {
      if (session.user) {
        session.user.id = token.uid;
      }
      return session;
    },
  },

  pages: {
    signIn: "/sigin",
  },
};
