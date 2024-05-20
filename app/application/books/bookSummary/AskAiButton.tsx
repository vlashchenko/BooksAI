"use client";

import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import SearchButtonSVG from "@/public/assets/svg/SearchButtonSVG";
import { ContextQueryContext } from "@/app/wrappers/ContextQueryContext";

const AskAiButton = () => {
  const { queryContext, setQueryContext } = useContext(ContextQueryContext);
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleButtonClick = () => {
    setIsSearching(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    setQueryContext(query);
    setIsSearching(false);
    setQuery("");
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <div>
      {isSearching ? (
        <div className="flex items-center">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="border p-2 mt-1 rounded-l text-black"
            placeholder="Ask AI about the book..."
          />
          <button
            onClick={handleSearchSubmit}
            className="bg-blue-500 p-2 mt-1 rounded-r text-black"
          >
            <SearchButtonSVG />
          </button>
        </div>
      ) : (
        <button onClick={handleButtonClick} className="bg-blue-500 p-2 mt-1 rounded text-black">
          Ask AI
        </button>
      )}  
    </div>
  );
};

export default AskAiButton;
