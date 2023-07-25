import Link from "next/link";
import React, { useState } from "react";

interface ReusableLinkProps {
  endPoint: string;
  linkName: string;
  visibility?: string;
}

export default function ReusableLink({
  endPoint,
  linkName,
  visibility,
}: ReusableLinkProps) {
  return (
    <Link
      href={`/dashboard/${endPoint}`}
      className={`w-fit select-none whitespace-nowrap rounded-lg bg-[#65CECA] p-2 text-start font-bold duration-75 ease-linear focus:bg-[#3B7B5] hover:rounded-e-2xl hover:bg-[#65CECA] md:w-[10rem] md:rounded-s-none md:bg-transparent md:transition-all ${visibility}`}>
      {linkName}
    </Link>
  );
}
