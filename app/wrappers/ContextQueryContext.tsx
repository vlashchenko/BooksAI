"use client";

import { createContext, useState, ReactNode } from "react";

export type ContextQueryContextType = {
    queryContext: string;
    setQueryContext: (queryContext: string) => void;
  };

export const ContextQueryContext = createContext<ContextQueryContextType>({
    queryContext: "",
    setQueryContext: () => {},
  });
  
  export default function ContextQueryContextProvider({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const [queryContext, setQueryContext] = useState("");
    console.log("queryContext is updated", queryContext);
  
    return (
      <ContextQueryContext.Provider value={{ queryContext, setQueryContext }}>
        {children}
      </ContextQueryContext.Provider>
    );
  }