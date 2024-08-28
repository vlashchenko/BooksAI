"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { GoogleBookVolume } from "@/app/components/types";
import BookBarMenu from "./BookBarMenu";
import { Suspense } from "react";
import SummaryBook from "./SummaryBook";
import { useSearchParams } from "next/navigation";
import ContextBook from "./ContextBook";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/store/store";
import { selectBook, setBookDetails } from "@/app/store/slices";
import { fetchBooks } from "@/app/store/bookThunk.server";
import AskAiButton from "./AskAiButton";

const BookSummaryPage = () => {
  const searchParams = useSearchParams();
  const bookId = searchParams?.get("bookId") || null;
  const [query, setQuery] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  const books = useSelector((state: RootState) => state.books.items);
  const bookDetails = useSelector(
    (state: RootState) => state.books.selectedBook
  );
  const dispatch = useDispatch<AppDispatch>();

  console.log("Check books context in summary page:", books);

  useEffect(() => {
    console.log("BookSummaryPage mounted with bookId:", bookId);
    if (bookId) {
      const bookFromContext = books.find(
        (book) => book.industryIdentifier?.identifier === bookId
      );
      if (bookFromContext) {
        dispatch(selectBook(bookFromContext));
      }
    }
  }, [bookId, books, dispatch]);

  useEffect(() => {
    if (query) {
      dispatch(fetchBooks(query));
    }
  }, [query, dispatch]);

  return (
    <div className="max-w-[800px] min-w-[420px] bg-white container mx-auto p-4">
      <BookBarMenu
        bookDetails={bookDetails}
        setBookDetails={(details: GoogleBookVolume | null) =>
          dispatch(setBookDetails(details))
        }
        onQueryChange={setQuery}
      />

      {bookDetails && (
        <div className="flex flex-col">
          <div className="text-black flex items-center space-x-6 my-2">
            <div className="flex">
              <Image
                src={
                  bookDetails.thumbnail ||
                  "/assets/images/book_cover_placeholder.jpeg"
                }
                alt={bookDetails.title || "unknown author"}
                width={160}
                height={240}
                className="shrink min-w-[60px] w-36 h-auto min-h-auto"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <h1 className="md:text-2xl sm:text-xl text-lg">
                {bookDetails.title}
              </h1>
              <h2 className="md:text-1xl sm:text-lg text-base text-gray-600">
                by{" "}
                {Array.isArray(bookDetails.authors)
                  ? bookDetails.authors.join(", ")
                  : "Unknown Author"}
              </h2>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <Suspense fallback={<p>Loading feed...</p>}>
          <SummaryBook
            bookId={bookId}
            setLoading={setLoadingSummary}
            onLoading={loadingSummary}
          />
        </Suspense>
      </div>

      <AskAiButton />

      <ContextBook />
    </div>
  );
};

export default BookSummaryPage;
