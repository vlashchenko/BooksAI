"use client";

import React, { useEffect, useContext } from "react";
import { ContextQueryContext } from "@/app/wrappers/ContextQueryContext"; 
import { ContextQueryContextType } from "@/app/wrappers/ContextQueryContext";
import { BookDetailsContext, BookDetailsContextType } from "@/app/wrappers/BookDetailsContext";
import { GoogleBookVolume } from "@/app/components/types";
import Loading from "./SummaryLoading";
import { SkeletonBookSummary } from "@/app/components/Skeleton";

export type ContextBookProps = {
  setLoadingContext: (loading: boolean) => void;
  onLoadingContext: boolean;
};

const ContextBook = ({
  setLoadingContext,
  onLoadingContext,
}: ContextBookProps) => {
  const { queryContext, setQueryContext } = useContext(ContextQueryContext); 
  const { bookDetails, setBookDetails } = useContext(BookDetailsContext)


  useEffect(() => {
    async function fetchBookDetails() {
      if (queryContext) {
        setLoadingContext(true);
        await fetchContext()
      }
      setLoadingContext(false)
    }
     fetchBookDetails();
  }, [queryContext]);

  const fetchContext = async () => {
    console.log("bookDetails to Context:", bookDetails);
    try {
      const response = await fetch(`/api/openai/context/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookDetails: [bookDetails], query: queryContext }),
      });

      const responseData = await response.json();
      const responseContext = responseData[0];
      console.log("accessing respponseData", responseContext);

      if (responseData && responseData.length > 0) {
        // Assign the full string from responseData array to 'context' in bookDetails
        const enhancedBookDetails = {
          ...bookDetails,
          context: responseData[0],
        };
        setBookDetails(enhancedBookDetails);
        console.log(
          "Updated bookDetails with new context:",
          enhancedBookDetails
        );
      }
      console.log(
        "Updated bookDetails with responseDatacontext):",
        bookDetails
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      // Reset button and input field after fetch
    }
  };

  return (
    <div>
    {bookDetails.context && (
      <div className="space-y-6">
        <div className="p-4 border flex flex-col space-y-2 border-gray-300 rounded-md">
          <h2>{`Answer to question: ${queryContext}`}</h2>
          <p className="text-gray-700">{bookDetails.context}</p>
        </div>
      </div>
    )}
    </div>
  );
};

export default ContextBook;
