import { buttonStyleSubmit } from "@/styles/style";
import { records } from "@prisma/client";
import React, { SetStateAction, useEffect, useState } from "react";
import RecordInputs from "./RecordInputs";
import { TBinLocation, TBinLocations, TCreateOrderedProduct } from "./Admin";
import Loading from "@/components/Parts/Loading";
import { mutate } from "swr";

type TAdminRecordForm = {
  states: TStates;
};

type TStates = {
  setBinLocation: React.Dispatch<React.SetStateAction<TBinLocation>>;
  orderedProducts: TCreateOrderedProduct[];
  isDisabled: boolean;
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setOrderedProducts: React.Dispatch<
    React.SetStateAction<TCreateOrderedProduct[]>
  >;
  currrentCapacity: number;
  setCurrrentCapacity: React.Dispatch<React.SetStateAction<number>>;
  record: TRecord;
  setRecord: React.Dispatch<SetStateAction<TRecord>>;
};

export type TRecord = Omit<
  records,
  "id" | "dateCreated" | "batchNumber" | "authorName"
>;

export default function AdminRecordForm({ states }: TAdminRecordForm) {
  const {
    orderedProducts,
    setOrderedProducts,
    setBinLocation,
    isDisabled,
    setIsDisabled,
    currrentCapacity,
    setCurrrentCapacity,
    setRecord,
    record,
  } = states;
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    if (orderedProducts.length === 0)
      return alert("Product Has Not Been Selected");

    fetch("/api/inventory/record/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ record, orderedProducts }),
    })
      .then((res) => res.json())
      .then((data) => {
        // reset the ordered products

        if (data) {
          setOrderedProducts([]);
          mutate("/api/records/bins/find");
        }
      })
      .catch((error) => error)
      .finally(() => {
        mutate("/api/records/bins/find");
        setRecord({
          clientName: "",
          SO: "",
          truckName: "default",
          locationName: "default",
        });
        setBinLocation({
          searchSKU: "",
          totalQuantity: 0,
        });
        setIsDisabled(false);
        setLoading(false);
      });
  }

  return (
    <form
      className="flex flex-col gap-2 rounded-md shadow-sm"
      onSubmit={handleSubmit}
    >
      <h1>Record Details</h1>
      <RecordInputs
        states={{
          record,
          setRecord,
          isDisabled,
          currrentCapacity,
          setCurrrentCapacity,
        }}
      />

      <button
        type="submit"
        className={buttonStyleSubmit}
        disabled={orderedProducts.length === 0 ? true : false}
      >
        {loading ? (
          <div className="flex h-full w-full items-center justify-center transition-all">
            <Loading />
          </div>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
}

/* 
  TODO: NEED TO SELECT THE LAST STATE OF SELECT INPUT AND NEED TO CREATE THE INPUTS FOR LOCATIONS
  NEED TO DISPLAY THE AVAILABLE IN THE INVENTORY

  THE VIEW INVENTOY CAN BE USE AS A CONTROLLED INPUT FOR THE FOLLOWING ORDERED PRODUCTS

  PRODUCT NAME SKUCODE BARCODE ID TOTAL QUANTITY 28/30

  TOTAL QUANTITY: 

  the PRODUCT WILL BE AUTOMATICALLY BEEN CHOOSE AS FIFO


  DISPLAY ONLY THE PRODUCTS AVAILABLE 

  WHEN THE PRODUCT HAS BEEN SELECTED IT WILL AUTOMATICALLY CHOOSE THE LAST IN AVAILABLE PRODUCT IN THE BIN

  THE INFO ON WHAT, WHEN AND WHERE WILL BE RECORDED
  IT WILL CREATE FIRST THE RECORD -> ID, DATE, TRUCKNAME, CLIENTNAME, LOCATIONNAME, [ ORDEREDPRODUCTS, [ BINLOCATIONS[] ] ] ->   



  FIND THE TOTAL QUANTITY BASED ON THE SKU CODE

  IF THE TOTAL QUANTITY EXEEDED || THE ORDER REACH THE MAXIMUN THRESHOLD THEN PROMPT THE USER THAT ORDER IS DENIED

  PROBLEM 4 7 2024
  NEED TO CREATE ORDER PRODUCT TO BE INPUT THE NAME OF THE PRODUCT
  NEED TO KNOW THE TOTAL OF EACH PRODUCT 
  



*/
