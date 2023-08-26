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

export default function PickingAndPacking() {
  const [barcode, setBarcode] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [binId, setBinId] = useState<string>("");
  const [filtrateBin, setFiltrateBin] = useState<Bin[] | undefined>(undefined);

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


   
      Need to get only the necesssary if there is no barcode the response back the whole data
 

      IN THE DATABASE I NEED ORDER LIST


      NOTE: The user will only see what he selected and they can cancel it at
      any time

      the other user will not see the selected data
      


      ACTIONS: 
      UPDATE, CREATE OR MOVE TO DIFFERENT COLLECTION
   */

  return (
    <>
      <Head>
        <title>{"Dashboard | Picking And Packing"}</title>
      </Head>
      <div className="flex h-full w-full flex-col gap-2 p-2 md:h-screen md:flex-row">
        <div className="borde-white flex h-full w-full flex-col gap-2 md:justify-start">
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
          <InputField
            personalEffects={{
              placeholder: "Testing",
              type: "Date",
            }}
            inputProps={{ inputValue: date, setInputValue: setDate }}
          />
        </div>
        {isLoading ? (
          <Loading />
        ) : (
          <div className="">
            <BinsLayout isLoading={isLoading} bins={bins} />
          </div>
        )}

        <button
          type="button"
          className="not-sr-only inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 hover:bg-blue-800 dark:bg-blue-600 dark:focus:ring-blue-800 dark:hover:bg-blue-700 md:sr-only">
          <svg
            className="mr-2 h-3.5 w-3.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 21">
            <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
          </svg>
          Confirm
        </button>
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
