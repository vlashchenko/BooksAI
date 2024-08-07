"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { setBookDetails } from "@/app/store/slices";
import { GoogleBookVolume } from "@/app/components/types";
import { SkeletonBookSummary } from "@/app/components/Skeleton";

export type ContextBookProps = {
  setLoadingContext: (loading: boolean) => void;
  onLoadingContext: boolean;
};

const ContextBook = ({
  setLoadingContext,
  onLoadingContext,
}: ContextBookProps) => {
  const dispatch = useDispatch();
  const bookDetails = useSelector(
    (state: RootState) => state.books.bookDetails
  );
  const queryContext = useSelector(
    (state: RootState) => state.books.queryContext
  );

  useEffect(() => {
    async function fetchBookDetails() {
      if (queryContext) {
        setLoadingContext(true);
        await fetchContext();
        setLoadingContext(false);
      }
    }
    fetchBookDetails();
  }, [queryContext]);

  const fetchContext = async () => {
    console.log("bookDetails to Context:", bookDetails);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/openai/context/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_JWT_TOKEN}`,
        },
        body: JSON.stringify({ bookDetails, query: queryContext }),
      });

      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (responseData && responseData.context) {
        const enhancedBookDetails = bookDetails.map((book: GoogleBookVolume) => {
          const newContext = {
            ...book.context,
            [queryContext]: responseData.context || "No context provided",
          };
          return {
            ...book,
            context: newContext,
          };
        });
        dispatch(setBookDetails(enhancedBookDetails));
        console.log(
          "Updated bookDetails with new context:",
          enhancedBookDetails
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="space-y-6">
      {onLoadingContext && <SkeletonBookSummary />}
      {Array.isArray(bookDetails) && bookDetails.map(
        (book, bookIndex) =>
          book.context &&
          Object.entries(book.context).map(([question, answer], index) => (
            <div
              key={`${bookIndex}-${index}`}
              className="p-4 border flex flex-col space-y-2 border-gray-300 rounded-md"
            >
              <h2 className="text-gray-800 text-xl">{`Question: ${question}`}</h2>
              <p className="text-gray-700">{`Answer: ${answer}`}</p>
            </div>
          ))
      )}
    </div>
  );
};

export default ContextBook;