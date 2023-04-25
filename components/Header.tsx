import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import RPG from "../public/assets/RPG.png";
import ProStock from "../public/assets/ProStock.png";
import Link from "next/link";
import style from "../styles/home.module.css";
import { useRouter } from "next/router";
// icons
import { HiMenu, HiMenuAlt1, HiHome } from "react-icons/hi";

export default function Header({ data }: any) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
    console.log("click");
    try {
      const response = await fetch("/api/logout", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      console.log(json.message);
      if (response.status === 200) {
        console.log(json);
        const auth = localStorage.setItem("authenticated", "false");
        if (!Boolean(auth)) {
          setIsAuthenticated(false);
          router.push("/login");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const isAuth = localStorage.getItem("authenticated") === "true";
    setAuthenticated(isAuth);

    if (!isAuth || isAuth === undefined) {
      setAuthenticated(false);
    }
  }, [authenticated]);

  return (
    <>
      <div
        className={` bg-sky-300 font-extrabold text-lg w-full h-full border-slate-900 py-[1em] px-[75px] flex justify-between items-center z-50`}
      >
          <Link href="/" className="rounded-md">
          <Image
            priority
            src={ProStock}
            alt="RPG Icon"
            className="max-h-xs max-w-xs h-10 w-10"
          />
        </Link>
        <button onClick={toggleMenu}>
          {isOpen ? (
            <HiMenuAlt1 className="md:sr-only not-sr-only w-12" />
          ) : (
            <HiMenu className="md:sr-only not-sr-only w-12" />
          )}
        </button>

        <nav className="select-none flex justify-center items-center gap-10 md:not-sr-only sr-only ">
          {/* {navList.map((list, index) => {
            return (
              <h1
                onClick={(e) => {
                  navigatePage(list);
                }}
                key={index}
              >
                {list}
              </h1>
            );
          })} */}

          {/* <Link href={"/"}>Home</Link> */}
          <Link href={"/products"}>Product Catalog</Link>
          <Link href={"/about"}>About Us</Link>
          <button
            onClick={authenticated ? handleLogout : handleLogin}
            className="w-[130px] h-[50px] bg-transparent outline-none rounded-[6px] border-2 cursor-pointer border-[#EEA47FFF] transition-all hover:bg-[#EEA47FFF] text-[#EEA47FFF] hover:text-white"
          >
            {authenticated ? "Logout" : "Login"}
          </button>
        </nav>
      </div>
      {/* <div className="font-sans font-semibold shadow-md">
        <section className="flex justify-between items-center md:h-20 md:w-full p-4">
          <div className="">
            <Image
              priority
              src={RPG}
              alt="RPG Icon"
              className="max-h-xs max-w-xs"
            />
          </div>
          <Link href={"/"}>
            <HiHome className="h-8 w-8 " />
          </Link>
          <nav className="md:flex md:items-center md:justify-center md:gap-3">
            <Link
              href={"/products"}
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
              Product Catalog
            </Link>

            <Link
              href={"/login"}
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
              Login
            </Link>
          </nav>
        </section>
      </div> */}
    </>
  );
}
// linear-gradient(135deg, #FFE8F5, #234E70)
