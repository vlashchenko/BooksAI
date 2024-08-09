<<<<<<< HEAD
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
export default NextAuth(authConfig).auth;
 
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
=======
// /Users/sv/Documents/Projects/AI/newai/middleware.js

import { withAuth } from "next-auth/middleware";
import { options } from "./app/api/auth/options"; // Correct relative path

export default withAuth(options);

export const config = {
>>>>>>> 120d04e39a931915842653f46b86dcdd8dd21657
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};