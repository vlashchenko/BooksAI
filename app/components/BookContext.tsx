// src/app/components/BookContext.ts
'use client';

import { createContext, useState, ReactNode } from 'react';
import { BookContextType, GoogleBookVolume } from './types';

export const BookContext = createContext<BookContextType>({
  books: [],
  setBooks: () => {},
});

export default function BooksContextProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<GoogleBookVolume[]>([]);

  return (
    <BookContext.Provider value={{ books, setBooks }}>
      {children}
    </BookContext.Provider>
  );
}
