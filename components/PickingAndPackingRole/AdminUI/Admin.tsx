import useLocations from "@/hooks/useLocations";
import AdminRecordForm, { TRecord } from "./AdminRecordForm";
import useTrucks from "@/hooks/useTrucks";
import InventoryView from "./InventoryView";
import { binLocations, orderedProductsTest } from "@prisma/client";
import { SetStateAction, useEffect, useState, useMemo } from "react";
import { TBins } from "@/fetcher/fetchBins";
import BinSearchForm from "./BinSearchForm";
import useBins from "@/hooks/useBins";
import Toast, { TToast } from "../Toast";
import ViewBinLocations from "./ViewBinLocations";
import React from "react";

export type TBinLocations = Omit<binLocations, "id" | "orderedProductsTestId">;
export type TOrderedProductTest = orderedProductsTest & {
  binLocations: TBinLocations[];
};
export type TBinLocation = {
  searchSKU: string;
  totalQuantity: number;
};
export type TOmitOrderedProducts = Omit<
  orderedProductsTest,
  "id" | "recordsId"
>;
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
    POO: "",
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
        const w = v.assignedProducts[0].sku.weight;
        setWeight(w);
        console.log("weight", weight);
        return weight;
      });
  }, [data, binLocation.searchSKU]);

  return (
    <div className="flex h-full w-full flex-wrap items-center justify-center gap-2  text-black transition-all transition-all md:flex-nowrap md:items-start md:justify-start">
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
        <div className="flex flex-col gap-2 border border-slate-200 p-2 shadow-md">
          <h1>On Queue</h1>
          <ViewBinLocations
            binLocations={binLocations}
            orderedProducts={orderedProducts}
          />
        </div>
      )}
    </div>
  );
}

/*   
    the bin search form will change the state of the bins
    if the binLocation input search is undefined | null | "" then dont change the current bins which is data
      - fix this using function
    if the search sku code cant find anything then just return the data otherwise return the new filteredData
  */
/* 
    THIS NEEDED TO IMPLEMENT
    THE API CORRELATION
    - DISPLAY BINS
    - ADD THE SKU
    - CHANGE DYNAMICALLY THE TRUCK CAPACITY
    - MAKE USE OF NEWLT ADDED TRUCK THRESHOLD
    - MAKE A MORE UNDERSTANDABLE RECORDS THAT CORRELATE TO OTHERS

    THIS IS THE PICKING OF PRODUCT INSIDE THE WAREHOUSE TO BE READY IN THE TRUCK

    THE USER MUST GET THE ORDER PAPER TO INPUT THE NECESSARY PRODUCT OF THE CLIENT

    make an API that is more accurate for creating records

    records: {
      ...recordsDetails,

      batchNumber: 0,
      Location: {
        recordId: ""
        name: "",
        coordinates: {
          longitude: "",
          latitude:  ""
        }
      }
    }
   
     recordsDetails: {[

      clientName  
      dateCreated     
      batchNumber       
      POO                  
      locationName         
      authorName           
      truckName          

      orderedProducts: {
        recordId
        [binLocation: {
          binId: 
          skuCode: sku1
          barcode: 123
          quantity: 
        }, 
        binLocation: {
          binId: 
          skuCode: sku2
          barcode: 123
          quantity: 
        }] 
      },
      orderedProducts: {
        binLocation: {
          binId: 
          skuCode: sku3
          barcode: 321
          quantity: 
        }
      }]

    the location can be  self entity

    const total = array.reduce(accumulator, sum => { const total  = {
      totalTest: accumalator + sum
    } }, { totalTest: 0 })

    console.log(total)

    register lots of location to be access by the admin
    




         <select name="" id="" className={inputStyle}>
          {Array.isArray(locations) ? (
            locations.map((location) => {
              return <option key={location.id}>{location.name}</option>;
            })
          ) : (
            <option>
              <Loading />
            </option>
          )}
        </select> */

/* <select
          name={key}
          id={key}
          value={record[key as keyof TRecords]}
          onChange={handleChange}
          className="border-blue-gray-200  text-blue-gray-700 placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 disabled:bg-blue-gray-50 peer h-full w-full appearance-none rounded-[7px] border bg-transparent px-3 py-2 font-sans text-sm font-normal outline outline-0 transition-all focus:border-2 focus:border-sky-400"
        >
          {truckStatus.map((statusOption) => (
            <option key={statusOption} value={statusOption}>
              {statusOption}
            </option>
          ))
        </select> 


 {key !== "status" && key !== "id" && (
              <TMInput
                attributes={{
                  input: {
                    name: key,
                    id: key,
                    type:
                      typeof form[key as keyof TForm] === "number"
                        ? "number"
                        : "text",
                    min:
                      typeof form[key as keyof TForm] === "number"
                        ? 0
                        : undefined,
                    value: form[key as keyof TForm],
                    onChange: handleChange,
                  },
                  label: {
                    children: key,
                    htmlFor: key,
                  },
                }}
              />
            )}


          track the index of the binLocation 
*/
