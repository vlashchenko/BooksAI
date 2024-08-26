import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store/store";
import { setQueryContext } from "@/app/store/slices";
import SearchButtonSVG from "@/public/assets/svg/SearchButtonSVG";

const AskAiButton = () => {
  const dispatch: AppDispatch = useDispatch();
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");

  const handleButtonClick = () => {
    setIsSearching(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    dispatch(setQueryContext(query)); // Set the query in the Redux store
    setIsSearching(false);
    setQuery(""); // Reset the query after submission
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
            title="Submit your question"
          >
            <SearchButtonSVG />
          </button>
        </div>
      ) : (
        <button
          onClick={handleButtonClick}
          className="bg-blue-500 p-2 mt-1 rounded text-black"
        >
          Ask AI
        </button>
      )}
    </div>
  );
};

export default AskAiButton;