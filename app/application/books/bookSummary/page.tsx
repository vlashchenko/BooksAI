// src/app/summary/page.tsx

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GoogleBookVolume } from "@/app/components/types";
import BookBarMenu from "./BookBarMenu";
import { Suspense } from "react";
import Loading from "./SummaryLoading";
import SummaryBook from "./SummaryBook";
import { useSearchParams } from "next/navigation";
import { SkeletonBookSummary } from "@/app/components/Skeleton";
import { BookDetailsContext } from "@/app/wrappers/BookDetailsContext";
import ContextBook from "./ContextBook";

const BookSummaryPage = () => {
  const searchParams = useSearchParams();
  const bookId = searchParams?.get("bookId") || null;
  const [bookDetails, setBookDetails] = useState<GoogleBookVolume | null>(null);
  const [query, setQuery] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingContext, setLoadingContext] = useState(false)

  return (
    <div className="max-w-[800px] bg-white container mx-auto p-4">
      {/* Top Menu */}
      <BookBarMenu
        bookDetails={bookDetails}
        setBookDetails={setBookDetails}
        onQueryChange={setQuery}
        loadingContext={loadingContext}
        setLoadingContext={setLoadingContext}
      />

      {/* Info Container */}
      {bookDetails && (
        <div className="flex flex-col">
          <div className="text-black flex items-center space-x-6 my-2">
            <div className="flex ">
              <Image
                src={
                  bookDetails.thumbnail ||
                  "/assets/images/book_cover_placeholder.jpeg"
                }
                alt={bookDetails.title || "unknown author"}
                width={160}
                height={240}
                className="srink min-w-[60px] w-36 h-auto min-h-auto"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <h1 className="md:text-2xl sm:text-xl text-lg">
                {bookDetails.title}
              </h1>
              <h2 className="md:text-1xl sm:text-lg text-base text-gray-600">
                by {bookDetails.authors?.join(", ")}
              </h2>
            </div>
          </div>
        </div>
      )}

      {/* Chapter Summaries */}

      <div className="space-y-6">
        <Suspense fallback={<p>Loading feed...</p>}>
          <SummaryBook
            bookId={bookId}
            setLoading={setLoadingSummary}
            onLoading={loadingSummary}
          />
        </Suspense>
      </div>
      {/* Book Context Answer */}

      <ContextBook
      setLoadingContext={setLoadingContext}
      onLoadingContext={loadingContext}
      />
    </div>
  );
};

export default BookSummaryPage;
