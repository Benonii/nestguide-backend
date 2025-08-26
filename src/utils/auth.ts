import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { sendVerificationEmail } from "./email";

export const auth = betterAuth({
  appName: "Bita shop",
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log("calling function to verify email...");
      await sendVerificationEmail(user.name, user.email, url, token)
    }, 
    sendOnSignUp: true,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  trustedOrigins: [ "http://localhost:3000" ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      enabled: true,
    },
  },
});

