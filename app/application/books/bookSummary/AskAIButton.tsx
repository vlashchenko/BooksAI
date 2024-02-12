import React, { useState } from "react";

const AskAIButton = () => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div className="flex flex-row justify-start items-center">
      <button onClick={() => setIsClicked(!isClicked)} className="text-black bg-[#00df9a] rounded-md px-3 py-1">
        {isClicked ? `Search` : `Ask AI`}
      </button>
      {isClicked && <input type="text" className="w-16 ml-2" placeholder="Ask AI re Book" />}
    </div>
  );
};

export default AskAIButton;
