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

const SummaryBook: React.FC<SummaryBookProps> = ({ bookId, setLoading, onLoading }) => {
  const [summaryLoading, setSummaryLoading] = useState(false); // State for summary loading
  const books = useSelector((state: RootState) => state.books.items);
  const bookDetails = useSelector(
    (state: RootState) => state.books.selectedBook
  );
  const dispatch: AppDispatch = useDispatch(); // Properly type the dispatch

  useEffect(() => {
    if (bookId) {
      setLoading(true);
      const bookFromContext = books.find(
        (book) => book.industryIdentifier?.identifier === bookId
      );
      if (bookFromContext) {
        dispatch(setBookDetails(bookFromContext));
        setSummaryLoading(true);
        dispatch(fetchAiSummary({ bookDetails: bookFromContext })).finally(() =>
          setSummaryLoading(false)
        );
      }
      setLoading(false);
    }
  }, [bookId, setLoading, books, dispatch]);

  return (
    <div className="p-4 border flex flex-col space-y-2 border-gray-300 rounded-md min-w-[400px] w-full">
      <h2 className="text-gray-800 text-xl">Book Summary</h2>
      {(onLoading || summaryLoading) && <SkeletonBookSummary />}
      <div>
        <p className="text-gray-700 text-start justify-center">
          {bookDetails?.summary}
        </p>
      </div>
    </div>
  );
};

export default withAuth(SummaryBook);