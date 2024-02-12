import React, { useState } from "react";
import Link from "next/link";
import { GoogleBookVolume } from "@/app/components/types";

export type BookBarMenuProp = {
  bookDetails: GoogleBookVolume | null;
  setBookDetails: (bookDetails: GoogleBookVolume) => void;
  onQueryChange: (query: string) => void;
};

const BookBarMenu = ({ bookDetails, setBookDetails, onQueryChange }: BookBarMenuProp) => {
  const [isClicked, setIsClicked] = useState(false);
  const [buttonText, setButtonText] = useState('Ask AI');
  const [inputValue, setInputValue] = useState<string>('');

  const fetchContext = async () => {
    try {
      const response = await fetch(`/api/openai/context/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookDetails, query: inputValue }),
      });

      const responseData = await response.json();

      if (responseData && responseData.context) {
        setBookDetails({ ...bookDetails, ...responseData.context} as GoogleBookVolume);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleButtonClick = () => {
    if (buttonText === 'Ask AI') {
      setButtonText('Search');
      setIsClicked(true);
    } else {
      fetchContext();
      onQueryChange(inputValue)
      setButtonText('Ask AI');
      setIsClicked(false);
      setInputValue('');
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="grid grid-flow-col justify-end text-base gap-2">
      <div className="bg-[#00df9a] py-1 px-3 rounded-md text-center">
        <Link href="/" className="text-black">Home</Link>
      </div>
      <div className="bg-[#00df9a] py-1 px-3 rounded-md text-center">
        <Link href="/application/books/booksList" className="text-black">Books
        </Link>
      </div>
      <div className="rounded-md flex flex-row justify-start items-center">
        <button
          onClick={handleButtonClick}
          className="text-black bg-[#00df9a] text-base rounded-md px-3 py-1 w-full"
        >
          {buttonText}
        </button>
        {isClicked && (
          <input
            type="text"
            className="w-22 ml-2 text-black"
            placeholder="Ask AI re Book"
            value={inputValue}
            onChange={handleInputChange}
          />
        )}
      </div>
    </div>
  );
};

export default BookBarMenu;
