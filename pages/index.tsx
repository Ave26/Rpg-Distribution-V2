import Layout from "@/components/layout";
import { verifyJwt } from "@/lib/helper/jwt";
import { NextApiRequest } from "next";
import Head from "next/head";

import AdminDashboard from "@/components/Admin/AdminDashBoard";
import StaffDashboard from "@/components/Staff/StaffDashBoard";
import InitialPage from "@/components/InitialPage";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/Admin/dashboardLayout";
import { ReactElement } from "react";
import { redirect } from "next/dist/server/api-utils";
import Loading from "@/components/Parts/Loading";

export default function Home({ data }: any) {
  const router = useRouter();
  if (data?.verifiedToken?.roles === "Admin") {
    router.push("/dashboard/barcode-scanner");
  } else {
    router.push("/dashboard/barcode-scanner");
  }

  return (
    <>
      <Head>
        <title>{"Home | " + (data?.roles ?? "Hi")}</title>
      </Head>
      <Layout data={data}>
        <div className="text-md flex h-screen w-full items-center justify-center font-extrabold">
          {
            data.isLogin === false ? <InitialPage /> : <Loading />
            // ) : data?.verifiedToken?.roles === "Admin" ? (
            //   <AdminDashboard />
            // ) : (
            //   <StaffDashboard />
            // )
          }
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const { verifiedToken }: any = await verifyJwt(req);
  let data = {};
  if (verifiedToken) {
    data = {
      isLogin: true,
      verifiedToken,
    };
  } else {
    data = {
      isLogin: false,
    };
  }
  return {
    props: {
      data,
    },
  };
};
