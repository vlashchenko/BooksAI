// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      idToken?: string;
      address?: string;
      name?: string; // Ensure this is added
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    idToken?: string;
    address?: string;
    name?: string; // Ensure this is added
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    idToken?: string;
    address?: string;
    name?: string; // Ensure this is added
  }
}