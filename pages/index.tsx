import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ data }: any) {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <div className="w-full h-screen dark:bg-slate-900">
        Hello this is home
      </div>
    </>
  );
}
