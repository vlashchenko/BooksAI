// src/components/types.ts

export type GoogleBookVolume = {
    title?: string;
    authors?: string[];
    publishedDate?: string;
    description?: string;
    context?: Record<string, string>; // Updated to hold questions and answers
    industryIdentifier?: {
      type: string;
      identifier: string;
    };
    pageCount?: number;
    thumbnail?: string;
    summary?: string;
    categories?: string[]; // Categories from Google Books, possibly matching your classification needs
    id?: string; // The unique identifier provided by Google Books
  }  
  

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
        categories?: string[]
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