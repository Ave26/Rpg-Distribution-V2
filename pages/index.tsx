import Layout from "@/components/layout";
import { verifyJwt } from "@/lib/helper/jwt";
import { NextApiRequest } from "next";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

import AdminDashboard from "@/components/Admin/AdminDashBoard";
import StaffDashboard from "@/components/Staff/StaffDashBoard";
import Link from "next/link";

export default function Home({ data }: any) {
  return (
    <>
      <Head>
        <title>{"Home | " + (data?.roles ?? "Hi")}</title>
      </Head>
      <Layout>
        <div className="w-full h-full font-extrabold text-md">
          {!data ? (
            <section className="h-screen w-full">
              <div
                className="mt-10  text-center opacity-90 bg-blue-800 text-white flex items-center justify-center flex-col ml-0 mr-0 w-full
">
                <div className="text-center w-96 h-96 px-2 flex justify-center items-center flex-col">
                  <h1 className="text-xl m-2">Welcome to RPG Prostock!</h1>
                  <p className="text-xs">
                    Take Control of Your Warehouse with Prostock: The Ultimate
                    Solution for Streamlined Management! To know more about our
                    company click the button bellow!
                  </p>
                  <Link
                    className="p-5 border rounded-lg mt-5 hover:bg-white hover:text-black"
                    href={"https://rpg-ph.com"}>
                    Learn More
                  </Link>
                </div>
              </div>
              <div>
                <div className="relative h-screen max-h-[400px] border w-full">
                  <video
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    loop
                    muted>
                    <source src="/assets/homepage.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </section>
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
