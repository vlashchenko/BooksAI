// newai/app/page.tsx

"use client"

import React from "react";
import Hero from "./components/Hero";
import { Provider } from 'react-redux';
import {store} from './store/store';

const AppPage = () => {
  console.log("The start page mounted");
  return (
    <Provider store={store}>
      <div className="">
        <Hero />
      </div>
    </Provider>
  );
};

export default AppPage;