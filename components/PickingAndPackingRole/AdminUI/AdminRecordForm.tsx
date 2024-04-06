import Input from "@/components/Parts/Input";
import useLocations from "@/hooks/useLocations";
import { InputStyle, buttonStyle, buttonStyleSubmit } from "@/styles/style";
import {
  orderedProductsTest,
  records,
  binLocations,
  locations,
  trucks,
} from "@prisma/client";
import React, { useEffect, useState } from "react";
import SelectLocationInput from "./SelectLocationInput";
import useTrucks from "@/hooks/useTrucks";
import { TTrucks } from "../PickingAndPackingType";
import SelectTruckInput from "./SelectTruckInput";
import RecordInputs from "./RecordInputs";
import { stringify } from "querystring";
import BinLocationInputs from "./BinLocationInputs";

type TAdminRecordForm = {};

type TRecord = Omit<
  records,
  "id" | "dateCreated" | "batchNumber" | "authorName"
>;
type TLocations = Omit<locations, "id">;
type TBinLocations = Omit<binLocations, "id" | "orderedProductsTestId">;

function AdminRecordForm({}: TAdminRecordForm) {
  const [record, setRecord] = useState<TRecord>({
    clientName: "",
    POO: "",
    truckName: "",
    locationName: "",
  });

  const [binLocation, setBinLocation] = useState<TBinLocations>({
    quantity: 0,
    binId: "",
    skuCode: "",
  });

  useEffect(() => {
    console.log(record);
  }, [record]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    fetch("", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    })
      .then((res) => res.json())
      .then((data) => data)
      .catch((error) => error)
      .finally(() => {
        setRecord({
          clientName: "",
          POO: "",
          truckName: "",
          locationName: "",
        });
      });
  }

  return (
    <form
      action=""
      className="flex flex-col gap-2 rounded-md border border-gray-500/5 bg-white p-2 shadow-sm"
      onSubmit={handleSubmit}
    >
      <RecordInputs states={{ record, setRecord }} />
      <BinLocationInputs states={{ binLocation, setBinLocation }} />

      <button type="submit" className={buttonStyleSubmit}>
        click
      </button>
    </form>
  );
}

export default AdminRecordForm;

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

*/
