// app/api/auth/options.ts

import GoogleProvider from 'next-auth/providers/google';
import LinkedInProvider from 'next-auth/providers/linkedin';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions, Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import { setJwtToken } from '@/app/store/slices'; // Import the action from your auth slice
import { store } from '@/app/store/store'; // Import your Redux store

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
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your-email@example.com' },
        password: { label: 'Password', type: 'password', placeholder: 'your-password' },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: credentials?.email || '',
            password: credentials?.password || '',
          }),
        });

        const data = await res.json();

        if (res.ok && data.access_token) {
          return {
            id: data.user?.id || credentials?.email || 'default-id',
            name: data.user?.name || credentials?.email,
            email: credentials?.email,
            accessToken: data.access_token,
          };
        } else {
          throw new Error(data.error || 'Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Handle OAuth providers
      if (account) {
        let oauthToken = account.id_token || account.access_token;

        if (oauthToken) {
          console.log(`Received OAuth token from ${account.provider}:`, oauthToken);

          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/get-jwt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oauth_token: oauthToken, provider: account.provider }),
          });

          const data = await response.json();
          if (response.ok && data.jwt_token) {
            token.jwt = data.jwt_token;
            console.log('Received JWT from backend:', data.jwt_token);

            // Dispatch the JWT to Redux store
            store.dispatch(setJwtToken(data.jwt_token));
          } else {
            console.error('Failed to get JWT from backend:', data.error || 'Unknown error');
          }
        } else {
          console.error(`No valid OAuth token received from ${account.provider}`);
        }
        token.id = profile?.id ?? token.sub ?? user?.id;
      }

      // Handle CredentialsProvider
      if (user && account?.provider === 'credentials') {
        token.jwt = user.accessToken;
        token.id = user.id;

        // Dispatch the JWT to Redux store
        store.dispatch(setJwtToken(user.accessToken!));
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = {
        ...session.user,
        id: token.id ?? 'default-id',
        name: token.name ?? session.user.name ?? 'Anonymous',
      };
      session.accessToken = token.jwt as string | undefined; // Type assertion here

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};