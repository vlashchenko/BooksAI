"use client"

import React, {useEffect, useState} from "react";
import Link from "next/link";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

const Navbar = () => {

  const [nav, setNav] = useState(false)

  const handleNav = () => {
    setNav(!nav)
  }

  return (
    <div className="flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4">
      <div></div>
      <h1 className="text-3xl w-full text-bold">
       <Link href="/"> <span className=" text-[#00df9a]">DEMO.</span><span className="text-white">SV</span></Link>
      </h1>
      <ul className="hidden md:flex">
        <Link href="/application/books/booksList" className="p-4">BookAI</Link>
        <li className="p-4">About</li>
        <li className="p-4">Contact </li>
      </ul>
      <div onClick={handleNav} className="block md:hidden">
        {nav ? <AiOutlineClose size={30}/> : <AiOutlineMenu size={30}/>}
      </div>
      <div className={nav ? "bg-[#000300] fixed top-0 left-0 w-[60%] border-r border-r-gray-900 h-full":"fixed ease-in-out duration-500 left-[-100%]"} >
        <h1 className="m-4 text-3xl w-full text-bold">
          <span className=" text-[#00df9a]">DEMO.</span>SV
        </h1>
        <ul className="pt-4 uppercase">
          <Link href="/application/books/booksList" className="p-4 border-b border-gray-600">BookAI</Link>
          <li className="p-4 border-b border-gray-600">ProductsAI</li>
          <li className="p-4 border-b border-gray-600">About</li>
          <li className="p-4 border-b border-gray-600">Contact </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
