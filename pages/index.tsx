import Layout from "@/components/layout";
import Head from "next/head";

import InitialPage from "@/components/InitialPage";
import { useMyContext } from "@/contexts/AuthenticationContext";

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
  const { globalState } = useMyContext();

  // console.log(globalState);
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
