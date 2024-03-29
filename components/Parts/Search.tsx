import React, { useState } from "react";
import { InputProps, TFormData } from "@/types/inputTypes";

interface SearchProps {
  personaleEffects?: PersonalEffectProps;
  formData: TFormData;
  setFormData: React.Dispatch<React.SetStateAction<TFormData>>;
  handleSearch: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface PersonalEffectProps {
  placeholder?: string;
  maxLength?: number;
}

function Search({
  personaleEffects,
  formData,
  handleChange,
  handleSearch,
  setFormData,
}: SearchProps) {
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("search triggered");
          setFormData({ ...formData, quantity: 0 });
          handleSearch();
        }}
        className="font-semibold">
        <label
          htmlFor="default-search"
          className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Search
        </label>
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-4 w-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            name="barcodeId"
            value={formData.barcodeId || formData.productName}
            {...personaleEffects}
            onChange={handleChange}
            className="block w-full min-w-[20em] rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="absolute bottom-2.5 right-2.5 top-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 hover:bg-blue-800 dark:bg-blue-600 dark:focus:ring-blue-800 dark:hover:bg-blue-700">
            Search
          </button>
        </div>
      </form>
    </div>
  );
}

export default Search;
