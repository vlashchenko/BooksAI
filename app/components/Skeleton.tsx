import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import React from "react";

export function SkeletonBookList() {
  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <p>
        <Skeleton count={5} width={200} height={30} duration={2}/>
      </p>
    </SkeletonTheme>
  );
}

export function SkeletonBookSummary() {
  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <h1><Skeleton/></h1>
      <p>
        <Skeleton count={10} width={400} height={30} duration={2}/>
      </p>
    </SkeletonTheme>
  )
}