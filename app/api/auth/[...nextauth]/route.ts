import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { z } from 'zod';
import { JWTToken, User, Session } from '@/app/components/types';

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          const parsedCredentials = z.object({
            email: z.string().email(),
            password: z.string().min(6),
          }).safeParse(credentials);

          if (!parsedCredentials.success) {
            throw new Error('Invalid credentials');
          }

          const { email, password } = parsedCredentials.data;
          const res = await axios.post<User>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, { email, password });

          const user = res.data;
          if (user.access_token) {
            return user;
          }
          return null;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWTToken, user?: User }) {
      if (user) {
        token.accessToken = user.access_token;
      }
      return token;
    },
    async session({ session, token }: { session: Session, token: JWTToken }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};

export default NextAuth(authConfig);
