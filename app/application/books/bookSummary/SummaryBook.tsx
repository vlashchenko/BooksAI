"use client";

import React, { useEffect, useContext } from "react";
import { BookContext } from "@/app/wrappers/BooksListContext";
import { GoogleBookVolume } from "@/app/components/types";
import { SkeletonBookSummary } from "@/app/components/Skeleton";
import AskAiButton from "./AskAiButton";
import { BookDetailsContext } from "@/app/wrappers/BookDetailsContext";
import { ContextQueryContext } from "@/app/wrappers/ContextQueryContext";

export type SummaryBookProps = {
  bookId: string | null;
  setLoading: (loading: boolean) => void;
  onLoading: boolean;
};

const SummaryBook = ({
  bookId,
  setLoading,
  onLoading,
}: SummaryBookProps) => {
  const { books } = useContext(BookContext); // Use the context to access books
  const { bookDetails, setBookDetails } = useContext(BookDetailsContext)
  const { queryContext, setQueryContext } = useContext(ContextQueryContext)
  useEffect(() => {
    async function fetchBookDetails() {
      if (bookId) {
        setLoading(true);
        const bookFromContext = books.find(
          (book) => book.industryIdentifier?.identifier === bookId
        );
        console.log("Set bookFromContext :", bookFromContext)
        if (bookFromContext) {
          setBookDetails([bookFromContext]);
          console.log("BookDetails updated by the bokFrimContext:", bookDetails)
          await fetchChapterSummaries(bookFromContext);
        }
        setLoading(false);
      }
    }
    fetchBookDetails();
  }, [bookId, setLoading]);

  const fetchChapterSummaries = async (book:GoogleBookVolume) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/openai/summary/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${yourJWTToken}` // Add your JWT token here
          },
          body: JSON.stringify({ books: [book] }),
        }
      );
  
      const responseData = await response.json();
      if (
        responseData &&
        responseData.summaries &&
        responseData.summaries.length > 0
      ) {
        const summarizedData = responseData.summaries[0].summary;
  
        const updatedBookDetails = {
          ...book,
          summary: summarizedData,
        };
  
        setBookDetails([updatedBookDetails]);
      }
    } catch (error) {
      console.error("Error fetching chapter summaries:", error);
    }
  };
  

  return (
    <div className=" p-4 border flex flex-col space-y-2 border-gray-300 rounded-md min-w-[400px] w-full">
      <h2 className="text-gray-800 text-xl">Book Summary</h2>
      {onLoading && <SkeletonBookSummary />}
      <div>
      <p className="text-gray-700 text-start justify-center">
        {bookDetails.length > 0 && bookDetails[0]?.summary}
      </p>
      <AskAiButton />
      </div>
    </div>
  );
};

export default SummaryBook;
