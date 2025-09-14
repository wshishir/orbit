import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: { 
    enabled: true, 
    autoSignIn: true,  // Auto sign in after registration
    requireEmailVerification: false  
  }, 

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds
    updateAge: 60 * 60 * 24,      // Update session if older than 1 day
  },
});

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user