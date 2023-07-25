import Layout from "@/components/layout";
import React, { ReactElement, useEffect, useState } from "react";

import ReusableButton from "@/components/Parts/ReusableButton";
import ReusableInput from "@/components/Parts/ReusableInput";
import ProductImage from "@/components/Parts/ProductImage";
import Toggle from "@/components/Parts/Toggle";
import ScanBarcode from "@/components/Parts/ScanBarcode";
import OperationalToggle from "@/components/Parts/OperationalToggle";
import ViewRacks from "@/components/ViewRacks";
import DashboardLayout from "@/components/Admin/dashboardLayout";

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

function BarcodeScanner(): JSX.Element {
  const [barcodeId, setBarcodeId] = useState<string>("");
  const [purchaseOrder, setPurchaseOrder] = useState<string>("");
  const [boxSize, setBoxSize] = useState<string>("thisi");
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [quality, setQuality] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const arraySize: string[] = ["Small", "Medium", "Large"];
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
      // setRacks(json);
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
    <>
      <div className="break-all  p-5 font-bold ">
        <OperationalToggle isManual={isManual} setIsManual={setIsManual} />
        <form className="flex h-full w-full flex-col flex-wrap items-center justify-center gap-2 rounded-lg bg-blue-500 bg-transparent p-4 shadow-2xl shadow-blue-500/50">
          <ScanBarcode
            barcodeId={barcodeId}
            setBarcodeId={setBarcodeId}
            purchaseOrder={purchaseOrder}
            boxSize={boxSize}
            expirationDate={expirationDate}
            quality={quality}
            quantity={quantity}
            isManual={isManual}
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
            name="Batch Number"
            value={expirationDate}
            onChange={(value: any) => {
              setExpirationDate(value);
            }}
          />

          <Toggle
            setIsToggle={setIsToggle}
            isToggle={isToggle}
            setQuality={setQuality}
            quality={quality}
          />
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
    </>
  );
}

export default BarcodeScanner;

BarcodeScanner.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <DashboardLayout>{page}</DashboardLayout>
    </Layout>
  );
};
