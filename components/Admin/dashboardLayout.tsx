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
    false: <AiOutlineLoading className="animate-spin" size={30} />,
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
      <div className="flex h-fit items-center justify-start gap-3 bg-white p-2 lg:h-full lg:flex-col lg:gap-0 lg:p-0 ">
        {/* Icon */}
        <div className="hidden h-fit items-center justify-center p-2 lg:flex lg:pb-4">
          <ProstockIcon />
        </div>
        {/* Selections flex h-full w-full items-center justify-between lg:flex-col*/}

        <div
          className={`flex h-full w-full items-center justify-start  lg:flex-col`}
        >
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
              className="flex h-[12.5%] w-full items-center justify-center hover:bg-gradient-to-r hover:from-[#D9C611] hover:via-[#F0DC05] hover:to-[#D9C611]"
            >
              <Icon size={25} />
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
