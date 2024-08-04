// auth.ts

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

// Extend the DefaultSession interface to include custom properties
declare module "next-auth" {
  interface Session {
    user: {
      address: string;
    };
  }
}

// Extend the JWT interface to include custom properties
declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string;
  }
}

// Setup NextAuth with providers and callbacks
export const { auth, handlers } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const res = await fetch("http://your-flask-api-url/auth/login", {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: credentials.email,
            password: credentials.password,
          }),
        });
        const user = await res.json();
        if (res.ok && user) {
          return user;
        } else {
          throw new Error(user.error || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.idToken = user.idToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.idToken = token.idToken;
        session.user.address = token.address;  // Assuming address is saved in token
      }
      return session;
    }
  }
});

// Optionally export other utilities from this module
export default auth;
