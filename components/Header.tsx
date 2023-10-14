import React, { useEffect, useState } from "react";
import Image from "next/image";
import ProStockV2 from "../public/assets/ProStockV2.png";
import Link from "next/link";
import { useRouter } from "next/router";

import { HiMenu, HiMenuAlt1, HiHome } from "react-icons/hi";
import { useMyContext } from "@/contexts/AuthenticationContext";
import { TRole, TRoleToRoutes } from "@/types/roleTypes";

export default function Header() {
  const router = useRouter();
  const { globalState, updateGlobalState } = useMyContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [buttonName, setButtonName] = useState<string>("Login");

  const role: string | undefined = globalState?.verifiedToken?.roles;

  const roleToRoutes: TRoleToRoutes = {
    // object mapper
    Admin: [{ path: "/dashboard/log-overview", label: "Log Overview" }],
    staff: [{ path: "/dashboard/barcode-scanner", label: "Scan Barcode" }],
    Driver: [
      { path: "/dashboard/delivery-management", label: "Manage Delivery" },
    ],
  };
  const mapRoutes = roleToRoutes[role as TRole];

  const gotoLogin = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
    console.log("click");
    try {
      const response = await fetch("/api/user/logout", {
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

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center  font-bold dark:bg-white md:px-20 lg:flex-row`}>
      <div className="relative flex h-24 w-full items-center justify-between px-5 font-bold lg:justify-start  lg:px-14">
        <div className={`h-fit w-fit  select-none`}>
          {mapRoutes?.map((route, index) => (
            <Link key={index} href={route.path}>
              <Image
                priority
                src={ProStockV2}
                alt="RPG LOGO"
                className="h-16 w-16 transition-all"
              />
            </Link>
          ))}
        </div>
        <div className="h-fit ">
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
        className={`lg:w-fiy flex h-full w-full select-none flex-col items-center justify-center gap-5 p-4 lg:not-sr-only lg:flex-row lg:justify-end lg:p-4 ${
          isOpen
            ? "not-sr-only animate-emerge transition-all"
            : "sr-only transition-all"
        }`}>
        <Link
          href={"/products"}
          className={` whitespace-nowrap transition-all hover:text-sky-500 active:text-black`}>
          Product Catalog
        </Link>
        <Link
          href={"/about"}
          className={` whitespace-nowrap transition-all hover:text-sky-500 active:text-black`}>
          About Us
        </Link>
      </nav>
    </div>
  );
}
