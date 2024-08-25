"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { SkeletonBookSummary } from "@/app/components/Skeleton";

export type ContextBookProps = {
  onLoadingContext: boolean; // No need to use setLoadingContext in the component
};

const ContextBook = ({ onLoadingContext }: ContextBookProps) => {
  // Ensure contextResponses is always an object
  const contextResponses = useSelector(
    (state: RootState) => state.books.contextResponses || {}
  );
  const queryContext = useSelector(
    (state: RootState) => state.books.queryContext
  );

  useEffect(() => {
    console.log("ContextBook re-rendered with contextResponses:", contextResponses);
  }, [contextResponses]);

  useEffect(() => {
    if (queryContext) {
      console.log("ContextBook: New queryContext received:", queryContext);
    }
  }, [queryContext]);

  return (
    <div className="space-y-6">
      {onLoadingContext && <SkeletonBookSummary />} {/* Show skeleton when loading */}
      {!onLoadingContext && Object.entries(contextResponses).map(([question, answer], index) => (
        <div
          key={`${index}`}
          className="p-4 border flex flex-col space-y-2 border-gray-300 rounded-md"
        >
          <h2 className="text-gray-800 text-xl">{`Question: ${question}`}</h2>
          <p className="text-gray-700">{`Answer: ${answer}`}</p>
        </div>
      ))}
    </div>
  );
};

export default ContextBook;