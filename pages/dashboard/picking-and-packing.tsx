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

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
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

export default function PickingAndPacking() {
  const [barcode, setBarcode] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [binId, setBinId] = useState<string>("");
  const [filtrateBin, setFiltrateBin] = useState<Bin[] | undefined>(undefined);

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

  const findBinByBarcode = () => {
    try {
      const filteredBins_and_assignment = bins?.filter((bin: Bin) => {
        return bin.assignment.every(
          (assignmentGroup) => assignmentGroup.products.barcodeId === barcode
        );
      });
      console.log(filteredBins_and_assignment);
      if (
        filteredBins_and_assignment?.map((bin) =>
          bin?.assignment?.every(
            (assign) => assign?.products?.barcodeId === barcode
          )
        )
      ) {
        return setFiltrateBin(filteredBins_and_assignment);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   filtrateBin?.map((bin) =>
  //     bin?.assignment?.every(
  //       (assign) => assign?.products?.barcodeId !== barcode
  //     )
  //   ) && setFiltrateBin(bins);
  // }, [barcode]);

  /*
    REQUEST: BARCODE ID, QUANTITY ORDER
    THOSE CARDS SHOULD BE SELECTABLE IN ORDER TO TAKE THE ID OF THE BIN
    - BIN ID
    - THE BIN ID WILL NOT BE SHOW AFTER SELECTED BASED ON THE QUANTITY
      - IF ASSIGNMENT QUANTITY > QUANTITY THEN IT WILL CALL A FUNCTION
      - FUNCTION -> NEGATE OR SUBTRACT THE ASSIGNMENT QUANTITY - QUANTITY AND WILL BE SHOWN
      - OTHERWISE IT WILL NOT BE SHOWN

        fetch bin id and update the selected bin

        if (binid.selected || bindId.)



      IN THE DATABASE I NEED ORDER LIST

      ACTIONS: 
      UPDATE, CREATE OR MOVE TO DIFFERENT COLLECTION
   */

  async function selectBin() {
    // ability to select the bin and update it into selected
    try {
      const response = await fetch("/api/bin/find", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          binId,
        }),
      });
      const json = await response.json();
      console.log(json);
      console.log(json);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    selectBin();
  }, [binId]);

  return (
    <>
      <Head>
        <title>{"Dashboard | Picking And Packing"}</title>
      </Head>
      <div className="flex h-screen w-full flex-col gap-2 p-4 hover:overflow-y-auto">
        <div className="flex items-center justify-start gap-2">
          <Search
            inputProps={{
              inputValue: barcode,
              setInputValue: setBarcode,
              handleSearchInput: findBinByBarcode,
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
        </div>
        <div className="flex h-1/2 w-full flex-wrap items-start justify-start  gap-2 overflow-y-auto  rounded-sm border border-black p-5">
          {isLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loading />
            </div>
          ) : (
            <BinsLayout
              bins={filtrateBin ? filtrateBin : bins}
              buttonProps={{ binId: binId, setBinId: setBinId }}
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
