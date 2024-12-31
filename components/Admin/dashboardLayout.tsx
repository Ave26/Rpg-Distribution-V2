import { NextRouter, useRouter } from "next/router";
import { useEffect, useState } from "react";
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

const roboto = Roboto({
  subsets: ["latin"], // Choose subsets you need
  weight: ["400", "500", "700"], // Specify font weights
});

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { globalState } = useMyContext();
  // console.log(globalState);

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
      if (!isAuthorized) {
        router.push("/unauthorized");
      }
    }
  }, [currentPath, mapRoutes, router]);

  const mappedAside: Record<string, JSX.Element> = {
    true: <Aside mapRoutes={mapRoutes} router={router} />,
    false: <LoadingAside />,
  };

  const renderAside = mappedAside[String(isAuthenticated)];
  /* flex h-full w-full flex-none flex-row  justify-start  gap-2 overflow-x-scroll rounded-md border border-dotted bg-white/90 p-2 uppercase shadow-md  md:w-fit md:flex-col md:items-center md:justify-start md:gap-2 md:overflow-x-hidden  md:text-sm */
  return (
    <div
      className={`flex ${roboto.className} h-full flex-col items-start justify-center gap-2 overflow-y-hidden break-words p-2 text-xs font-extrabold sm:gap-10 md:h-screen lg:flex-row lg:p-10`}
    >
      <div className="flex h-full w-full items-center justify-center md:max-w-min">
        <div className="flex w-full justify-start gap-2 overflow-y-hidden overflow-x-scroll rounded-md bg-white p-2 text-[.9em] uppercase lg:max-w-min lg:flex-col lg:overflow-hidden ">
          <div className="gap-2text-[.8em] mb-4 hidden items-center justify-center gap-2 md:flex">
            <ProstockIcon />
          </div>
          {renderAside}
        </div>
      </div>
      {isLoading ? (
        <div className="flex h-[53.9em] w-full animate-pulse grid-cols-1 items-center justify-center gap-2 bg-slate-500 md:grid-cols-2">
          <AiOutlineLoading className="animate-spin" size={30} />
        </div>
      ) : (
        <main className="animation-emerge relative h-full w-full">
          {children}
          <div className="h-2 w-full  rounded-b-md bg-gradient-to-r from-[#A08130] via-[#EFBF04] to-[#A08130]"></div>
        </main>
      )}
    </div>
  );
}

export function LoadingAside() {
  return (
    <aside className="flex h-full w-full flex-row justify-center gap-2 overflow-x-scroll rounded-md border border-dotted bg-white/30 p-2 shadow-md  md:w-fit md:flex-col md:items-center md:justify-center md:gap-2 md:overflow-x-hidden md:p-10 md:text-sm">
      loading...
    </aside>
  );
}

export function Aside({
  mapRoutes,
  router,
}: {
  mapRoutes: TEndPoints[];
  router: NextRouter;
}) {
  return (
    <>
      {mapRoutes &&
        mapRoutes.length > 0 &&
        mapRoutes.map((route, index) => {
          return (
            <Link key={index} href={route.path} passHref>
              <div
                className={`h-fit w-full cursor-pointer select-none whitespace-nowrap border border-black text-center transition-all hover:border-cyan-400 ${
                  router.asPath === route.path
                    ? linkStyle.select
                    : linkStyle.unSelect
                }`}
              >
                {route.label}
              </div>
            </Link>
          );
        })}
      <LogoutButton />
    </>
  );
}

function ProstockIcon() {
  return (
    <>
      <div className="relative h-10 w-10">
        <Image src={ProStockV2} alt={"rpg"} fill />
      </div>
      <h1 className="flex h-fit w-fit items-center justify-center font-extrabold">
        RPG-rostock
      </h1>
    </>
  );
}
