import React, { useEffect, useState } from "react";
import Image from "next/image";
import RPG from "../public/assets/Prostocklogo.png";
import Link from "next/link";
import { useRouter } from "next/router";
// icons
import { HiMenu, HiMenuAlt1, HiHome } from "react-icons/hi";
// import { Libre_Barcode_128_Text } from "next/font/google";

export default function Header({
  data,
  headerBg = "bg-[#0b8acb] transition-all",
  headerSky = "bg-transparent",
  headerTxt,
}: any) {
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
    <div
      className={`${headerBg} flex flex-col items-center justify-center font-bold lg:flex-row ${
        isOpen ? "" : ""
      }`}>
      <div className="relative flex h-24 w-full items-center justify-between px-4 font-bold">
        <div className={`h-fit w-fit ${headerSky}`}>
          <Link href={"/"}>
            <Image
              src={RPG}
              alt="RPG LOGO"
              className="h-10 w-10 transition-all"
            />
          </Link>
        </div>
        <div className="h-fit">
          <button onClick={toggleMenu}>
            {isOpen ? (
              <HiMenuAlt1 className="not-sr-only w-12 lg:sr-only" />
            ) : (
              <HiMenu className="not-sr-only w-12 lg:sr-only" />
            )}
          </button>
        </div>
      </div>

      <nav
        className={`flex flex-col items-center justify-center gap-5 p-4 lg:not-sr-only lg:h-full lg:w-full lg:flex-row lg:gap-10 lg:p-5 ${
          isOpen
            ? "not-sr-only animate-emerge transition-all"
            : "sr-only transition-all"
        }`}>
        <Link href={"/products"} className={`${headerTxt}`}>
          Product Catalog
        </Link>
        <Link href={"/about"} className={`${headerTxt}`}>
          About Us
        </Link>
        <button
          onClick={authenticated ? handleLogout : handleLogin}
          className="h-[50px] w-[130px] cursor-pointer rounded-[6px] border-2 border-[#EEA47FFF] bg-transparent text-[#EEA47FFF] outline-none transition-all hover:bg-[#EEA47FFF] hover:text-white">
          {authenticated ? "Logout" : "Login"}
        </button>
      </nav>
    </div>
  );
}
