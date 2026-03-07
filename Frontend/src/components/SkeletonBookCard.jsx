import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

export const SkeletonBookCard = () => {
  return (
    <Card className="flex flex-col h-[360px] animate-pulse transition-shadow duration-300 border-gray-100/80 dark:bg-gray-900 dark:border-gray-800/50 rounded-xl">
      <CardHeader className="p-0">
        <div className="w-full h-44 bg-gray-100 dark:bg-gray-800/50 rounded-t-xl" />
      </CardHeader>
      
      <CardContent className="flex-1 p-4 flex flex-col gap-2">
        {/* Category badge skeleton */}
        <div className="h-5 w-20 bg-gray-100 dark:bg-gray-800 rounded-md" />
        
        {/* Title skeleton (2 lines max) */}
        <div className="space-y-2 flex-1 mt-1">
          <div className="h-5 w-full bg-gray-100 dark:bg-gray-800 rounded-md" />
          <div className="h-5 w-3/4 bg-gray-100 dark:bg-gray-800 rounded-md" />
        </div>
        
        {/* Author skeleton */}
        <div className="h-4 w-1/2 bg-gray-100 dark:bg-gray-800 rounded-md mt-1" />
      </CardContent>

      <CardFooter className="p-4 pt-3 flex flex-col justify-end border-t border-gray-50 dark:border-gray-800/50">
        <div className="h-10 w-full bg-gray-100 dark:bg-gray-800 rounded-lg" />
      </CardFooter>
    </Card>
  );
};
