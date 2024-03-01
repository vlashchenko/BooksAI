// src/app/components/BookContext.ts
"use client";

import { createContext, useState, ReactNode } from "react";
import { GoogleBookVolume } from "../components/types";

// Define the type for your context, including functions and state
export type BookContextType = {
  books: GoogleBookVolume[];
  setBooks: (books: GoogleBookVolume[]) => void;
  // add other states and functions as needed
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
  console.log("books is updated", books);

  return (
    <BookContext.Provider value={{ books, setBooks }}>
      {children}
    </BookContext.Provider>
  );
}

