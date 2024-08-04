// app/api/auth/options.ts

import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import LinkedInProvider from 'next-auth/providers/linkedin';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your-email@example.com" },
        password: { label: "Password", type: "password", placeholder: "your-password" },
      },
      async authorize(credentials) {
        const res = await fetch("http://your-flask-api-url/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: credentials?.email || '',
            password: credentials?.password || '',
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
      // Persist the user data in the token right after signin
      if (user) {
        token.idToken = user.idToken || '';
        token.address = user.address || ''; // Provide a default value if address is undefined
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.user.idToken = token.idToken;
      session.user.address = token.address || ''; // Provide a default value if address is undefined
      return session;
    },
  },
};