import React, { ReactNode, SetStateAction, useEffect, useState } from "react";

interface DataForToast {
  data?: ReactNode | any;
}

export default function Toast({ data }: DataForToast) {
  return (
    <div className="fixed flex items-center w-fit max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow bottom-5 left-5 dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800">
      <p>{data}</p>
    </div>
  );
}
