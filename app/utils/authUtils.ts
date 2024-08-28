// authUtils.ts

'use client'

import { getSession } from 'next-auth/react';

export const getJwtToken = async (): Promise<string | null> => {
  const session = await getSession();
  return session?.accessToken as string || null;
};