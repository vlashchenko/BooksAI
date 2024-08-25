// app/components/types.ts


export type GoogleBookVolume = {
  title?: string;
  authors?: string[];
  publishedDate?: string;
  description?: string;
  context?: Record<string, string>;
  industryIdentifier?: {
    type: string;
    identifier: string;
  };
  pageCount?: number;
  thumbnail?: string;
  summary?: string;
  categories?: string[];
  id?: string;
};

export type GoogleBooksAPIItem = {
  volumeInfo: {
    title: string;
    authors: string[];
    publishedDate?: string;
    description?: string;
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
    categories?: string[];
    pageCount?: number;
    imageLinks?: {
      thumbnail: string;
    };
  };
};

export interface JWTToken {
  accessToken: string;
  [key: string]: unknown;
}

export interface User {
  access_token: string;
  email: string;
  username: string;
}

export interface Session {
  accessToken?: string;
  user?: {
    email: string;
    name: string;
  };
}