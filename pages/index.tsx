import Layout from "@/components/layout";
import Head from "next/head";

import InitialPage from "@/components/InitialPage";

interface HomeProps {
  data: {
    authenticated: boolean;
    verifiedToken: {
      id: string;
      roles: string;
      iat: number;
      exp: number;
    };
  };
}

export default function Home({ data }: HomeProps) {
  console.log(data);
  return (
    <>
      <Head>
        <title>{"Home |" + (data?.verifiedToken?.roles ?? "Hi")}</title>
      </Head>
      {/* <Layout>
        <InitialPage />
      </Layout> */}
    </>
  );
}
