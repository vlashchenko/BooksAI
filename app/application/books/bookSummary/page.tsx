// src/app/summary/page.tsx

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GoogleBookVolume } from "@/app/components/types";
import BookBarMenu from "./BookBarMenu";
import { Suspense } from "react";
import Loading from "./loading";
import SummaryBook from "./SummaryBook";
import { useSearchParams } from "next/navigation";

const BookSummaryPage = () => {
  const searchParams = useSearchParams();
  const bookId = searchParams?.get("bookId") || null;
  const [bookDetails, setBookDetails] = useState<GoogleBookVolume | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false)

  return (
    <div className="max-w-[800px] bg-white container mx-auto p-4">
      {/* Top Menu */}
      <BookBarMenu
        bookDetails={bookDetails}
        setBookDetails={setBookDetails}
        onQueryChange={setQuery}
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
        <Suspense fallback={<Loading />}>
          <SummaryBook
            bookId={bookId}
            setBookDetails={setBookDetails}
            bookDetails={bookDetails}
            setLoading={setLoading}
          />
        </Suspense>
      </div>
      {/* Book Context Answer */}
      
      {bookDetails?.context && (
        <div className="space-y-6">
          <div className="p-4 border flex flex-col space-y-2 border-gray-300 rounded-md">
            <h2>{`Answer to quewstion: ${query}`}</h2>
            <p className="text-gray-700">{bookDetails.context}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookSummaryPage;
