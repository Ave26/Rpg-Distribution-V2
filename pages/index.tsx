import Layout from "@/components/layout";
import { verifyJwt } from "@/lib/helper/jwt";
import { NextApiRequest } from "next";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

import AdminDashboard from "@/components/Admin/AdminDashBoard";
import StaffDashboard from "@/components/Staff/StaffDashBoard";

export default function Home({ data }: any) {
  return (
    <>
      <Head>
        <title>Home | {data?.roles}</title>
      </Head>
      <Layout>
        <div className="w-full h-screen dark:bg-slate-900 font-extrabold text-md">
          {!data ? (
            "this is home"
          ) : data?.roles === "Admin" ? (
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
  const { verifiedToken, error }: any = await verifyJwt(req);
  if (error) {
    console.log(error);
  }
  return {
    props: {
      data: verifiedToken ?? null,
    },
  };
};
