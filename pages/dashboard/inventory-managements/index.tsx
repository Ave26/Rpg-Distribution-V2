import prisma from "@/lib/prisma";
import React from "react";
import { bins } from "@prisma/client";

export default function Inventory({ bins }: any) {
  console.log(bins);
  return <div>{JSON.stringify(bins)}</div>;
}

export async function getServerSideProps() {
  // Fetch data from external API
  const bins = await prisma.bins.findMany({});
  console.log(bins);
  // Pass data to the page via props
  return { props: { bins: bins } };
}
