import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMyContext } from "@/contexts/AuthenticationContext";
import Link from "next/link";
import { TRole } from "@/types/roleTypes";
import { roleToRoutes } from "../RoleBaseRoutes";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/image";

import { Roboto } from "next/font/google";
import { IoIosArrowBack } from "react-icons/io";
import {
  BsLayoutSidebarInset,
  BsLayoutSidebarInsetReverse,
} from "react-icons/bs";

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

  const router = useRouter();
  const role: string | undefined = globalState?.verifiedToken?.role;

  const mapRoutes = roleToRoutes[role as TRole]; // Role key to redirect on authorized page
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

  return (
    <div className="flex h-full gap-1 p-1 transition-all">
      <div
        className={` 
        ${DashBoard?.isActive ? "pb-[3.5px]" : ""} flex h-full
        w-fit items-center justify-start rounded-lg bg-gradient-to-b from-yellow-400 via-orange-400 to-orange-600 pl-[3.5px] transition-all`}
      >
        <div
          className={`
          ${DashBoard?.isActive ? "w-[14em]" : "w-fit"}
          flex h-full flex-col items-start justify-start gap-1 rounded-lg bg-white p-1 transition-all`}
        >
          {Array.isArray(mapRoutes) &&
            mapRoutes.map(({ Icon, label, path, subMenu, basePath }, index) => {
              if (!basePath) {
                basePath = "";
              }
              console.log(label);

              return (
                <nav
                  key={index}
                  className={`
                  ${DashBoard?.isActive ? "w-full" : "w-[3em]"}
                  flex h-fit flex-col rounded-lg
                  border transition-all`}
                >
                  <Link
                    href={basePath}
                    passHref
                    onClick={(e) => {
                      if (
                        label === "MANAGE PRODUCT" ||
                        label === "MANAGE RACK" ||
                        label === "MANAGE INVENTORY"
                      ) {
                        e.preventDefault();
                      } else if (router.asPath === basePath) {
                        e.preventDefault();
                      }

                      states?.setMenuAction({
                        label: states.menuAction.label === label ? "" : label,
                      });
                    }}
                    className={`
                      ${
                        states?.menuAction.label === label ||
                        basePath === router.asPath
                          ? "rounded-b-none bg-[#FEECCF]"
                          : "bg-white"
                      }
                      flex
                      h-fit w-full
                      items-center
                      justify-start overflow-hidden
                      rounded-lg
                      transition-all`}
                  >
                    <Icon className="h-full w-[3em] flex-shrink-0 scale-[50%] font-bold" />

                    <h1 className="flex h-full w-[60%] items-center justify-start whitespace-nowrap rounded-lg p-1 text-xs font-bold uppercase">
                      {label}
                    </h1>

                    <IoIosArrowBack
                      className={`
                        ${
                          states?.menuAction.label === label
                            ? "-rotate-90"
                            : "rotate-0"
                        } 
                        ${
                          label === "PICKING AND PACKING" && `hidden`
                        } h-full w-[3em] scale-[50%] font-bold transition-all`}
                    />
                  </Link>

                  {Array.isArray(subMenu) &&
                    subMenu.map((menu, index) => {
                      console.log(!!subMenu[subMenu.length - 1]);
                      return (
                        <Link
                          passHref
                          key={index}
                          href={`${basePath}/${menu.path}`}
                          onClick={(e) => {
                            if (router.asPath === `${basePath}/${menu.path}`) {
                              e.preventDefault();
                              e.stopPropagation();
                            }
                          }}
                          className={`
                              ${
                                states?.menuAction.label === label ||
                                `${basePath}/${menu.path}` === router.asPath
                                  ? "h-10"
                                  : "h-0"
                              }

                              ${
                                `${basePath}/${menu.path}` === router.asPath
                                  ? "bg-slate-500 text-white"
                                  : "bg-[#ffe2b3a7]"
                              }
                              ${
                                index === subMenu.length - 1
                                  ? "rounded-b-lg"
                                  : ""
                              }
                              flex
                              gap-1
                              overflow-hidden
                              transition-all
                              `}
                        >
                          <div
                            className={`${
                              DashBoard?.isActive && "hidden"
                            } flex h-[3em] w-[3em] flex-shrink-0 items-center justify-center rounded-lg`}
                          >
                            <menu.Icon className="h-5 w-5" />
                          </div>
                          <h1
                            className={`${
                              DashBoard?.isActive && "justify-end"
                            } flex h-full w-full items-center  whitespace-nowrap rounded-lg p-2 text-xs font-bold uppercase`}
                          >
                            {menu.label}
                          </h1>
                        </Link>
                      );
                    })}
                </nav>
              );
            })}
          {/* flex h-10 w-[13.] items-center justify-center rounded-lg border bg-[#FEECCF] */}
          <div
            className={`flex h-full w-full items-end justify-end rounded-lg transition-all`}
          >
            {states?.isActive ? (
              <BsLayoutSidebarInset
                className="h-fit w-[3em] flex-shrink-0 scale-[50%] font-bold"
                onClick={() => {
                  states?.setIsActive(false);
                }}
              />
            ) : (
              <BsLayoutSidebarInsetReverse
                className="h-fit w-[3em] flex-shrink-0 scale-[50%] font-bold"
                onClick={() => {
                  states?.setIsActive(true);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* body */}
      <div className="flex h-full w-full flex-col gap-1">
        {isLoading ? (
          <div className="relative flex h-full w-full animate-pulse items-center justify-center rounded-lg bg-slate-400">
            <AiOutlineLoading className="animate-spin" size={30} />
          </div>
        ) : (
          <main className="flex h-full w-full flex-col  text-fluid-xs">
            {children}
          </main>
        )}
      </div>
    </div>
  );
}

// interface AsideProps {
//   mapRoutes: TEndPoints[];
//   router: NextRouter;
// }

// function Aside({ mapRoutes, router }: AsideProps) {
//   const iconsFieled: Record<string, string> = {};

//   const [hidden, setHidden] = useState("hidden");
//   return (
//     <>
//       {mapRoutes &&
//         mapRoutes.length > 0 &&
//         mapRoutes.map(({ label, path, Icon }, index) => {
//           return (
//             <Link
//               key={index}
//               href={path}
//               passHref
//               className={`${
//                 router.asPath === path &&
//                 "bg-gradient-to-r from-[#D9C611] via-[#F0DC05] to-[#D9C611]"
//               } flex h-full w-full items-center justify-center hover:bg-gradient-to-r hover:from-[#D9C611] hover:via-[#F0DC05] hover:to-[#D9C611] lg:h-[12.5%]`}
//             >
//               <Icon size={25} />
//               {/* <h1 className="opacity-0 hover:opacity-100">{label}</h1> */}
//             </Link>
//           );
//         })}
//     </>
//   );
// }

// useEffect(() => {
//   if (mapRoutes) {
//     const isAuthorized = mapRoutes.some(
//       (route) => route.path === currentPath
//     );
//     // if (!isAuthorized) {
//     //   router.push("/unauthorized");
//     // }
//   }
// }, [currentPath, mapRoutes, router]);

// const mappedAside: Record<string, JSX.Element> = {
//   true: <Aside mapRoutes={mapRoutes} router={router} />,
//   false: <AiOutlineLoading className="animate-spin" size={30} />,
// };

// const [selectedLabels, setSelectedLabels] = useState<
//   Record<string, string | undefined>
// >({});

// const [slideDown, setSlideDown] = useState<string>("");

// useEffect(() => {
//   console.log(states?.menuAction.label);
// }, [states?.menuAction.label]);
