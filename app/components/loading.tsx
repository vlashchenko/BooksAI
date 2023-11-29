// src/app/dashboard/loading.ts

import React from 'react';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";


export default function Loading() {
  // This is where you define your skeleton or any other loading indicator
  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <p>
        <Skeleton count={3} width={200} height={30} />
      </p>
    </SkeletonTheme>
  );
}