import { NextRouter, useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
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

  {
    /* <div className="flex w-full items-center justify-start gap-0 overflow-y-hidden overflow-x-scroll rounded-md p-1 uppercase lg:flex-col lg:gap-5">
          {renderAside}
        </div> */
  }

  return (
    <div
      className={`${roboto.className} flex h-full w-full flex-col gap-2 p-2 py-10 lg:flex-row  lg:p-16`}
    >
      {/* Entire Aside */}
      {/* flex h-full w-fit flex-col gap-5 border border-red-800 bg-white  pt-2 md:max-w-min */}
      <div className="flex h-full flex-col gap-2 bg-white">
        {/* Icon */}
        <div className="hidden h-fit items-center justify-center p-2 lg:flex lg:pb-4">
          <ProstockIcon />
        </div>
        {/* Selections  relative grid h-full justify-around border border-green-600 lg:flex-col*/}
        <div className="grid h-full auto-rows-fr grid-cols-1">
          {renderAside}
        </div>
        <LogoutButton />
      </div>
      {/* Entire Main */}
      <div className="flex h-full w-full flex-col gap-1 rounded-md">
        {isLoading ? (
          <div className="scrollbar-hide flex h-full w-full animate-pulse grid-cols-1 items-center justify-center gap-2 bg-slate-500 md:grid-cols-2">
            <AiOutlineLoading className="animate-spin" size={30} />
          </div>
        ) : (
          <main className="relative h-[53.9em] w-full overflow-hidden rounded-md">
            {children}
          </main>
        )}
        <span
          className="block h-2 w-full rounded-b-md bg-gradient-to-r 
       from-[#D9C611] via-[#F0DC05] to-[#D9C611]
       
       "
        ></span>
      </div>
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

interface AsideProps {
  mapRoutes: TEndPoints[];
  router: NextRouter;
}

export function Aside({ mapRoutes, router }: AsideProps) {
  const iconsFieled: Record<string, string> = {};

  const [hidden, setHidden] = useState(false);

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
              className="flex w-full flex-col items-center justify-center hover:bg-gradient-to-r 
       hover:from-[#D9C611] hover:via-[#F0DC05] hover:to-[#D9C611]"
            >
              <Icon size={25} className="transition-all hover:opacity-0" />
              {/* <h1 className="opacity-0 hover:opacity-100">{label}</h1> */}
            </Link>
          );
        })}
    </>
  );
}

/*  <div
                /* flex h-full w-full items-center justify-center hover:bg-[#FCD92C] 
              
              flex w-36 items-center justify-center p-2 text-[10px] font-black hover:border-cyan-400
              */
// className={`flex h-full items-center justify-center border text-center hover:bg-[#86B6F6] ${
//   router.asPath === path ? linkStyle.select : linkStyle.unSelect
// }`}

//  className=" border hover:border-black"
//  >
//  {/* {label} */}
// </div>

function ProstockIcon() {
  return (
    <>
      <div className="relative w-[4em]">
        <Image src={ProStockV2} alt={"rpg"} />
      </div>
      {/* <h1 className="flex h-fit w-fit items-center justify-center text-[11px] font-extrabold">
        RPG-Prostock
      </h1> */}
    </>
  );
}
