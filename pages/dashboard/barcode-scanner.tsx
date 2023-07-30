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

  async function findRacks(abortController: AbortController) {
    try {
      const response = await fetch("/api/racks/find", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          barcodeId,
        }),
        signal: abortController.signal,
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
    const abortController = new AbortController();
    if (barcodeId != null) {
      findRacks(abortController);
    }
    return () => {
      abortController.abort();
    };
  }, [barcodeId]);

  return (
    <form className="flex h-screen w-full flex-col gap-2 p-4 hover:overflow-y-auto">
      <OperationalToggle isManual={isManual} setIsManual={setIsManual} />
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
        disableLabel={true}
        onChange={(value: any) => {
          setPurchaseOrder(value);
        }}
      />

      <div className="flex h-full w-full flex-col  items-start justify-center gap-2  font-bold">
        <label htmlFor={"boxSize"}>Select Box Size</label>
        <select
          id="boxSize"
          value={boxSize}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setBoxSize(e.target.value);
          }}
          className="h-full w-full break-all rounded-xl border border-gray-500 p-3
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
        disableLabel={true}
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
      <ProductImage barcodeId={barcodeId} />
    </form>
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
