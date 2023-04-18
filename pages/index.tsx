import { Inter } from "next/font/google";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import Layout from "@/components/layout";

// assets
import { useEffect, useState } from "react";
import { verifyJwt } from "@/lib/helper/jwt";
import { IncomingMessage, ServerResponse } from "http";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ data }: any) {
  return (
    // <Layout data={data}>
    <div className="w-full h-screen dark:bg-slate-900">
      <button onClick={undefined}>click</button>
      <h1>{data ? data.id : null}</h1>
    </div>
    // </Layout>
  );
}

// export const getServerSideProps = async (context: { req: NextApiRequest }) => {
//   const req: NextApiRequest = context.req;
//   const { verifiedToken } = await verifyJwt(req);

//   return {
//     props: {
//       data: verifiedToken ?? null,
//     },
//   };
// };
