import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { type DefaultSession } from "next-auth";

// Extend the Session interface to include the address property
declare module "next-auth" {
  interface Session {
    user: {
      address: string;
    } & DefaultSession["user"];
  }

  interface User {}
  interface Account {}
}

import { JWT } from "next-auth/jwt";

// Extend the JWT interface to include the idToken property
declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string;
  }
}

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
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Call your Flask API for authentication
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
          throw new Error(user.error);
        }
      },
    }),
  ],
  callbacks: {
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
