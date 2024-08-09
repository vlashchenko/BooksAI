<<<<<<< HEAD
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { type DefaultSession } from "next-auth";

// Extend the Session interface to include the address property
=======
// auth.ts

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

// Extend the DefaultSession interface to include custom properties
>>>>>>> 120d04e39a931915842653f46b86dcdd8dd21657
declare module "next-auth" {
  interface Session {
    user: {
      address: string;
<<<<<<< HEAD
    } & DefaultSession["user"];
  }

  interface User {}
  interface Account {}
}

import { JWT } from "next-auth/jwt";

// Extend the JWT interface to include the idToken property
=======
    };
  }
}

// Extend the JWT interface to include custom properties
>>>>>>> 120d04e39a931915842653f46b86dcdd8dd21657
declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string;
  }
}

<<<<<<< HEAD
export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Providers.LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
    Providers.Credentials({
=======
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
>>>>>>> 120d04e39a931915842653f46b86dcdd8dd21657
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
<<<<<<< HEAD
      async authorize(credentials) {
        // Call your Flask API for authentication
=======
      async authorize(credentials, req) {
>>>>>>> 120d04e39a931915842653f46b86dcdd8dd21657
        const res = await fetch("http://your-flask-api-url/auth/login", {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: credentials.email,
            password: credentials.password,
          }),
        });
<<<<<<< HEAD

        const user = await res.json();

        if (res.ok && user) {
          return user;
        } else {
          throw new Error(user.error);
=======
        const user = await res.json();
        if (res.ok && user) {
          return user;
        } else {
          throw new Error(user.error || "Authentication failed");
>>>>>>> 120d04e39a931915842653f46b86dcdd8dd21657
        }
      },
    }),
  ],
  callbacks: {
<<<<<<< HEAD
    async session({ session, token, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          address: user.address,
        },
      };
    },
  },
});
=======
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
>>>>>>> 120d04e39a931915842653f46b86dcdd8dd21657
