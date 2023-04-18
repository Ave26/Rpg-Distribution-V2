import React, { useEffect, useState } from "react";
import Layout from "@/components/layout";
import useSWR from "swr";
import { NextApiRequest } from "next";
import { verifyJwt } from "@/lib/helper/jwt";

export default function About({ data }: any) {
  return (
    // <Layout data={data}>
    <div className="w-full h-screen">This is About Page</div>
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
