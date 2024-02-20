import React, { useState } from "react";
import Link from "next/link";
import { GoogleBookVolume } from "@/app/components/types";
import SearchButtonSVG from "@/public/assets/svg/SearchButtonSVG";

export type BookBarMenuProp = {
  bookDetails: GoogleBookVolume | null;
  setBookDetails: (bookDetails: GoogleBookVolume) => void;
  onQueryChange: (query: string) => void;
};

const BookBarMenu = ({ bookDetails, setBookDetails, onQueryChange }: BookBarMenuProp) => {
  const [isClicked, setIsClicked] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');

  const fetchContext = async () => {
    console.log('bookDetails to Context:', bookDetails)
    try {
      const response = await fetch(`/api/openai/context/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookDetails:[bookDetails], query: inputValue }),
      });

      const responseData = await response.json();
      const responseContext = responseData[0]
      console.log ("accessing respponseData", responseContext)
      

      if (responseData && responseData.length > 0) {
        // Assign the full string from responseData array to 'context' in bookDetails
        const enhancedBookDetails = { ...bookDetails, context: responseData[0] };
        setBookDetails(enhancedBookDetails);
        onQueryChange(inputValue);
        console.log("Updated bookDetails with new context:", enhancedBookDetails);
      }
      console.log("Updated bookDetails with responseDatacontext):", bookDetails)
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      // Reset button and input field after fetch
      setIsClicked(false);
      setInputValue('');
    }
  };

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

export default BookBarMenu;
