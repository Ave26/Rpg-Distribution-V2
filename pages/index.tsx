import Layout from "@/components/layout";
import { verifyJwt } from "@/lib/helper/jwt";
import { NextApiRequest } from "next";
import Head from "next/head";

import AdminDashboard from "@/components/Admin/AdminDashBoard";
import StaffDashboard from "@/components/Staff/StaffDashBoard";
import InitialPage from "@/components/InitialPage";
import DashboardLayout from "@/components/dashboardLayout";
import { ReactElement } from "react";

export default function Home({ data }: any) {
  return (
    <>
      <Head>
        <title>{"Home | " + (data?.roles ?? "Hi")}</title>
      </Head>
      <Layout data={data}>
        <div className="text-md h-full w-full font-extrabold">
          {data.isLogin === false ? (
            <InitialPage />
          ) : data?.verifiedToken?.roles === "Admin" ? (
            <AdminDashboard />
          ) : (
            <StaffDashboard />
          )}
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
