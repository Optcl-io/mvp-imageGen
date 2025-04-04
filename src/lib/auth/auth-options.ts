import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { Subscription } from "@/lib/db/types";
import { stripe } from "@/lib/stripe/stripe-client";

// Extend the default session and JWT types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "USER" | "ADMIN";
      subscription: "FREE" | "PAID";
      lastRefreshed?: number;
    };
  }

  interface User {
    id: string;
    role: "USER" | "ADMIN";
    subscription: "FREE" | "PAID";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "USER" | "ADMIN";
    subscription: "FREE" | "PAID";
    lastRefreshed?: number;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            password: true,
            role: true,
            subscription: true,
            emailVerified: true,
          }
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error("Please verify your email before logging in");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          subscription: user.subscription,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.subscription = user.subscription;
        token.lastRefreshed = Date.now();
      }
      
      // Always refresh on updates or token refresh
      if (trigger === 'update' || trigger === 'signIn') {
        try {
          // Get the latest user data from the database
          const latestUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { subscription: true, role: true, stripeSubscriptionId: true },
          });
          
          if (latestUser) {
            // Always update token with the latest data
            token.subscription = latestUser.subscription;
            token.role = latestUser.role;
            
            // Double-check with Stripe if necessary
            if (latestUser.stripeSubscriptionId && latestUser.subscription === 'FREE') {
              try {
                const subscription = await stripe.subscriptions.retrieve(latestUser.stripeSubscriptionId);
                if (subscription.status === 'active' || subscription.status === 'trialing') {
                  // Immediate fix: update user in the database
                  await prisma.user.update({
                    where: { id: token.id as string },
                    data: { subscription: Subscription.PAID }
                  });
                  // Also update the token
                  token.subscription = Subscription.PAID;
                  console.log(`Fixed subscription discrepancy for user ${token.id}`);
                }
              } catch (stripeError) {
                console.error('Error checking Stripe subscription:', stripeError);
              }
            }
            
            // Record refresh timestamp
            token.lastRefreshed = Date.now();
          }
        } catch (error) {
          console.error('Error refreshing user data:', error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.subscription = token.subscription;
        session.user.lastRefreshed = token.lastRefreshed;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 