// src/app/summary/page.tsx

"use client";

import React, { useState, useEffect, useContext } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { GoogleBookVolume } from "@/app/components/types";
import HomeButtonSVG from "@/public/assets/svg/HomeButtonSVG";
import LibraryButtonSVG from "@/public/assets/svg/LibraryButtonSVG";
import SearchButtonSVG from "@/public/assets/svg/SearchButtonSVG";
import MenuButtonSVG from "@/public/assets/svg/MenuButtonSVG";
import { BookContext } from "@/app/components/BookContext"; // Import the context

const BookSummaryPage: React.FC = () => {
  const searchParams = useSearchParams();
  const bookId = searchParams?.get("bookId") || null;
  const { books } = useContext(BookContext); // Use the context to access books
  const [bookDetails, setBookDetails] = useState<GoogleBookVolume | null>(null);
  const [chapterSummaries, setChapterSummaries] = useState<GoogleBookVolume[]>([]);

  useEffect(() => {
    async function fetchBookDetails() {
      if (bookId) {
        const bookFromContext = books.find(book => book.industryIdentifier.identifier === bookId);
        if (bookFromContext) {
          setBookDetails(bookFromContext);
          await fetchChapterSummaries(bookFromContext);
        } else {
          try {
            const response = await fetch(`/api/items?query=${bookId}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch book details for bookId: ${bookId}`);
            }
            const data = await response.json();
            if (data && Array.isArray(data) && data.length > 0) {
              const matchedBook = data[0];
              setBookDetails(matchedBook);
            } else {
              console.error("No book details received for bookId:", bookId);
            }
          } catch (error) {
            console.error("Error fetching book details:", error);
          }
        }
      }
    }
    fetchBookDetails();
  }, [bookId, books]);
  
  const fetchChapterSummaries = async (book: GoogleBookVolume) => {
    try {
      console.log(
        "Fetching chapter summaries for book:",book); // Log here
      const response = await axios.post("/api/bookGPTAPI", {
        books: [book],
      });

      if (
        response.data &&
        response.data.summarizedBooks &&
        response.data.summarizedBooks.length > 0
      ) {
        const summarizedData = response.data.summarizedBooks[0];
        console.log(
          "Received chapter summary for book:",
          summarizedData.title,
          "by",
          summarizedData.authors.join(", ")
        ); // Log here
        setChapterSummaries((prev) => [
          ...prev,
          {
            title: summarizedData.title,
            authors: summarizedData.authors,
            description: summarizedData.summarizedText,
            industryIdentifier: book.industryIdentifier,
            thumbnail: book.thumbnail,
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching chapter summaries:", error); // You already had this log
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Top Menu */}
      <div className="flex justify-center space-x-4 mb-6">
        <button title="Home">
          <HomeButtonSVG />
        </button>
        <button title="Library">
          <LibraryButtonSVG />
        </button>
        <button title="Search">
          <SearchButtonSVG />
        </button>
        <button title="Menu">
          <MenuButtonSVG />
        </button>
      </div>

      {/* Info Container */}
      {bookDetails && (
        <div className="flex items-center space-x-6 mb-10">
          <Image
            src={bookDetails.thumbnail || "/path/to/default/image.jpg"}
            alt={bookDetails.title}
            width={100}
            height={150}
            className="w-1/4"
          />
          <div className="flex flex-col space-y-2">
            <h1 className="text-xl truncate">{bookDetails.title}</h1>
            <h2 className="text-lg text-gray-600 truncate">
              by {bookDetails.authors.join(", ")}
            </h2>
          </div>
        </div>
      )}

      {/* Chapter Summaries */}
      <div className="space-y-6">
        {chapterSummaries.map((summary, idx) => (
          <div key={idx} className="p-4 border border-gray-300 rounded-md">
            <h2 className="text-xl mb-2">{summary.title}</h2>
            <p className="text-gray-700">{summary.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookSummaryPage;
