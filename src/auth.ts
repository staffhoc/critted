import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { sendMagicLinkEmail, sendWelcomeEmail, sendSignInNotificationEmail } from "@/lib/email";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: "Critted <notifications@critted.com>",
      async sendVerificationRequest({ identifier: email, url }) {
        await sendMagicLinkEmail(email, url);
      },
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-email",
    error: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // After sign in, redirect to dashboard or onboarding
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return `${baseUrl}/dashboard`;
    },
  },
  events: {
    async createUser({ user }) {
      // Check for pending signup data and update user with name
      if (user.email) {
        const pendingSignup = await prisma.pendingSignup.findUnique({
          where: { email: user.email.toLowerCase() },
        });

        if (pendingSignup) {
          // Update user with name from pending signup
          await prisma.user.update({
            where: { id: user.id },
            data: { name: pendingSignup.name },
          });

          // Delete the pending signup record
          await prisma.pendingSignup.delete({
            where: { email: user.email.toLowerCase() },
          });

          // Send welcome email with the name
          await sendWelcomeEmail(user.email, pendingSignup.name);
        } else {
          // Fallback for Google sign-in or other providers
          await sendWelcomeEmail(user.email, user.name ?? null);
        }
      }
    },
    async signIn({ user, isNewUser }) {
      // Send sign-in notification for existing users (not new signups)
      if (!isNewUser && user.email) {
        await sendSignInNotificationEmail(user.email, user.name ?? null);
      }
    },
  },
});
