"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/store/store";
import { fetchAiContext } from "@/app/store/bookThunk.client";
import { SkeletonBookSummary } from "@/app/components/Skeleton";

export type ContextBookProps = {};

const ContextBook = () => {
  const dispatch: AppDispatch = useDispatch();
  const contextResponses = useSelector(
    (state: RootState) => state.books.contextResponses || {}
  );
  const queryContext = useSelector(
    (state: RootState) => state.books.queryContext
  );
  const selectedBook = useSelector(
    (state: RootState) => state.books.selectedBook
  );

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (queryContext && selectedBook) {
      setIsLoading(true); // Set loading state to true before dispatching the action
      dispatch(
        fetchAiContext({ bookDetails: selectedBook, query: queryContext })
      ).finally(() => setIsLoading(false)); // Set loading state to false after the action completes
    }
  }, [queryContext, selectedBook, dispatch]);

  return (
    <div className="space-y-6">
      {isLoading ? (
        <SkeletonBookSummary />
      ) : (
        Object.entries(contextResponses).map(([question, answer], index) => (
          <div
            key={`${index}`}
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
