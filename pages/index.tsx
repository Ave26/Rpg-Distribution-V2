import Layout from "@/components/layout";
import Head from "next/head";

import InitialPage from "@/components/InitialPage";
import { useRouter } from "next/router";
import { verifyJwt } from "@/lib/helper/jwt";
import { NextApiRequest } from "next";
import { useContext } from "react";
import { useMyContext } from "@/components/contexts/AuthenticationContext";

interface TokenProps {
  id: string;
  roles: string;
  iat: number;
  exp: number;
}

interface DataProps {
  authenticated: boolean;
  verifiedToken: TokenProps;
}

interface HomeProps {
  data: DataProps;
}

export default function Home({ data }: HomeProps) {
  const router = useRouter();
  const { globalState, updateGlobalState } = useMyContext();
  if (data.authenticated === true) {
    router.push("/dashboard/barcode-scanner");
  }
  console.log(globalState);
  return (
    <>
      <Head>
        <title>{"Home |" + (data?.verifiedToken?.roles ?? "Hi")}</title>
      </Head>
      <Layout>
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
      authenticated: true,
      verifiedToken,
    };
  } else {
    data = {
      authenticated: false,
    };
  }
  return {
    props: {
      data,
    },
  };
};
