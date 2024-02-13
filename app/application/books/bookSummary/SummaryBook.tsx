"use client";

import React, { useEffect, useContext } from "react";
import { BookContext } from "@/app/components/BookContext";
import { GoogleBookVolume } from "@/app/components/types";
import Loading from "./SummaryLoading";

export type SummaryBookProps = {
  bookId: string | null;
  setBookDetails: (value: GoogleBookVolume) => void;
  bookDetails: GoogleBookVolume | null;
  setLoading: (loading: boolean) => void;
};

const SummaryBook = ({
  bookId,
  setBookDetails,
  bookDetails,
  setLoading,
}: SummaryBookProps) => {
  const { books } = useContext(BookContext); // Use the context to access books

  useEffect(() => {
    async function fetchBookDetails() {
      if (bookId) {
        setLoading(true);
        const bookFromContext = books.find(
          (book) => book.industryIdentifier.identifier === bookId
        );
        if (bookFromContext) {
          setBookDetails(bookFromContext);
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
        console.log(`Updated bookdetailes with summary:`, summarizedData);

        const updatedBookDetails = {
          ...book, // Spread the existing book details
          summary: summarizedData, // Update the summary
        };

        setBookDetails(updatedBookDetails);
      }
    } catch (error) {
      console.error("Error fetching chapter summaries:", error); // You already had this log
    }
  };

  return (
    <div className="p-4 border flex flex-col space-y-2 border-gray-300 rounded-md">
      <h2 className="ext-gray-800 text-black text-xl">Book Summary</h2>
      <p className="text-gray-700 text-start justify-center">
        {bookDetails?.summary}
      </p>
    </div>
  );
};

export default SummaryBook;
