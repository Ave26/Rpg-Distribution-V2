import Link from "next/link";
import type { FC } from "react";

interface HomeProps {}

const InitialPage: FC<HomeProps> = ({}) => {
  return (
    <section className="h-screen w-full">
      <div
        className="ml-0  mr-0 mt-10 flex w-full flex-col items-center justify-center bg-blue-800 text-center text-white opacity-90
">
        <div className="flex h-96 w-96 flex-col items-center justify-center px-2 text-center">
          <h1 className="m-2 text-xl">Welcome to RPG Prostock!</h1>
          <p className="text-xs">
            Take Control of Your Warehouse with Prostock: The Ultimate Solution
            for Streamlined Management! To know more about our company click the
            button bellow!
          </p>
          <Link
            className="mt-5 rounded-lg border p-5 hover:bg-white hover:text-black"
            href={"https://rpg-ph.com"}>
            Learn More
          </Link>
        </div>
      </div>
      <div>
        <div className="relative h-screen max-h-[400px] w-full border">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted>
            <source src="/assets/homepage.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
};
export default InitialPage;
