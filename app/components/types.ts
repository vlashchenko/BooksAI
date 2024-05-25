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
        pageCount?: number;
        imageLinks?: {
            thumbnail: string;
        };
    };
};
  

