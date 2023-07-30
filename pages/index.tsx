import Layout from "@/components/layout";
import { verifyJwt } from "@/lib/helper/jwt";
import { NextApiRequest } from "next";
import Head from "next/head";

import InitialPage from "@/components/InitialPage";
import { useRouter } from "next/router";

interface TokenProps {
  id: string;
  roles: string;
  iat: number;
  exp: number;
}

export default function Home({ data }: any): JSX.Element {
  const router = useRouter();

  if (data?.isLogin) {
    router.push("/dashboard/barcode-scanner");
  }

  return (
    <>
      <Head>
        <title>{"Home |" + (data?.roles ?? "Hi")}</title>
      </Head>
      <Layout data={data}>
        <InitialPage />
      </Layout>
    </>
  );
}

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const { verifiedToken } = await verifyJwt(req);
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
  console.log(data);
  return {
    props: {
      data,
    },
  };
};
