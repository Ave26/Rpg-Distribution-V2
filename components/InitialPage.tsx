import Link from "next/link";
import { useState, type FC, useEffect } from "react";
import LoginForm from "./LoginForm";
import ProStockV2 from "@/public/assets/Finally.png";
import Image from "next/image";

interface HomeProps {}

const InitialPage: FC<HomeProps> = ({}) => {
  return (
    <>
      <section className="flex h-full w-full flex-col flex-wrap items-center justify-center gap-3 break-all bg-gradient-to-b from-cyan-300 to-blue-500 py-28 font-sans text-white">
        <Image
          priority
          src={ProStockV2}
          alt="RPG LOGO"
          className="h-36 w-36 object-contain transition-all"
        />
        <div className="text-words flex flex-col items-center justify-center break-normal text-center">
          <h1 className="text-4xl font-bold">RPG Prostock</h1>
          <p className="text-words break-normal text-center">
            Take Control of Your Warehouse with Prostock
          </p>
        </div>

        <div className="flex items-center justify-center">
          <LoginForm />
        </div>
        <div className="flex h-full w-full items-center justify-center md:justify-start md:px-80">
          <Link
            className="h-full w-fit cursor-pointer select-none border p-2 text-center font-bold transition-all hover:drop-shadow-2xl lg:text-start"
            href={"https://rpg-ph.com"}
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* <video className="relative" autoPlay loop muted>
        <source src="/assets/homepage.mp4" type="video/mp4" />
      </video> */}
    </>
  );
};
export default InitialPage;
