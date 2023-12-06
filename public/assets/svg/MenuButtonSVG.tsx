import React from "react";

const MenuButtonSVG: React.FC = () => {
  return (
    <div className="w-20 h-20">
      <svg
        width="80px" // Adjusted to match the wrapper size
        height="80px" // Adjusted to match the wrapper size
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 6H20M7 12H17M9 18H15"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default MenuButtonSVG;
