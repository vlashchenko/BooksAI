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

const BookBarMenu = ({ bookDetails, setBookDetails, onQueryChange, loadingContext, setLoadingContext}: BookBarMenuProp) => {
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
      <div className="bg-[#00df9a] p-2 mb-1 rounded-md text-center">
        <Link href="/" className="text-black">Home</Link>
      </div>
      <div className="bg-[#00df9a] p-2 mb-1 rounded-md text-center">
        <Link href="/application/books/booksList" className="text-black">Books</Link>
      </div>
      
      </div>
  );
};

export default BookBarMenu;
