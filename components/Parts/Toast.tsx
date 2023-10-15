import React, { ReactNode, SetStateAction, useEffect, useState } from "react";

interface DataForToast {
  isShow?: boolean;
  style?: string;
  data?: ReactNode | undefined;
}

export default function Toast({ data, isShow }: DataForToast) {
  return (
    <div
      className={`space-x fixed bottom-5 left-5 z-50 flex w-fit max-w-xs font-bold text-white ${
        isShow ? "animate-emerge" : "animate-fade"
      }  items-center space-x-4 divide-x divide-gray-200 rounded-lg bg-white p-4 text-gray-500 shadow transition-all dark:divide-gray-700 dark:bg-gray-800`}>
      <p>{data}</p>
    </div>
  );
}
