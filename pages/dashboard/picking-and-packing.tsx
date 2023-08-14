import React, { ReactElement, useEffect, useState } from "react";
import Layout from "@/components/layout";
import DashboardLayout from "@/components/Admin/dashboardLayout";
import ReusableInput from "@/components/Parts/ReusableInput";
import ReusableButton from "@/components/Parts/ReusableButton";
import useSWR from "swr"; // cache
import Head from "next/head";
import BinsLayout from "@/components/BinsLayout";
import Loading from "@/components/Parts/Loading";
import { Bin } from "@/types/types";

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  const ValuedBin = data?.filter((bin: Bin) => {
    return bin.assignment.length > 0;
  });

  return ValuedBin;
};

export default function PickingAndPacking() {
  const [barcode, setBarcode] = useState<string>("");
  const [filtrateBin, setFiltrateBin] = useState<[]>([]);
  const {
    isLoading,
    error,
    data: bins,
  } = useSWR("/api/racks/find", fetcher, {
    refreshInterval: 1500,
  });

  if (error) {
    console.log(error);
    return "Oops, something went wrong...";
  }

  async function findBinByBarcode() {
    const filteredBins_and_assignment = bins?.filter((bin: Bin) =>
      bin.assignment.some(
        (assignmentGroup) => assignmentGroup.products.barcodeId === barcode
      )
    );

    // console.log(filteredBins_and_assignment);
    return setFiltrateBin(filteredBins_and_assignment);
  }

  return (
    <>
      <Head>
        <title>{"Dashboard | Picking And Packing"}</title>
      </Head>
      <div className="flex h-screen w-full flex-col gap-2 p-4 hover:overflow-y-auto">
        <p>
          Pick and pack is a term for warehouse work that involves picking the
          correct type and number of items from shelves and packing them
          efficiently for shipping.
        </p>
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            findBinByBarcode();
          }}
          className="flex items-center justify-center gap-2">
          <div className="flex flex-row items-center justify-center gap-2 bg-white">
            <ReusableInput
              name="Barcode Id"
              value={barcode}
              onChange={(value: string) => {
                setBarcode(value);
              }}
              className="appearance-none border-none p-2 outline-none focus:ring focus:ring-emerald-600 "
            />
            <button
              onClick={() => {
                setBarcode("");
              }}
              className="m-2 h-full w-full bg-transparent">
              X
            </button>
          </div>
          <ReusableButton name={"Search"} />
        </form>
        <div className="flex h-1/2 w-full flex-wrap items-start justify-start  gap-2 overflow-y-auto  rounded-sm border border-black p-5">
          {isLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loading />
            </div>
          ) : (
            <BinsLayout
              bins={Number(filtrateBin.length) === 0 ? bins : filtrateBin}
              barcode={barcode}
            />
          )}
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
