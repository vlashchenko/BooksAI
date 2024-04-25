// src/components/BooksDropDown.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Adjusted import path for useRouter
import { useCombobox } from "downshift";
import { GoogleBookVolume } from "@/app/components/types";
import "react-loading-skeleton/dist/skeleton.css";
import Image from "next/image";
import bookCoverPlaceholder from "public/assets/images/book_cover_placeholder.jpeg";
import { SkeletonBookList } from "@/app/components/Skeleton";

export type BookDropdownProps = {
  books?: GoogleBookVolume[];
  onInputChange: (value: string) => void;
  isLoading: boolean;
};

const BookDropdown = ({
  books = [],
  onInputChange,
  isLoading,
}: BookDropdownProps) => {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  // You might still want to keep track of inputValue for other purposes
  const onInputValueChanged = (value: string) => {
    setInputValue(value);
    onInputChange(value);
  };

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    openMenu,
  } = useCombobox<GoogleBookVolume>({
    items: books,

    onInputValueChange: ({ inputValue }) => {
      onInputValueChanged(inputValue || "");
      if (inputValue && books.length === 0) {
        openMenu();
      }
    },

    itemToString: (item) => item?.title ?? "",
  });

  const handleBookClick = (book: GoogleBookVolume) => {
    const bookId = book.industryIdentifier?.identifier;
    console.log("Book selected with ID:", bookId);
    router.push(`/application/books/bookSummary?bookId=${bookId}`);
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
        {isOpen && isLoading && <SkeletonBookList />}
        {isOpen &&
          !isLoading &&
          books.map((book, index) => (
            <li
              key={`${book.title}-${book.industryIdentifier?.identifier}`}
              {...getItemProps({ item: book, index })}
              onClick={() => handleBookClick(book)}
              className={`flex items-start p-2 space-x-2 ${
                highlightedIndex === index ? "bg-gray-200" : ""
              }`}
            >
              <Image
                src={book.thumbnail ? book.thumbnail : bookCoverPlaceholder}
                alt={book.title || "Unknown title"}
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
