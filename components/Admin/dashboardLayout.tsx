import ReusableLink from "../Parts/ReusableLink";
import ReusableDropDownMenu from "../Parts/ReusableDropDownMenu";
import ReusableButton from "../Parts/ReusableButton";
import { useRouter } from "next/router";
import { useEffect } from "react";

import AccountManagement from "@/public/assets/dashBoardIcons/AccountManagement.png";
import useSWR from "swr";
import { AuthProps } from "@/types/authTypes";
import { useMyContext } from "../contexts/AuthenticationContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { globalState } = useMyContext();

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
          // setIsAuthenticated(false);
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(globalState?.verifiedToken?.roles);
  return (
    <div className="flex h-full w-full flex-wrap items-center bg-gradient-to-b from-cyan-300 to-blue-500 md:mx-10 md:flex-nowrap lg:mx-20">
      <aside className="relative flex h-full w-full flex-row items-center gap-2 overflow-hidden overflow-x-auto break-words p-2 text-xs md:h-screen md:w-fit md:flex-col md:items-center md:gap-3 md:overflow-y-auto md:overflow-x-hidden md:p-10 md:dark:bg-white">
        <ReusableDropDownMenu
          initialName={"Manage Products"}
          numberOfChildren={2}
          childNamePrefix={[
            {
              endPoint: "add-new-product",
              name: "Add Product",
            },
            {
              endPoint: "barcode-scanner",
              name: "Scan Barcode",
            },
          ]}
        />

        <ReusableLink
          visibility="not-sr-only md:sr-only"
          endPoint={"barcode-scanner"}
          linkName={"Scan Barcode"}
        />
        <ReusableLink
          visibility="not-sr-only md:sr-only"
          endPoint={"add-new-product"}
          linkName={"Add New Product"}
        />
        <ReusableLink
          visibility=""
          endPoint={"picking-and-packing"}
          linkName={"Picking And Packing"}
        />
        <ReusableLink
          visibility=""
          endPoint={"pallete-location"}
          linkName={"Pallete Location"}
        />
        {globalState?.verifiedToken?.roles === "Admin" && (
          <ReusableLink
            endPoint={"acc-management"}
            linkName={"Account Management"}
          />
        )}
        <ReusableLink
          endPoint={"delivery-management"}
          linkName={"Delivery Management"}
        />

        <ReusableButton
          name={"Logout"}
          type={"button"}
          onClick={handleLogout}
          className={
            "w-full rounded-2xl border border-slate-50/30 bg-transparent p-1 text-center text-xs  font-bold shadow-md transition-all"
          }
        />
      </aside>

      <main className="relativeh-full w-full">{children}</main>
    </div>
  );
}
