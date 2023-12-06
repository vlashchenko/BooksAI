"use client"

import React from 'react'
import { TypeAnimation } from 'react-type-animation';

const TypeComponent = () => {
    return(
    <TypeAnimation
      sequence={[
        'Books', // Types 'One'
        2000, // Waits 3s
        'Articles', // Deletes 'One' and types 'Two'
        2000, // Waits 3s
        'Products', // Types 'Three' without deleting 'Two'
        2000, // Waits 3s
        () => {
          console.log('Sequence completed');
        },
      ]}
      cursor={true}
      repeat={Infinity}
      className='md:text-4xl sm:text-3xl text-2xl text-[#00df9a] font-bold pl-1 md:pl-4'
    />
  );
};

export default TypeComponent