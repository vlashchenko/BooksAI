"use client";

import { createContext, useState, ReactNode } from "react";
import { GoogleBookVolume } from "../components/types";

// Define the type for your context, including functions and state
export type BookDetailsContextType = {
    bookDetails: GoogleBookVolume[];
    setBookDetails: (books: GoogleBookVolume[]) => void;
    // add other states and functions as needed
  };

export const BookDetailsContext = createContext<BookDetailsContextType>({
    bookDetails: [],
    setBookDetails: () => {},
  });
  
  export default function BookDetailsContextProvider({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const [bookDetails, setBookDetails] = useState<GoogleBookVolume[]>([]);
    console.log("bookDetails is updated", bookDetails);
  
    return (
      <BookDetailsContext.Provider value={{ bookDetails, setBookDetails }}>
        {children}
      </BookDetailsContext.Provider>
    );
  }