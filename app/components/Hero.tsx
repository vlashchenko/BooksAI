import React from "react";
import Link from "next/link";
import TypeComponent from "./TypeAnimation";

const Hero = () => {
  return (
    <div className="max-w-[800px] w-full mx-auto text-center flex flex-col justify-center items-center">
      <p className="text-[#00df9a] font-bold p-2">EXPLORE AI CAPABILITIES</p>
      <h1 className="md:text-6xl sm:text-5xl text-3xl font-bold md:py-6">
        EXTEND YOUR BORDERS
      </h1>
      <div className="flex justify-center items-center">
        <div className="flex justify-center items-center">
          <p className="md:text-4xl sm:text-3xl text-2xl text-white">Search, learn, analyze</p>
          <div className="flex w-32">
            <TypeComponent />
          </div>
        </div>
      </div>
      <Link
        href="application/books/booksList"
        className="bg-[#00df9a] w-[200px] rounded-md my-6 font-medium mx-auto py-3 text-black"
      >
        Book Summary
      </Link>
    </div>
  );
  
};

export default Hero;
