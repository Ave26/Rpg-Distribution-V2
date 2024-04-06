import { useMyContext } from "@/contexts/AuthenticationContext";
import React from "react";

export default function Footer() {
  const { globalState } = useMyContext();

  return (
    <div
      className={`text-all relative flex h-24 w-full items-center justify-start gap-2 break-all ${
        globalState?.authenticated ? "bg-[#86B6F6]" : "bg-blue-500"
      }  p-4`}
    >
      <section className="">
        <p>&copy; 2023 Alright Reserve</p>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </section>
    </div>
  );
}
