import { useMyContext } from "@/contexts/AuthenticationContext";
import React from "react";
import { FaFacebook } from "react-icons/fa";

export default function Footer() {
  const { globalState } = useMyContext();

  return (
    <div
      className={`text-all relative flex h-full w-full items-center justify-start gap-2 overflow-scroll break-all ${
        globalState?.authenticated
          ? "bg-gradient-to-r from-[#5750D9] via-[#5363D9]  to-[#4F75D8]"
          : "bg-blue-500"
      }  p-4`}
    >
      <section className="grid w-full grid-cols-2 grid-rows-2 text-white">
        <div>
          <p>&copy; 2023 Alright Reserve</p>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
        {/* <FaFacebook
          size={30}
          className="flex w-full items-end border border-black"
        /> */}
      </section>
    </div>
  );
}
