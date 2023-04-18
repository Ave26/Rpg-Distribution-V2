import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Layout from "@/components/layout";
import { verifyJwt } from "@/lib/helper/jwt";
import "@/styles/globals.css";
import { GetServerSideProps, NextApiRequest } from "next";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [data, setData] = useState<any>();

  useEffect(() => {
    async () => {
      console.log("it is being rerendered");
      // try {
      //   const response = await fetch("/api/login", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   });
      //   const json = await response.json();
      //   console.log(json);
      //   switch (response.status) {
      //     case 200:
      //       setData(json.message);
      //       break;
      //     case 401:
      //       console.log(json.message);
      //       break;
      //     case 404:
      //       console.log(json.message);
      //       break;
      //   }
      // } catch (error: unknown | any) {
      //   console.log(error);
      // }
    };
  }, []);
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
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
