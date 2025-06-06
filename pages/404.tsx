import { useMyContext } from "@/contexts/AuthenticationContext";
import { TRole, TRoleToRoutes } from "@/types/roleTypes";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/layout";
import { AiOutlineLoading } from "react-icons/ai";

function Custom404() {
  const { globalState } = useMyContext();
  const role = globalState?.verifiedToken?.role;

  const baseRoutes = [
    {
      path: "/dashboard/log-overview",
      label: "Log Overview",
      Icon: AiOutlineLoading,
    },
  ];

  const roleToRoutes: TRoleToRoutes = {
    SUPERADMIN: baseRoutes,
    ADMIN: baseRoutes,
    STAFF: [
      {
        path: "/dashboard/barcode-scanner",
        label: "Scan Barcode",
        Icon: AiOutlineLoading,
      },
    ],
    DRIVER: [
      {
        path: "/dashboard/delivery-management",
        label: "Manage Delivery",
        Icon: AiOutlineLoading,
      },
    ],
  };
  const mapRoutes = roleToRoutes[role as TRole];

  return (
    <Layout>
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 text-center font-extrabold">
        <h1 className="text-9xl">Error 404</h1>
        <h1 className="text-5xl">Page Not Found</h1>
        {Array.isArray(mapRoutes) && mapRoutes?.length > 0 ? (
          mapRoutes.map((route, index) => (
            <Link
              key={index}
              href={route.path} // Use dynamic path from mapRoutes
              className="text-4xl text-sky-900 underline transition-all hover:text-sky-900/30"
            >
              Go to {route.label}
            </Link>
          ))
        ) : (
          <Link
            href="/"
            className="text-4xl text-sky-900 underline transition-all hover:text-sky-900/30"
          >
            Go Back to Home
          </Link>
        )}
      </div>
    </Layout>
  );
}

export default Custom404;
