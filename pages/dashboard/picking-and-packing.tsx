import React, { ReactElement, useEffect, useState } from "react";
import Layout from "@/components/layout";
import DashboardLayout from "@/components/Admin/dashboardLayout";
import useSWR from "swr"; // cache
import Head from "next/head";
import BinsLayout from "@/components/BinsLayout";
import Loading from "@/components/Parts/Loading";
import { Bin } from "@/types/inventory";
import Search from "@/components/Parts/Search";
import InputField from "@/components/Parts/InputField";
import ReusableButton from "@/components/Parts/ReusableButton";

export default function PickingAndPacking() {
  const [childActionTriggered, setChildActionTriggered] = useState(false);
  const [selectedBins, setSelectedBins] = useState<string[]>([]);
  const [barcode, setBarcode] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  console.log(selectedBins);

  const fetcher = async (url: string) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        barcodeId: barcode,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const ValuedBin: Bin[] = data?.filter((bin: Bin) => {
      return Number(bin?.assignment?.length) > 0;
    });

    return ValuedBin;
  };

  const {
    isLoading,
    data: bins,
    mutate,
  } = useSWR("/api/bin/find", fetcher, {
    refreshInterval: 1500,
  });

  // useEffect(() => {
  //   const THRESHOLD = 15;
  //   let markedCount = 0;
  //   if (bins) {
  //     for (const bin of bins) {
  //       if (markedCount >= THRESHOLD) {
  //         break; // If threshold is met, stop iterating
  //       }

  //       for (const assignedProduct of bin?.assignment) {
  //         if (!assignedProduct?.isMarked) {
  //           assignedProduct.isMarked = true;
  //           markedCount++;
  //           if (markedCount >= THRESHOLD) {
  //             break; // If threshold is met, stop marking products
  //           }
  //         } else {
  //           assignedProduct.isMarked = false;
  //         }
  //         // console.log(markedCount);
  //         // console.log(bins.map((bin) => bin._count && bin.assignment));
  //       }

  //       console.log(bin.assignment);
  //     }
  //   }
  // }, [quantity]);

  function setActionTrigger() {
    setChildActionTriggered(true);
  }

  return (
    <>
      <Head>
        <title>{"Dashboard | Picking And Packing"}</title>
      </Head>
      <div className="flex h-full w-full flex-wrap gap-2 overflow-y-auto border border-black p-2 md:h-screen  md:flex-row md:justify-center md:p-4">
        <div className="flex h-full w-full flex-col gap-2 md:h-fit md:max-w-fit md:justify-start">
          <Search
            inputProps={{
              inputValue: barcode,
              setInputValue: setBarcode,
              handleSearchInput: () => mutate(),
            }}
            personaleEffects={{ placeholder: "Search Barcode", maxLength: 14 }}
          />
          <InputField
            personalEffects={{
              placeholder: "Quantity",
              type: "number",
              min: 0,
            }}
            inputProps={{ inputValue: quantity, setInputValue: setQuantity }}
          />

          <ReusableButton
            name={"Confirm Request"}
            className="rounded-lg bg-blue-700 p-2 text-center text-base font-medium text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-800"
            // isLoading
            onClick={setActionTrigger}
            type={"button"}
          />
        </div>
        {isLoading ? (
          <div className="flex h-full w-full max-w-3xl items-center justify-center border md:max-h-96">
            <Loading />
          </div>
        ) : (
          <BinsLayout
            isLoading={isLoading}
            dataManipulator={{
              bins,
              handleMutation: () => mutate(),
            }}
            actionTriggered={childActionTriggered}
            setRequest={{ setSelectedBins }}
            request={{ barcodeId: barcode, quantity, selectedBins }}
          />
        )}
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
