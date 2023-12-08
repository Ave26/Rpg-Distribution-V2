import prisma from "@/lib/prisma";
import React from "react";
import { bins } from "@prisma/client";

export default function Inventory({ bins }: any) {
  console.log(bins);
  return <div>{JSON.stringify(bins)}</div>;
}

export async function getServerSideProps() {
  try {
    // Fetch data from external API
    const bins = await prisma.bins.findMany({
      include: {
        assignedProducts: true,
      },
    });

    // Convert Date objects to string
    const serializedBins = bins.map((bin) => ({
      ...bin,
      assignedProducts: bin.assignedProducts.map((assignedProduct) => ({
        ...assignedProduct,
        dateReceive: assignedProduct?.dateReceive?.toISOString(),
        expirationDate: assignedProduct?.expirationDate?.toISOString(),
      })),
    }));

    // Pass data to the page via props
    return { props: { bins: serializedBins } };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { props: { bins: [] } }; // Handle the error gracefully
  }
}
