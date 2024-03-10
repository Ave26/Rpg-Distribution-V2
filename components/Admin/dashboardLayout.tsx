import { useRouter } from "next/router";
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

  return (
    <div className="flex h-full flex-col items-start justify-center gap-2 break-words p-2 text-xs font-extrabold md:h-screen md:flex-row  md:overflow-y-hidden">
      <aside className="flex h-full w-full flex-row justify-start gap-2 overflow-x-scroll rounded-md border border-dotted border-black p-2  md:w-fit md:flex-col md:items-start md:justify-start md:gap-2 md:overflow-x-hidden md:p-10 md:text-sm">
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

      <main className="animation-emerge relative h-full w-full">
        {children}
      </main>
    </div>
  );
}
