"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/store/store";
import { fetchBooks } from "@/app/store/bookThunk.client";
import OpenAIIcon from "@/public/assets/svg/OpenAIIconSVG";
import BookDropdown from "@/app/application/books/booksList/BooksDropDown";

function StartPage() {
  const [query, setQuery] = useState("");
  const books = useSelector((state: RootState) => state.books.items);
  const isLoading = useSelector((state: RootState) => state.books.loading);
  const serverError = useSelector((state: RootState) => state.books.error);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("Query changed:", query);

    if (query.length >= 3) {
      console.log("Fetching books for query:", query);
      dispatch(fetchBooks(query));
    }
  }, [query, dispatch]);

  return (
    <div className="w-[800px] max-w-full text-center flex flex-col justify-center items-center mx-8 bg-black">
      <div className="w-full max-w-md">
        <OpenAIIcon />
        <h1 className="text-white my-6">SUMMARIZE BOOKS WITH AI</h1>
        <BookDropdown
          books={books}
          onInputChange={setQuery}
          isLoading={isLoading}
        />
        {serverError && <p className="text-red-500 mt-4">{serverError}</p>}
      </div>
    </div>
  );
}

export default StartPage;
