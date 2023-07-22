import Layout from "@/components/layout";
import React, { useEffect, useState } from "react";

import ReusableButton from "@/components/Parts/ReusableButton";
import ReusableInput from "@/components/Parts/ReusableInput";
import ProductImage from "@/components/Parts/ProductImage";
import Toggle from "@/components/Parts/Toggle";
import ScanBarcode from "@/components/Parts/ScanBarcode";
import OperationalToggle from "@/components/Parts/OperationalToggle";
import ViewRacks from "@/components/ViewRacks";

interface Bin {
  id: string;
  isAvailable: boolean;
  binSection: null;
  capacity: number;
  racksId: null;
  shelfLevelId: string;
}

interface ShelfLevel {
  id: string;
  level: number;
  capacity: boolean;
  racksId: string;
  bin: Bin[];
}

function BarcodeScanner() {
  const [barcodeId, setBarcodeId] = useState<string>("");
  const [purchaseOrder, setPurchaseOrder] = useState<string>("");
  const [boxSize, setBoxSize] = useState<string>("thisi");
  const arraySize: string[] = ["Small", "Medium", "Large"];
  const [expirationDate, setExpirationDate] = useState<string>("");
  const [isToggle, setIsToggle] = useState<boolean>(false);
  const [isManual, setIsManual] = useState<boolean>(false);
  const [isOpenRack, setIsOpenRack] = useState<boolean>(false);
  const [racks, setRacks] = useState<ShelfLevel[] | undefined>(undefined);

  async function findRacks() {
    try {
      const response = await fetch("/api/racks/find", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          barcodeId,
        }),
      });

      const json = await response.json();
      setRacks(json);
      if (response.status === 403) {
        setRacks(undefined);
      }
      if (response.status === 404) {
        setRacks(undefined);
      }
      console.log(json);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    findRacks();
    return () => void {};
  }, [barcodeId]);

  // console.log(racks);
  return (
    <Layout>
      <div className="break-all  p-5 font-bold ">
        <OperationalToggle isManual={isManual} setIsManual={setIsManual} />
        <form className="flex h-full w-full flex-col flex-wrap items-center justify-center gap-2 rounded-lg bg-blue-500 bg-transparent p-4 shadow-2xl shadow-blue-500/50">
          <ScanBarcode
            barcodeId={barcodeId}
            setBarcodeId={setBarcodeId}
            isManual={isManual}
            purchaseOrder={purchaseOrder}
            boxSize={boxSize}
            expirationDate={expirationDate}
          />

          <ReusableInput
            name="Purchase Order:"
            value={purchaseOrder}
            onChange={(value: any) => {
              setPurchaseOrder(value);
            }}
          />
          <div className="flex w-full flex-col flex-wrap items-start justify-center gap-2">
            <label htmlFor={"boxSize"}>Select Box Size</label>
            <select
              id="boxSize"
              value={boxSize}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setBoxSize(e.target.value);
              }}
              className="w-full break-all rounded-xl border border-gray-500 p-3
            transition-all">
              <option value="Select" className="font-bold">
                Select...
              </option>
              {arraySize.map((value, index) => {
                return (
                  <option key={index} className="font-ball">
                    {value}
                  </option>
                );
              })}
            </select>
          </div>

          <ReusableInput
            type="date"
            name="Expiration Date"
            value={expirationDate}
            onChange={(value: any) => {
              setExpirationDate(value);
            }}
          />

          <Toggle setIsToggle={setIsToggle} isToggle={isToggle} />
          <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 md:flex-row">
            {/* <button
              onClick={(e) => {
                e.preventDefault();
                setIsOpenRack((prevState) => !prevState);
              }}
              className="absolute">
              Open Rack
            </button> */}
            <ProductImage barcodeId={barcodeId} />
            <ViewRacks isOpenRack={isOpenRack} racks={racks} />
          </div>

          {isManual && (
            <ReusableButton name={"Find"} type={"submit"}></ReusableButton>
          )}
        </form>
      </div>
    </Layout>
  );
}

export default BarcodeScanner;
