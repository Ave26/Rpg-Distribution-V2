import Layout from "@/components/layout";
import { verifyJwt } from "@/lib/helper/jwt";
import { NextApiRequest } from "next";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

import AdminDashboard from "@/components/Admin/AdminDashBoard";
import StaffDashboard from "@/components/Staff/StaffDashBoard";
import InitialPage from "@/components/InitialPage";

export default function Home({ data }: any) {
  return (
    <>
      <Head>
        <title>{"Home | " + (data?.roles ?? "Hi")}</title>
      </Head>
      <Layout>
        <div className="text-md h-full w-full font-extrabold">
          {!data ? (
            <InitialPage />
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
    return {
      props: {
        error: true,
      },
    };
  }
  console.log(verifiedToken);

  return {
    props: {
      data: verifiedToken || "Please Login",
    },
  };
};
// server side rendering pare
