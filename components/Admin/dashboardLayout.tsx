import { NextRouter, useRouter } from "next/router";
import { SetStateAction, useEffect, useReducer, useRef, useState } from "react";
import ProStockV2 from "@/public/assets/Finally.png";
import { useMyContext } from "@/contexts/AuthenticationContext";
import Link from "next/link";
import { TEndPoints, TRole, TRoleToRoutes } from "@/types/roleTypes";
import { linkStyle } from "@/styles/style";
import { roleToRoutes } from "../RoleBaseRoutes";
import LogoutButton from "../Parts/LogoutButton";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/image";

import { Roboto } from "next/font/google";
import { LogoutResponse } from "@/pages/api/user/logout";
import { IoIosArrowBack } from "react-icons/io";
import { RiHome2Line } from "react-icons/ri";
import {
  ButtonState,
  DeliveryState,
} from "@/pages/dashboard/inventory-management";

const roboto = Roboto({
  subsets: ["latin"], // Choose subsets you need
  weight: ["400", "500", "700"], // Specify font weights
});

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { globalState, states } = useMyContext();
  const DashBoard = states;

  const isAuthenticated = globalState?.authenticated as Boolean;

  const router = useRouter();
  const role: string | undefined = globalState?.verifiedToken?.role;
  const mapRoutes = roleToRoutes[role as TRole]; // Role key to redirect on authorized page
  const currentPath = router.asPath;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleRouteChange = (loading: boolean) => setIsLoading(loading);

    router.events.on("routeChangeStart", () => handleRouteChange(true));
    router.events.on("routeChangeComplete", () => handleRouteChange(false));
    router.events.on("routeChangeError", () => handleRouteChange(false));

    return () => {
      router.events.off("routeChangeStart", () => handleRouteChange(true));
      router.events.off("routeChangeComplete", () => handleRouteChange(false));
      router.events.off("routeChangeError", () => handleRouteChange(false));
    };
  }, [router]);

  useEffect(() => {
    if (mapRoutes) {
      const isAuthorized = mapRoutes.some(
        (route) => route.path === currentPath
      );
      // if (!isAuthorized) {
      //   router.push("/unauthorized");
      // }
    }
  }, [currentPath, mapRoutes, router]);

  const mappedAside: Record<string, JSX.Element> = {
    true: <Aside mapRoutes={mapRoutes} router={router} />,
    false: <AiOutlineLoading className="animate-spin" size={30} />,
  };

  const renderAside = mappedAside[String(isAuthenticated)];
  const [open, setOpen] = useState(false);
  const [selected, setIsSelected] = useState("");

  // useEffect checker
  useEffect(() => {
    console.log(isAuthenticated);
  }, [isAuthenticated]);
  useEffect(() => {
    console.log(role);
  }, [role]);

  useEffect(() => {
    console.log(mapRoutes);
  }, [mapRoutes]);

  // flex h-full gap-2 transition-all sm:rounded-md sm:p-16

  const ColorButtonSelected = "bg-blue-300";
  const ColorButtonDeselected = "bg-[#edf0f7]";

  return (
    <div className="flex h-full text-sm">
      {/* navebar */}
      <div
        className={`${
          DashBoard?.isActive ? "w-[15em]" : "w-0"
        }  flex h-full  flex-col border bg-white shadow-inner transition-all duration-300 ease-in-out`}
      >
        {Array.isArray(mapRoutes) &&
          mapRoutes.map(({ Icon, label, path, subMenu }, index) => {
            return (
              <div
                key={index}
                className={`w-full flex-col overflow-hidden transition-all duration-200 ease-in-out ${
                  selected === label && selected !== "Picking And Packing"
                    ? "max-h-96"
                    : "max-h-14"
                }`}
              >
                {/* Menu */}
                <nav>
                  <button
                    onClick={() => {
                      setIsSelected(label);
                      if (selected === label) setIsSelected("");
                      console.log(label);
                      if (path === router.asPath) return;
                      router.push(path);
                    }}
                    className={`flex h-14 w-full items-center justify-between p-1 ${
                      label === "Picking And Packing"
                        ? ColorButtonSelected
                        : ColorButtonDeselected
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2 pl-4 font-semibold">
                      <Icon className="text-sky-700" />
                      <h1 className="whitespace-nowrap">{label}</h1>
                    </div>

                    <IoIosArrowBack
                      className={`
                        ${selected === label ? "-rotate-90" : "rotate-0"} 
                        ${label === "Picking And Packing" && `hidden`} 
                      
                      
                      transition-all`}
                    />
                  </button>
                </nav>
                {/* Sub Menu */}

                {label === "Pallete Location" ? (
                  <nav>
                    {Array.isArray(subMenu) &&
                      subMenu.map((menu) => {
                        return (
                          <button
                            key={menu}
                            onClick={() => {
                              menu === "Bin"
                                ? states?.setBinType("Bin")
                                : states?.setBinType("Damage Bin");
                            }}
                            className={`flex h-9 w-full items-center justify-start  rounded-br-md border-b-2  px-2 pl-14 ${
                              states?.binType === menu
                                ? ColorButtonSelected
                                : ColorButtonDeselected
                            }`}
                          >
                            {menu}
                          </button>
                        );
                      })}
                  </nav>
                ) : label === "Manage Inventory" ? (
                  <nav>
                    {Array.isArray(subMenu) &&
                      subMenu.map((menu) => {
                        return (
                          <button
                            key={menu}
                            onClick={() => {
                              states?.setInventoryAction(menu as ButtonState);
                            }}
                            className={`flex h-9 w-full items-center justify-start  rounded-br-md border-b-2  px-2 pl-14 ${
                              states?.inventoryAction === menu
                                ? ColorButtonSelected
                                : ColorButtonDeselected
                            }`}
                          >
                            {menu}
                          </button>
                        );
                      })}
                  </nav>
                ) : label === "Manage Delivery" ? (
                  <nav>
                    {Array.isArray(subMenu) &&
                      subMenu.map((menu) => {
                        console.log(menu);
                        return (
                          <button
                            key={menu}
                            onClick={() => {
                              states?.setDeliveryAction(menu as DeliveryState);
                            }}
                            className={`flex h-9 w-full items-center justify-start  rounded-br-md border-b-2  px-2 pl-14 ${
                              states?.deliveryAction === menu
                                ? ColorButtonSelected
                                : ColorButtonDeselected
                            }`}
                          >
                            {menu}
                          </button>
                        );
                      })}
                  </nav>
                ) : (
                  <>Lorem ipsum dolor sit</>
                )}
              </div>
            );
          })}
      </div>

      <div className="flex h-full w-full flex-col gap-1">
        {isLoading ? (
          <div className="relative flex h-full w-full animate-pulse items-center justify-center bg-slate-400">
            <AiOutlineLoading className="animate-spin" size={30} />
          </div>
        ) : (
          <main className="flex h-full w-full flex-col">{children}</main>
        )}
      </div>
    </div>
  );
}

interface AsideProps {
  mapRoutes: TEndPoints[];
  router: NextRouter;
}

export function Aside({ mapRoutes, router }: AsideProps) {
  const iconsFieled: Record<string, string> = {};

  const [hidden, setHidden] = useState("hidden");
  return (
    <>
      {mapRoutes &&
        mapRoutes.length > 0 &&
        mapRoutes.map(({ label, path, Icon }, index) => {
          return (
            <Link
              key={index}
              href={path}
              passHref
              className={`${
                router.asPath === path &&
                "bg-gradient-to-r from-[#D9C611] via-[#F0DC05] to-[#D9C611]"
              } flex h-full w-full items-center justify-center hover:bg-gradient-to-r hover:from-[#D9C611] hover:via-[#F0DC05] hover:to-[#D9C611] lg:h-[12.5%]`}
            >
              <Icon size={25} />
              {/* <h1 className="opacity-0 hover:opacity-100">{label}</h1> */}
            </Link>
          );
        })}
    </>
  );
}

export function ProstockIcon() {
  return (
    <>
      <div className="relative w-[2em]">
        <Image src={ProStockV2} alt={"rpg"} priority />
      </div>
    </>
  );
}
