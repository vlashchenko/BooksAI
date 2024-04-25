"use client";

import React, { useEffect, useContext } from "react";
import { BookContext } from "@/app/wrappers/BooksListContext";
import { GoogleBookVolume } from "@/app/components/types";
import { SkeletonBookSummary } from "@/app/components/Skeleton";
import AskAIButton from "./AskAIButton";
import { BookDetailsContext, BookDetailsContextType } from "@/app/wrappers/BookDetailsContext";

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

  useEffect(() => {
    async function fetchBookDetails() {
      if (bookId) {
        setLoading(true);
        const bookFromContext = books.find(
          (book) => book.industryIdentifier?.identifier === bookId
        );
        console.log("Set bookFromContext :", bookFromContext)
        if (bookFromContext) {
          setBookDetails(bookFromContext);
          console.log("BookDetails updated by the bokFrimContext:", bookDetails)
          await fetchChapterSummaries(bookFromContext);
        }
        setLoading(false);
      }
    }
    fetchBookDetails();
  }, [bookId, setLoading]);

  const fetchChapterSummaries = async (book: GoogleBookVolume) => {
    try {
      console.log("Single book", book);
      const response = await fetch(`/api/openai/summary/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ books: [book] }), // Send the book data in the request body
      });

      const responseData = await response.json();
      console.log("Summary is of the type:", typeof responseData);
      console.log(`Page received Summary:`, responseData);

      if (
        responseData &&
        responseData.summaries &&
        responseData.summaries.length > 0
      ) {
        const summarizedData = responseData.summaries[0].summary;

        console.log("summarizedData :", summarizedData)
        
        const updatedBookDetails = {
          ...book, // Spread the existing book details
          summary: summarizedData, // Update the summary
        };
        
        setBookDetails(updatedBookDetails);
        console.log(`Updated bookdetailes with summary:`, bookDetails);
      }
    } catch (error) {
      console.error("Error fetching chapter summaries:", error); // You already had this log
    }
  };

  return (
    <div className="p-4 border flex flex-col space-y-2 border-gray-300 rounded-md">
      <h2 className="ext-gray-800 text-black text-xl">Book Summary</h2>
      {onLoading && <SkeletonBookSummary />}
      <p className="text-gray-700 text-start justify-center">
        {bookDetails?.summary}
      </p>
      <AskAIButton />
    </div>
  );
};

export default SummaryBook;
