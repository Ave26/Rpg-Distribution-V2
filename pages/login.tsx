import Head from "next/head";
import ProStockV2 from "@/public/assets/Finally.png";
import Image from "next/image";
import LoginForm from "@/components/LoginForm";
import Link from "next/link";

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

export default function Login() {
  return (
    <>
      <Head>
        <title>{"Login | Hi Stranger!"}</title>
      </Head>
      <section className="flex h-screen flex-col flex-wrap items-center justify-center bg-gradient-to-l  from-cyan-300 to-blue-500 text-fluid-xs">
        <div className="flex flex-col gap-2 p-2">
          <div className="relative  flex items-center justify-center ">
            <div className="relative w-[10em]">
              <Image src={ProStockV2} alt={"rpg"} priority />
            </div>
          </div>
          <div className="text-words flex flex-col items-center justify-center break-normal text-center text-slate-700">
            <h1 className="text-4xl font-bold">RPG Prostock</h1>
            <p className="text-words break-normal text-center">
              Take Control of Your Warehouse with Prostock
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <LoginForm />
        </div>

        <Link
          className="w-full text-center font-black uppercase text-slate-700"
          href={"https://rpg-ph.com"}
        >
          Learn More
        </Link>
      </section>
    </>
  );
}
