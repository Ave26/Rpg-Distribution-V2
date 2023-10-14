import { useMyContext } from "@/contexts/AuthenticationContext";
import { TRole, TRoleToRoutes } from "@/types/roleTypes";
import { useRouter } from "next/router";
import Link from "next/link";

function Custom404() {
  const router = useRouter();

  const { globalState } = useMyContext();
  const role: string | undefined = globalState?.verifiedToken?.roles;

  const roleToRoutes: TRoleToRoutes = {
    Admin: [{ path: "/dashboard/log-overview", label: "Log Overview" }],
    staff: [{ path: "/dashboard/barcode-scanner", label: "Scan Barcode" }],
    Driver: [
      { path: "/dashboard/delivery-management", label: "Manage Delivery" },
    ],
  };
  const mapRoutes = roleToRoutes[role as TRole];

  return (
    <div className="flex h-screen w-screen  flex-col items-center justify-center gap-4 text-center  text-7xl font-extrabold">
      <h1>Error 404 - Page Not Found</h1>
      <button
        onClick={() => router.back()}
        className="text-sky-900 underline transition-all hover:text-sky-900/30">
        Go Back
      </button>
    </div>
  );
}

export default Custom404;
