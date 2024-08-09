// src/app/components/BookContext.ts
"use client";

import { createContext, useState, ReactNode, useEffect } from "react";
import { GoogleBookVolume } from "../components/types";

export type BookContextType = {
  books: GoogleBookVolume[];
  setBooks: (books: GoogleBookVolume[]) => void;
};

export const BookContext = createContext<BookContextType>({
  books: [],
  setBooks: () => {},
});

export default function BooksContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [books, setBooks] = useState<GoogleBookVolume[]>([]);

  useEffect(() => {
    console.log("BooksContextProvider initialized with books:", books);
  }, [books]);

  return (
    <BookContext.Provider value={{ books, setBooks }}>
      {children}
    </BookContext.Provider>
  );
}