// types/next-auth.d.ts


import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";
import { Profile as DefaultProfile } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      idToken?: string;
      address?: string;
      name?: string;
    } & DefaultSession["user"];
    accessToken?: string;
  }

  interface User extends DefaultUser {
    id?: string;
    idToken?: string;
    address?: string;
    name?: string;
    accessToken?: string;
  }

  interface Profile extends DefaultProfile {
    id?: string; // Ensure this is included in Profile
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    idToken?: string;
    address?: string;
    name?: string;
    accessToken?: string;
  }
}