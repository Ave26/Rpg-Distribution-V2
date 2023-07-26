import Link from "next/link";
import type { FC } from "react";
import LoginForm from "./LoginForm";

interface HomeProps {}

const InitialPage: FC<HomeProps> = ({}) => {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center gap-10 break-words md:h-full md:gap-0">
      <LoginForm />
      <div className="relative flex flex-col items-center justify-center gap-6 bg-sky-500 p-6 text-center text-sm md:gap-5 md:px-40 md:py-20 md:text-2xl">
        <h1 className="md:text-3xl">Welcome to RPG Prostock!</h1>
        <p>
          Take Control of Your Warehouse with Prostock: The Ultimate Solution
          for Streamlined Management! To know more about our company click the
          button bellow!
        </p>
        <Link
          className="rounded-lg border border-white p-4 md:text-3xl "
          href={"https://rpg-ph.com"}>
          Learn More
        </Link>
      </div>
      <video className="relative" autoPlay loop muted>
        <source src="/assets/homepage.mp4" type="video/mp4" />
      </video>
    </div>
  );
};
export default InitialPage;
