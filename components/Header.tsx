import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
// assets
import RPG from "../assets/RPG.png";

// const fetcher = (...args: [RequestInfo, RequestInit?]) =>
//   fetch(...args).then((res) => res.json());

export default function Header({ data }: any) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [navList, setNavlist] = useState<string[]>(["Home", "About", "Login"]);

  // useEffect(() => {
  //   console.log("rerender");
  //   const fetchAuth = async () => {
  //     const response = await fetch("/api/login", {
  //       method: "POST",
  //     });
  //     const json = await response.json();
  //     if (response.status === 200) {
  //       // setNavlist((prevNavlist) => {
  //       //   const newList = [...prevNavlist];
  //       //   const loginIndex = newList.indexOf("Login");
  //       //   if (loginIndex !== -1) {
  //       //     newList[loginIndex] = "Logout";
  //       //   }
  //       //   console.log(newList + json);
  //       //   return newList;
  //       // });
  //     }
  //   };
  //   fetchAuth();
  // }, []);

  const toggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpen((gate) => !gate);
  };

  const handleNav = (list: string) => {
    switch (list) {
      case "Home":
        router.push("/");
        break;
      case "About":
        router.push("/about");
        break;
      case "Login":
        router.push("/login");
        break;
      default:
        console.log(`Endpoint ${list.toLowerCase} is not allowed`);
    }
  };
  // const { data, error, isLoading } = useSWR("/api/login", fetcher);

  useEffect(() => {
    if (data) {
      setNavlist((prevNavlist) => {
        const newList = [...prevNavlist];
        const loginIndex = newList.indexOf("Login");
        if (loginIndex !== -1) {
          newList[loginIndex] = "Logout";
        }
        return newList;
      });
    }
  }, [data]);

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/">
          <Image
            src={RPG}
            priority
            alt="RPG LOGO"
            className="max-w-[10em] max-h-[7em] self-end w-full h-full md:p-2 p-4"
          />
        </Link>
        <button
          onClick={toggleMenu}
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div
          className={`${
            open ? "block" : "hidden"
          } w-full md:block md:w-auto select-none`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {navList.map((list, index) => {
              return (
                <ul
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    console.log(list);
                    handleNav(list);
                  }}
                  className="hover:bg-blue-500 block py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  {list}
                </ul>
              );
            })}
            {/* <ThemeToggle toggleTheme={toggleTheme} /> */}
          </ul>
        </div>
      </div>
    </nav>
  );
}
