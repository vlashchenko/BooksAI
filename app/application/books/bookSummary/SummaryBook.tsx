"use client";

import React, { useEffect, useState } from "react";
import { GoogleBookVolume } from "@/app/components/types";
import { SkeletonBookSummary } from "@/app/components/Skeleton";
import AskAiButton from "./AskAiButton";
import withAuth from "@/app/components/withAuth";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/store/store"; // Import AppDispatch
import { setBookDetails } from "@/app/store/slices";
import { fetchAiSummary } from "@/app/store/bookThunk.client"; // Import the thunk

export type SummaryBookProps = {
  bookId: string | null;
  setLoading: (loading: boolean) => void;
  onLoading: boolean;
};

const SummaryBook = ({ bookId, setLoading, onLoading }: SummaryBookProps) => {
  const [summaryLoading, setSummaryLoading] = useState(false); // State for summary loading
  const books = useSelector((state: RootState) => state.books.items);
  const bookDetails = useSelector(
    (state: RootState) => state.books.selectedBook
  );
  const dispatch: AppDispatch = useDispatch(); // Properly type the dispatch

  console.log("SummaryBook received bookId prop:", bookId);
  console.log("SummaryBook received books from Redux:", books);
  console.log("Current bookDetails from Redux:", bookDetails);

  useEffect(() => {
    if (bookId) {
      console.log("Fetching details for bookId:", bookId);
      setLoading(true);
      const bookFromContext = books.find(
        (book) => book.industryIdentifier?.identifier === bookId
      );
      console.log("Book found from Redux:", bookFromContext);
      if (bookFromContext) {
        dispatch(setBookDetails(bookFromContext));
        console.log(
          "BookDetails updated by the bookFromContext:",
          bookFromContext
        );

        // Set loading state for the summary
        setSummaryLoading(true);
        dispatch(fetchAiSummary({ bookDetails: bookFromContext })).finally(() =>
          setSummaryLoading(false)
        ); // Ensure loading state is reset
      }
      setLoading(false);
    }
  }, [bookId, setLoading, books, dispatch]);

  return (
    <div className="p-4 border flex flex-col space-y-2 border-gray-300 rounded-md min-w-[400px] w-full">
      <h2 className="text-gray-800 text-xl">Book Summary</h2>
      {(onLoading || summaryLoading) && <SkeletonBookSummary />}{" "}
      {/* Display skeleton when loading */}
      <div>
        <p className="text-gray-700 text-start justify-center">
          {bookDetails?.summary}
        </p>
      </div>
    </div>
  );
};

export default withAuth(SummaryBook);
