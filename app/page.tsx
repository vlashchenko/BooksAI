import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'

const AppPage = () => {

  console.log("the start page mounted")
  return (
    <div className='mb-24'>
   <Hero/>
    </div>
  )
}

export default AppPage
