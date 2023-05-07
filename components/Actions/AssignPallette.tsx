import React, { useEffect, useState } from "react";
import Loading from "../Parts/Loading";
import { CgSearch } from "react-icons/cg";

interface PalletteProps {
  setIsLocationOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface DATA {
  productName: string;
  expirationDate: string;
  quantity: number;
  id: string;
}

export default function AssignPallette({ setIsLocationOpen }: PalletteProps) {
  const [data, setData] = useState<DATA[]>([]);
  const [search, setSearch] = useState<string>("");
  const [searchbasis, setSearchBasis] = useState<string>("");
  const [options, setOptions] = useState<string[]>([
    "Barcode Id",
    "Product Name",
    "Sku",
    "PO ID",
  ]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/public-products")
      .then(async (response) => {
        if (response.status === 200) {
          const json = await response.json();
          setData(json);
        }
      })
      .catch((error) => {
        console.log(error);
        // setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleClick = () => {
    setIsLocationOpen(false);
  };

  const handleChildClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    // console.log("Child Clicked!");
  };

  return (
    <div
      className="bg-opacity-50 bg-sky-300 absolute inset-0 md:px-11 py-10 w-full h-full shadow-2xl"
      onClick={handleClick}
    >
      <div
        className="w-full h-[35rem] border bg-sky-500 rounded-lg"
        onClick={handleChildClick}
      >
        {/* <form>
          <div className="flex">
            <label
              htmlFor="search-dropdown"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Your Email
            </label>
            <button
              id="dropdown-button"
              data-dropdown-toggle="dropdown"
              className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
              type="button"
            >
              All categories
              <svg
                aria-hidden="true"
                className="w-4 h-4 ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
            <div
              id="dropdown"
              className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdown-button"
              >
                <li>
                  <button
                    type="button"
                    className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Mockups
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Templates
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Design
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Logos
                  </button>
                </li>
              </ul>
            </div>
            <div className="relative w-full">
              <input
                type="search"
                id="search-dropdown"
                className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                placeholder="Search Mockups, Logos, Design Templates..."
                required
              />
              <button
                type="submit"
                className="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
                <span className="sr-only">Search</span>
              </button>
            </div>
          </div>
        </form> */}

        <div className="flex justify-center items-center border">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2"
          />
          <button className="">
            <CgSearch className="border w-full h-full" />
          </button>

          <select name="" id="">
            {/* <option value="">Barcode Id</option>
            <option value="">Product Name</option>
            <option value="">Sku</option>
            <option value="">PO ID</option> */}
            <option>Filter</option>
            {options.map((option, index) => {
              return (
                <option
                  key={index}
                  onClick={(e) => {
                    console.log(option);
                  }}
                >
                  {option}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </div>
  );
}

// <div className="flex md:justify-start justify-center items-center border p-2 gap-2">
// <div className="flex justify-center items-center border">
//   <input
//     type="search"
//     value={search}
//     onChange={(e) => setSearch(e.target.value)}
//     className="p-2"
//   />
//   <button className="">
//     <CgSearch className="border w-full h-full" />
//   </button>
// </div>
// <select
//   className="p-2 outline-none focus:ring-2 border-none"
//   name="productName"
//   id="productName"
// >
//   {/* {data.map((product) => {
//     return (
//       <>
//         {isLoading ? (
//           "Loading..."
//         ) : (
//           <option className="" key={product?.id}>
//             {product?.productName}
//           </option>
//         )}
//       </>
//     );
//   })} */}

//   <option>Barcode Id</option>
//   <option>Profuct Name</option>
//   <option>SKU</option>
// </select>
// </div>
