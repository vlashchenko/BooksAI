import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/store/store";
import { fetchAiContext } from "@/app/store/bookThunk";
import SearchButtonSVG from "@/public/assets/svg/SearchButtonSVG";

const AskAiButton = () => {
  const dispatch: AppDispatch = useDispatch();
  const selectedBook = useSelector(
    (state: RootState) => state.books.selectedBook
  );
  const contextResponses = useSelector(
    (state: RootState) => state.books.contextResponses
  );
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    console.log("Context Responses:", contextResponses);
  }, [contextResponses]);

  const handleButtonClick = () => {
    setIsSearching(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    if (selectedBook) {
      console.log("Dispatching fetchAiContext with query:", query);
      dispatch(fetchAiContext({ bookDetails: selectedBook, query }));
      setIsSearching(false);
      setQuery(""); // Reset the query after submission
    } else {
      console.error("No book selected to ask AI.");
    }
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
