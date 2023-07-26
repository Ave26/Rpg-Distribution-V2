import ReusableLink from "../Parts/ReusableLink";
import ReusableDropDownMenu from "../Parts/ReusableDropDownMenu";
import ReusableButton from "../Parts/ReusableButton";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
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

  // check if the user has login and authenticated
  const verifyUser = async (abortController: AbortController) => {
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortController.signal,
      });

      const json = await response.json();
      console.log(json);

      if (response.status === 401) {
        return router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("checking user data...");
    const abortController = new AbortController();
    verifyUser(abortController);
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div className="justify-cente flex h-full w-full flex-wrap items-center md:flex-nowrap md:items-center md:justify-center">
      <aside className="relative flex h-full w-full flex-row items-center gap-2 overflow-hidden overflow-x-auto border p-2 text-xs md:h-screen md:w-fit md:flex-col md:items-center md:gap-3 md:overflow-y-auto md:overflow-x-hidden md:p-7 md:dark:bg-slate-200">
        <ReusableDropDownMenu
          initialName={"Manage Products"}
          numberOfChildren={2}
          childNamePrefix={[
            {
              endPoint: "barcode-scanner",
              name: "Scan Barcode",
            },
            {
              endPoint: "add-new-product",
              name: "Add New Product",
            },
          ]}
        />
        <ReusableLink
          endPoint={"acc-management"}
          linkName={"Account Management"}
        />

        <ReusableLink
          visibility="not-sr-only md:sr-only"
          endPoint={"barcode-scanner"}
          linkName={"Scan Barcode"}
        />

        <ReusableButton
          name={"Logout"}
          type={"button"}
          onClick={handleLogout}
          style={
            "border border-black p-1 rounded-2xl text-xs font-bold text-center w-full bg-transparent transition-all hover:bg-sky-400/40"
          }
        />

        <ReusableLink
          visibility="not-sr-only md:sr-only"
          endPoint={"add-new-product"}
          linkName={"Add New Product"}
        />
        <ReusableLink
          visibility="not-sr-only md:sr-only"
          endPoint={"add-new-product"}
          linkName={"Add New Product"}
        />
        <ReusableLink
          visibility="not-sr-only md:sr-only"
          endPoint={"add-new-product"}
          linkName={"Add New Product"}
        />
      </aside>

      <main className="flex h-full w-full items-center justify-center">
        {children}
      </main>
    </div>
  );
}
