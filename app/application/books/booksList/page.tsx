// src/app/page.tsx

"use client";

import React, { useEffect, useState, useContext } from "react";
import { BookContext } from "@/app/wrappers/BooksListContext"; // Import the context
import { BookContextType } from "@/app/wrappers/BooksListContext";
import OpenAIIcon from "@/public/assets/svg/OpenAIIconSVG";
import BookDropdown from "@/app/application/books/booksList/BooksDropDown";

function StartPage() {
  const [query, setQuery] = useState("");
  const { books, setBooks } = useContext<BookContextType>(BookContext);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Query changed:", query);

    if (query.length >= 1) {
      console.log("Fetching books for query:", query);
      fetchBooks(query);
    }
  }, [query]);

  const fetchBooks = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/book?query=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Server responded with an error");
      }

      const data = await response.json();
      console.log("Fetched books data:", data);
      setBooks(data);
      setServerError(null);
    } catch (error) {
      console.error("Error fetching books:", error);
      setServerError("No server connection...");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[800px] max-w-full text-center flex flex-col justify-center items-center mx-8 bg-black">
      <OpenAIIcon />
      <h1 className="text-white my-6">SUMMARIZE BOOKS WITH AI</h1>
      <div className="w-full max-w-[600px]">
        <BookDropdown books={books} onInputChange={setQuery} isLoading={isLoading} />
      </div>
      {serverError && <p className="text-red-500 mt-4">{serverError}</p>}
    </div>
  );
}

export default StartPage;
