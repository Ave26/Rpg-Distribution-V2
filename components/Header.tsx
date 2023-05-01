import React, { useEffect, useState } from "react";
import Image from "next/image";
import RPG from "../public/assets/Prostocklogo.png";
import Link from "next/link";
import { useRouter } from "next/router";
// icons
import { HiMenu, HiMenuAlt1, HiHome } from "react-icons/hi";
// import { Libre_Barcode_128_Text } from "next/font/google";

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
    <div className="font-bold flex justify-between items-center h-24 w-full px-4 bg-sky-900">
      <Link href={"/"}>
        <Image
          src={RPG}
          alt="RPG LOGO"
          className="w-10 h-10 m-4 transition-all"
        />
      </Link>
      <button onClick={toggleMenu}>
        {isOpen ? (
          <HiMenuAlt1 className="md:sr-only not-sr-only w-12" />
        ) : (
          <HiMenu className="md:sr-only not-sr-only w-12" />
        )}
      </button>
      <nav className="select-none flex justify-center items-center gap-10 md:not-sr-only sr-only">
        <Link href={"/products"} className="hover:text-sky-50">
          Product Catalog
        </Link>
        <Link href={"/about"} className="hover:text-sky-50">
          About Us
        </Link>
        <button
          onClick={authenticated ? handleLogout : handleLogin}
          className="w-[130px] h-[50px] bg-transparent outline-none rounded-[6px] border-2 cursor-pointer border-[#EEA47FFF] transition-all hover:bg-[#EEA47FFF] text-[#EEA47FFF] hover:text-white"
        >
          {authenticated ? "Logout" : "Login"}
        </button>
      </nav>
    </div>
  );
}
