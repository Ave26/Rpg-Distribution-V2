import React, { useEffect, useState } from "react";
import Image from "next/image";
import ProStockV2 from "../public/assets/Finally.png";
import Link from "next/link";
import { useRouter } from "next/router";

import { HiMenu, HiMenuAlt1, HiHome } from "react-icons/hi";
import { useMyContext } from "@/contexts/AuthenticationContext";
import { TRole, TRoleToRoutes } from "@/types/roleTypes";
import { AiOutlineLoading } from "react-icons/ai";

export default function Header() {
  const router = useRouter();
  const { globalState, updateGlobalState } = useMyContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [buttonName, setButtonName] = useState<string>("Login");

  const role: string | undefined = globalState?.verifiedToken?.role;

  const roleToRoutes: TRoleToRoutes = {
    SUPERADMIN: [
      {
        path: "/dashboard/log-overview",
        label: "Log Overview",
        Icon: AiOutlineLoading,
      },
    ],
    ADMIN: [
      {
        path: "/dashboard/log-overview",
        label: "Log Overview",
        Icon: AiOutlineLoading,
      },
    ],
    STAFF: [
      {
        path: "/dashboard/barcode-scanner",
        label: "Scan Barcode",
        Icon: AiOutlineLoading,
      },
    ],
    DRIVER: [
      {
        path: "/dashboard/delivery-management",
        label: "Manage Delivery",
        Icon: AiOutlineLoading,
      },
    ],
  };
  const mapRoutes = roleToRoutes[role as TRole];

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  useEffect(() => {
    Boolean(globalState?.authenticated) &&
      console.log(
        `is authenticated then change color ${Boolean(
          globalState?.authenticated
        )}`
      );
  }, [globalState?.authenticated]);

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center  
      justify-center ${
        globalState?.authenticated ? "bg-[#86B6F6]" : "bg-cyan-300"
      }  font-bold transition-all md:px-20 lg:flex-row`}
    >
      <div className="relative flex h-24 w-full items-center justify-between px-5 font-bold lg:justify-start  lg:px-14  ">
        <div
          className={`flex h-fit  w-fit select-none flex-row items-end justify-center gap-2  p-2`}
        >
          {mapRoutes?.map((route, index) => (
            <Link key={index} href={route.path} passHref>
              <Image
                priority
                src={ProStockV2}
                alt="RPG LOGO"
                className="h-20 w-20 object-cover transition-all"
              />
            </Link>
          ))}
          <div className="flex flex-col items-start justify-center">
            <h1 className="text-center">{globalState?.verifiedToken?.role}</h1>
            <p className="text-center text-sm">
              {globalState?.verifiedToken?.id}
            </p>
          </div>
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
        className={`flex h-full w-full select-none flex-col items-center justify-center gap-5 p-4 lg:not-sr-only lg:w-fit lg:flex-row lg:justify-end lg:p-4 ${
          isOpen
            ? "not-sr-only animate-emerge transition-all"
            : "sr-only transition-all"
        }`}
      >
        <Link
          href={"/products"}
          className={` whitespace-nowrap transition-all hover:text-sky-500 active:text-black`}
        >
          Product Catalog
        </Link>
        <Link
          href={"/about"}
          className={` whitespace-nowrap transition-all hover:text-sky-500 active:text-black`}
        >
          About Us
        </Link>
      </nav>
    </div>
  );
}
