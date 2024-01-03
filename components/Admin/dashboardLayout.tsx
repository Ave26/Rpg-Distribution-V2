import ReusableLink from "../Parts/ReusableLink";
import ReusableDropDownMenu from "../Parts/ReusableDropDownMenu";
import ReusableButton from "../Parts/ReusableButton";
import { useRouter } from "next/router";
import { useEffect } from "react";

import AccountManagement from "@/public/assets/dashBoardIcons/AccountManagement.png";
import useSWR from "swr";
import { AuthProps } from "@/types/authTypes";
import { useMyContext } from "@/contexts/AuthenticationContext";
import Link from "next/link";
import { TRole, TRoleToRoutes } from "@/types/roleTypes";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { globalState } = useMyContext();
  const router = useRouter();
  const role: string | undefined = globalState?.verifiedToken?.roles;

  const baseRoutes = [
    { path: "/dashboard/log-overview", label: "Log Overview" },
    { path: "/dashboard/add-new-product", label: "Add Product" },
    { path: "/dashboard/barcode-scanner", label: "Scan Barcode" },
    { path: "/dashboard/pallete-location", label: "Pallete Location" },
    { path: "/dashboard/picking-and-packing", label: "Picking And Packing" },
    { path: "/dashboard/delivery-management", label: "Manage Delivery" },
    { path: "/dashboard/inventory-management", label: "Manage Inventory" },
    { path: "/dashboard/acc-management", label: "Manage Account" },
  ];

  const roleToRoutes: TRoleToRoutes = {
    SuperAdmin: baseRoutes,
    Admin: baseRoutes,
    Staff: [
      { path: "/dashboard/barcode-scanner", label: "Scan Barcode" },
      { path: "/dashboard/add-new-product", label: "Add Product" },
      { path: "/dashboard/picking-and-packing", label: "Picking And Packing" },
    ],
    Driver: [
      { path: "/dashboard/delivery-management", label: "Manage Delivery" },
    ],
  };

  const mapRoutes = roleToRoutes[role as TRole];
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

  const linkStyle = {
    select:
      "rounded-md border  border-transparent bg-[#86B6F6] p-2 font-bold hover:border-cyan-400",
    unSelect:
      "rounded-md border  border-transparent bg-transparent p-2  font-bold",
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/user/logout", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      if (response.status === 200) {
        const auth = localStorage.setItem("authenticated", "false");
        if (!Boolean(auth)) {
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      console.log(globalState?.verifiedToken?.roles);
    }
  };

  return (
    <div className="flex h-full flex-col items-start justify-center gap-2 break-words p-2 md:h-screen md:flex-row  md:overflow-y-hidden">
      <aside className="flex h-full w-full flex-row justify-start gap-2 overflow-x-scroll rounded-md border border-dotted border-black md:w-fit md:flex-col md:items-start md:justify-start md:gap-2 md:overflow-x-hidden md:p-10 md:text-sm">
        {mapRoutes?.map((route, index) => {
          return (
            <Link
              key={index}
              href={route.path}
              className={`h-fit w-fit cursor-pointer select-none whitespace-nowrap text-center transition-all hover:border-cyan-400 ${
                router.asPath === route.path
                  ? linkStyle.select
                  : linkStyle.unSelect
              }`}>
              {route.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={handleLogout}
          className={
            "cursor-pointer select-none rounded-md border border-transparent bg-transparent  p-2 font-bold hover:border-cyan-400 "
          }>
          Logout
        </button>
      </aside>

      <main className="animation-emerge relative h-full w-full">
        {children}
      </main>
    </div>
  );
}
