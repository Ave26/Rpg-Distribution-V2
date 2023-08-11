import React, { ReactElement, useState } from "react";
import Layout from "@/components/layout";
import DashboardLayout from "@/components/Admin/dashboardLayout";
import ReusableInput from "@/components/Parts/ReusableInput";
import ReusableButton from "@/components/Parts/ReusableButton";
import useSWR from "swr";
import Head from "next/head";
import BinsLayout from "@/components/BinsLayout";

export default function PickingAndPacking() {
  const [barcode, setBarcode] = useState<string>("");
  const [bins, setBins] = useState<any[]>([]);
  const fetcher = async (url: string) => {
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    setBins(data);
    return data;
  };

  const { isLoading, error } = useSWR("/api/racks/find", fetcher, {
    refreshInterval: 500,
  });

  if (error) return "Oops, something went wrong...";

  return (
    <>
      <Head>
        <title>{"Dashboard | Picking And Packing"}</title>
      </Head>
      <div className="flex h-screen w-full flex-col gap-2 p-4 hover:overflow-y-auto">
        Pick and pack is a term for warehouse work that involves picking the
        correct type and number of items from shelves and packing them
        efficiently for shipping.
        <ReusableInput
          name="Barcode Id"
          value={barcode}
          onChange={(value: string) => {
            setBarcode(value);
          }}
          className="appearance-none border-none p-2 outline-none focus:ring focus:ring-emerald-600 "
        />
        <div className="flex h-1/2 w-full flex-wrap items-center justify-start  gap-2 overflow-y-auto  rounded-2xl border border-black p-5">
          {/* <ReusableButton className="flex h-[5vh] w-full flex-row items-start justify-between overflow-hidden border border-black p-2 transition-all hover:h-[10vh]">
            <h1>Barcode Id: 12334455667</h1>
            <h1>sku: sku-sample</h1>
            <h1>Quantity: 1000</h1>
          </ReusableButton> */}
          <BinsLayout bins={bins} />

          <button className="flex h-[5vh] w-full flex-row items-start justify-between overflow-hidden border border-black p-2 transition-all hover:h-[10vh]">
            <h1>Barcode Id: 12334455667</h1>
            <h1>sku: sku-sample</h1>
            <h1>Quantity: 1000</h1>
          </button>
        </div>
        <div className="h-40 w-40 border border-black"></div>
      </div>
    </>
  );
}

PickingAndPacking.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <DashboardLayout>{page}</DashboardLayout>
    </Layout>
  );
};
