import { NextRouter, useRouter } from "next/router";
import { useEffect } from "react";
import { UserRole } from "@prisma/client";

import { useMyContext } from "@/contexts/AuthenticationContext";
import Link from "next/link";
import { TEndPoints, TRole, TRoleToRoutes } from "@/types/roleTypes";
import { linkStyle } from "@/styles/style";
import { roleToRoutes } from "../RoleBaseRoutes";
import LogoutButton from "../Parts/LogoutButton";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { globalState } = useMyContext();
  const isAuthenticated = globalState?.authenticated as Boolean;
  const router = useRouter();
  const role: string | undefined = globalState?.verifiedToken?.roles;

  const mapRoutes = roleToRoutes[role as TRole]; // Role key to redirect on authorized page
  const currentPath = router.asPath;

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

  return (
    <div className="flex h-full flex-col items-start justify-center gap-2 break-words p-2 text-xs font-extrabold md:h-screen md:flex-row  md:overflow-y-hidden">
      {renderAside}
      <main className="animation-emerge relative h-full w-full">
        {children}
      </main>
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
    <aside className="flex h-full w-full flex-row justify-start gap-2 overflow-x-scroll rounded-md border border-dotted bg-white/90 p-2 shadow-md  md:w-fit md:flex-col md:items-start md:justify-start md:gap-2 md:overflow-x-hidden md:p-10 md:text-sm">
      {mapRoutes &&
        mapRoutes.length > 0 &&
        mapRoutes.map((route, index) => (
          <Link key={index} href={route.path}>
            <div
              className={`h-fit w-fit cursor-pointer select-none whitespace-nowrap text-center transition-all hover:border-cyan-400 ${
                router.asPath === route.path
                  ? linkStyle.select
                  : linkStyle.unSelect
              }`}
            >
              {route.label}
            </div>
          </Link>
        ))}
      <LogoutButton />
    </aside>
  );
}
