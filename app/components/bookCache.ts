// /components/bookCache.ts

import { GoogleBookVolume } from './types';

const customCachedBooks: Record<string, GoogleBookVolume> = {};

export const getBookById = (id: string): GoogleBookVolume | null => {
  const book = customCachedBooks[id];
  console.log("Current Cache State:", customCachedBooks); // Log the entire cache
  if (book) {
    console.log(`Found book in custom cache with ID: ${id}`);
    return book;
  } else {
    console.log(`No book found in custom cache with ID: ${id}`);
    return null;
  }
};

export const cacheBookById = (id: string, book: GoogleBookVolume): void => {
  customCachedBooks[id] = book;
  console.log(`Book cached with ID: ${id}`); // Log when a book is cached
  console.log("Updated Cache State:", customCachedBooks); // Log the updated cache
};
