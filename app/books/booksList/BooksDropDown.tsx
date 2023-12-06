// src/components/BooksDropDown.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Adjusted import path for useRouter
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useCombobox } from "downshift";
import { GoogleBookVolume, BookDropdownProps } from "@/app/components/types";
import "react-loading-skeleton/dist/skeleton.css";
import Image from "next/image";
import bookCoverPlaceholder from "public/assets/images/book_cover_placeholder.jpeg";

const BookDropdown = ({
  books = [],
  onInputChange,
  isLoading,
}: BookDropdownProps)  => {
  const [filteredBooks, setFilteredBooks] = useState<GoogleBookVolume[]>([]);
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  useEffect(() => {
    console.log("Books prop received:", books);

    if (isLoading) {
      setFilteredBooks([]); // If still loading, don't show any results or placeholders
      return;
    }

    if (inputValue.trim().length >= 1) {
      const newFilteredBooks = books.filter((book) => {
        const titleMatch = book.title
          .toLowerCase()
          .includes(inputValue.toLowerCase());
        let authorMatch =
          Array.isArray(book.authors) &&
          book.authors.some((author) =>
            author.toLowerCase().includes(inputValue.toLowerCase())
          );
          return titleMatch || authorMatch;
        });
        console.log("newFiltered Books:", newFilteredBooks)

      // Deduplicate books based on industryIdentifier.identifier
      const uniqueIdentifiers = new Set(
        newFilteredBooks.map((b) => b.industryIdentifier.identifier)
      );

      const deduplicatedBooks = Array.from(uniqueIdentifiers)
        .map((id) => {
          return newFilteredBooks.find(
            (b) => b.industryIdentifier.identifier === id
          );
        })
        // Filter out possible 'undefined' results from the 'find' operation.
        .filter((book): book is GoogleBookVolume => book !== undefined);
        console.log("Deduplicated books:", deduplicatedBooks)

      setFilteredBooks(deduplicatedBooks);
      console.log("Current filteredBooks:", filteredBooks);
    } else {
      setFilteredBooks([]); // If the input is empty or just spaces, reset filteredBooks
    }
  }, [inputValue, books, isLoading]);

  useEffect(() => {
    console.log("Current filteredBooks after state update:", filteredBooks);
}, [filteredBooks]);

  const {
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    openMenu, // Used to programmatically open the menu
  } = useCombobox<GoogleBookVolume>({
    items: filteredBooks,

    onInputValueChange: ({ inputValue }) => {
      console.log("Input value changed:", inputValue);
      setInputValue(inputValue || "");
      onInputChange(inputValue || "");

      if (inputValue && filteredBooks.length === 0) {
        openMenu(); // Open the dropdown if there are filteredBooks
      }
    },

    itemToString: (item) => (item ? item.title : ""),
  });

  const handleBookClick = (book: GoogleBookVolume) => {
    const bookId = book.industryIdentifier.identifier;
    
    // LOGGING HERE
    console.log("Book selected with ID:", bookId);
    
    router.push(`/books//bookSummary?bookId=${bookId}`);
  };
  

  console.log("Dropdown states: isOpen:", isOpen, "isLoading:", isLoading);

  return (
    <div className="text-gray-700 w-full">
      <input
        {...getInputProps({ placeholder: "Search for a book..." })}
        className="w-full p-2 border border-gray-400 rounded"
      />
      <ul
        {...getMenuProps()}
        className="mt-2 bg-white w-full border-gray-400 rounded max-h-60 overflow-y-auto"
      >
        {isOpen && isLoading && (
          <SkeletonTheme baseColor="#202020" highlightColor="#444">
            <p>
              <Skeleton count={3} width={200} height={30} />
            </p>
          </SkeletonTheme>
        )}
        {isOpen &&
          !isLoading &&
          filteredBooks.map((book, index) => (
            <li
              key={`${book.title}-${book.industryIdentifier.identifier}`}
              {...getItemProps({ item: book, index })}
              onClick={() => handleBookClick(book)}
              className={`flex items-start p-2 space-x-2 ${
                highlightedIndex === index ? "bg-gray-200" : ""
              }`}
            >
              <Image
                src={book.thumbnail ? book.thumbnail : bookCoverPlaceholder}
                alt={book.title}
                width={30}
                height={50}
              />

              <div className="flex-1 overflow-hidden">
                <div className="font-bold truncate">{book.title}</div>
                <div className="text-xs truncate">
                  {Array.isArray(book.authors) && book.authors.length
                    ? book.authors.join(", ")
                    : "Unknown Author"}
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default BookDropdown;
