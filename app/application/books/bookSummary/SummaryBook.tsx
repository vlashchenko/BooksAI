"use client";

import React, { useEffect } from "react";
import { GoogleBookVolume } from "@/app/components/types";
import { SkeletonBookSummary } from "@/app/components/Skeleton";
import AskAiButton from "./AskAiButton";
import withAuth from "@/app/components/withAuth";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { setBookDetails } from "@/app/store/slices";

export type SummaryBookProps = {
  bookId: string | null;
  setLoading: (loading: boolean) => void;
  onLoading: boolean;
};

const SummaryBook = ({ bookId, setLoading, onLoading }: SummaryBookProps) => {
  const books = useSelector((state: RootState) => state.books.items);
  const bookDetails = useSelector((state: RootState) => state.books.selectedBook);
  const dispatch = useDispatch();

  console.log("SummaryBook received bookId prop:", bookId);
  console.log("SummaryBook received books from Redux:", books);
  console.log("Current bookDetails from Redux:", bookDetails);

  useEffect(() => {
    async function fetchBookDetails() {
      if (bookId) {
        console.log("Fetching details for bookId:", bookId);
        setLoading(true);
        console.log("Current books in Redux:", books);
        const bookFromContext = books.find((book) => book.industryIdentifier?.identifier === bookId);
        console.log("Book found from Redux:", bookFromContext);
        if (bookFromContext) {
          dispatch(setBookDetails(bookFromContext));
          console.log("BookDetails updated by the bookFromContext:", bookFromContext);
          await fetchChapterSummaries(bookFromContext);
        }
        setLoading(false);
      }
    }
    fetchBookDetails();
  }, [bookId, setLoading, books, dispatch]);

  const fetchChapterSummaries = async (book: GoogleBookVolume) => {
    try {
      const { title, authors, publishedDate } = book;
      const bookData = {
        title,
        authors,
        publishedDate: publishedDate, // Change the key to 'publishedDate'
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/openai/summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_JWT_TOKEN}`,
        },
        body: JSON.stringify({ books: [bookData] }), // Use the new bookData object
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      if (responseData && responseData.summaries && responseData.summaries.length > 0) {
        const summarizedData = responseData.summaries[0].summary;
        const updatedBookDetails = {
          ...book,
          summary: summarizedData,
        };
        dispatch(setBookDetails(updatedBookDetails));
        console.log("Updated book details with summary:", updatedBookDetails);
      }
    } catch (error) {
      console.error("Error fetching chapter summaries:", error);
    }
  };

  return (
    <div className="p-4 border flex flex-col space-y-2 border-gray-300 rounded-md min-w-[400px] w-full">
      <h2 className="text-gray-800 text-xl">Book Summary</h2>
      {onLoading && <SkeletonBookSummary />}
      <div>
        <p className="text-gray-700 text-start justify-center">{bookDetails?.summary}</p>
        <AskAiButton />
      </div>
    </div>
  );
};

export default withAuth(SummaryBook);