import Link from "next/link";
import { useState, type FC, useEffect } from "react";
import LoginForm from "./LoginForm";

interface HomeProps {}

const InitialPage: FC<HomeProps> = ({}) => {
  return (
    <>
      <section className="flex h-full w-full flex-col flex-wrap items-center justify-center gap-3 break-all border py-28 font-sans text-white">
        <div className="relative h-28 w-28 rounded-lg bg-white/30 p-5 backdrop-blur-sm">
          <div className="h-full w-full rotate-45 rounded-lg bg-white"></div>
        </div>
        <div className="text-words flex flex-col items-center justify-center break-normal text-center">
          <h1 className="text-4xl font-bold">RPG Prostock</h1>
          <p className="text-words break-normal text-center">
            Take Control of Your Warehouse with Prostock
          </p>
        </div>

        {/* <p>
          Take Control of Your Warehouse with Prostock: The Ultimate Solution
          for Streamlined Management! To know more about our company click the
          button bellow!
        </p>
        <Link
          className="rounded-lg border border-white p-4 md:text-3xl "
          href={"https://rpg-ph.com"}>
          Learn More
        </Link> */}
        <div className="flex items-center justify-center">
          <LoginForm />
        </div>
        <div className="flex h-full w-full items-center justify-center md:justify-start md:px-80">
          <Link
            className="h-full w-fit cursor-pointer select-none border p-2 text-center font-bold transition-all hover:drop-shadow-2xl lg:text-start"
            href={"https://rpg-ph.com"}>
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
