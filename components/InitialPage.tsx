import Link from "next/link";
import { useState, type FC, useEffect } from "react";
import LoginForm from "./LoginForm";
import ProStockV2 from "@/public/assets/Finally.png";
import Image from "next/image";

interface HomeProps {}

const InitialPage: FC<HomeProps> = ({}) => {
  // flex h-full w-full flex-col flex-wrap items-center justify-center gap-3 break-all bg-gradient-to-b from-cyan-300 to-blue-500 py-28 font-sans text-white
  return (
    <>
      <section className="flex h-full flex-col flex-wrap items-center justify-center text-white">
        {/* logo */}

        <div className="flex flex-col gap-2 p-2">
          <div className="relative  flex items-center justify-center ">
            <div className="relative w-[10em]">
              <Image src={ProStockV2} alt={"rpg"} />
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

        {/* <video
          className="absolute bottom-0 -z-10 h-full w-full"
          autoPlay
          loop
          muted
        >
          <source src="/assets/homepage.mp4" type="video/mp4" />
        </video> */}
      </section>
    </>
  );
};
export default InitialPage;
