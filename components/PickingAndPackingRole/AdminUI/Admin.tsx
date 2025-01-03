import AdminRecordForm, { TRecord } from "./AdminRecordForm";
import InventoryView from "./InventoryView";
import { binLocations, orderedProducts } from "@prisma/client";
import { useEffect, useState } from "react";
import { TBins } from "@/fetcher/fetchBins";
import BinSearchForm from "./BinSearchForm";
import useBins from "@/hooks/useBins";
import Toast, { TToast } from "../Toast";
import ViewBinLocations from "./ViewBinLocations";
import React from "react";
import { MdFiberSmartRecord } from "react-icons/md";
import { FaBoxesPacking } from "react-icons/fa6";

export type TBinLocations = Omit<binLocations, "id" | "orderedProductsTestId">;
export type TOrderedProductTest = orderedProducts & {
  binLocations: TBinLocations[];
};
export type TBinLocation = {
  searchSKU: string;
  totalQuantity: number;
};
export type TOmitOrderedProducts = Omit<orderedProducts, "id" | "recordsId">;
export type TOrderedProducts = TOmitOrderedProducts;

type TBinLocationss = {
  quantity: number;
  skuCode: string;
  binId: string;
};

export type TCreateOrderedProduct = {
  productName: string;
  binLocations: TBinLoc;
};
export type TBinLoc = {
  createMany: {
    data: TBinLocationss[];
  };
};
export default function Admin() {
  const { bins: data } = useBins();
  const [total, setTotal] = useState(0);
  const [bins, setBins] = useState<TBins[] | undefined>(undefined);
  const [isDisabled, setIsDisabled] = useState(false);
  const [currrentCapacity, setCurrrentCapacity] = useState<number>(0);
  const [binLocations, setBinLocations] = useState<TBinLocations[]>([]);
  const [weight, setWeight] = useState(0);

  const [orderedProducts, setOrderedProducts] = useState<
    TCreateOrderedProduct[]
  >([]);
  const [record, setRecord] = useState<TRecord>({
    clientName: "",
    SO: "",
    truckName: "default",
    locationName: "default",
  });

  const [toast, setToast] = useState<TToast>({
    animate: "",
    message: "",
    door: false,
  });

  const [binLocation, setBinLocation] = useState<TBinLocation>({
    searchSKU: "",
    totalQuantity: 0,
  });

  useEffect(() => {
    !binLocation.searchSKU && setBins(data);
    Array.isArray(data) &&
      data.find((v) => {
        v.assignedProducts[0]?.skuCode === binLocation.searchSKU;

        const w = v.assignedProducts[0]?.sku?.weight;
        setWeight(w);
        console.log("weight", weight);
        return weight;
      });
  }, [data, binLocation.searchSKU, weight]);
  // flex h-full w-full flex-wrap items-center justify-center gap-2  text-black transition-all md:flex-nowrap md:items-start md:justify-start
  // div className="flex flex-col gap-2 overflow-y-scroll p-2 md:flex-row md:overflow-hidden"
  return (
    <>
      <div className="flex h-full w-full flex-col justify-start gap-2 rounded-md bg-white p-2 md:max-w-sm md:items-start">
        <BinSearchForm
          states={{
            setWeight,
            weight,
            binLocations,
            setBinLocations,
            binLocation,
            setBinLocation,
            bins,
            setBins,
            data,
            setToast,
            setTotal,
            total,
            currrentCapacity,
          }}
        />
        <AdminRecordForm
          states={{
            setBinLocation,
            orderedProducts,
            setOrderedProducts,
            isDisabled,
            setIsDisabled,
            currrentCapacity,
            setCurrrentCapacity,
            record,
            setRecord,
          }}
        />
      </div>
      <Toast states={{ setToast, toast }} />
      <InventoryView
        states={{
          record,
          isDisabled,
          setIsDisabled,
          setToast,
          toast,
          binLocations,
          setBinLocations,
          binLocation,
          setBinLocation,
          bins,
          setTotal,
          total,
          orderedProducts,
          setOrderedProducts,
        }}
      />
      {orderedProducts.length !== 0 && (
        <div className="flex flex-col gap-2 bg-white p-2 shadow-md">
          <h1>On Queue</h1>
          <ViewBinLocations
            binLocations={binLocations}
            orderedProducts={orderedProducts}
          />
        </div>
      )}
    </>
  );
}
