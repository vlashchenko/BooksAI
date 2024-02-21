import React, { useState } from "react";
import Link from "next/link";
import { GoogleBookVolume } from "@/app/components/types";
import SearchButtonSVG from "@/public/assets/svg/SearchButtonSVG";

export type BookBarMenuProp = {
  bookDetails: GoogleBookVolume | null;
  setBookDetails: (bookDetails: GoogleBookVolume) => void;
  setLoadingContext: (loadingContext: boolean) => void;
  loadingContext: boolean
  onQueryChange: (query: string) => void;
};

const AskAIButton = ({ bookDetails, setBookDetails, onQueryChange, loadingContext, setLoadingContext}: BookBarMenuProp) => {
  const [isClicked, setIsClicked] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');

  

  const handleButtonClick = () => {
    if (!isClicked) {
      setIsClicked(true);
    } else {
      fetchContext();
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
        <Link href="/application/books/booksList" className="text-black">Books</Link>
      </div>
      <div className="rounded-md flex flex-row justify-start items-center">
        {isClicked && (
          <input
            type="text"
            className="px-2 py-1 w-22 ml-2 text-black border border-#00df9a rounded-md"
            placeholder="Ask AI re Book"
            value={inputValue}
            onChange={handleInputChange}
          />
        )}
        <button
          onClick={handleButtonClick}
          className="text-black bg-[#00df9a] text-base rounded-md px-3 py-1 w-full flex justify-center items-center"
        >
          {isClicked ? <SearchButtonSVG /> : 'Ask AI'}
        </button>
      </div>
    </div>
  );
};

export default AskAIButton;
