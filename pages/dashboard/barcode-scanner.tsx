import Layout from "@/components/layout";
import React, { ReactElement, useEffect, useState } from "react";
import { Racks } from "@/types/types";

import ReusableInput from "@/components/Parts/ReusableInput";
import ProductImage from "@/components/Parts/ProductImage";
import Toggle from "@/components/Parts/Toggle";
import ScanBarcode from "@/components/Parts/ScanBarcode";
import OperationalToggle from "@/components/Parts/OperationalToggle";
import DashboardLayout from "@/components/Admin/dashboardLayout";
import Head from "next/head";

function BarcodeScanner(): JSX.Element {
  const [barcodeId, setBarcodeId] = useState<string>("");
  const [purchaseOrder, setPurchaseOrder] = useState<string>("");
  const [boxSize, setBoxSize] = useState<string>("");
  const [expirationDate, setExpirationDate] = useState<Date | string | null>(
    ""
  );
  const [quality, setQuality] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const arraySize: string[] = ["Small", "Medium", "Large"];
  const [isToggle, setIsToggle] = useState<boolean>(false);
  const [isManual, setIsManual] = useState<boolean>(false);
  const [isOpenRack, setIsOpenRack] = useState<boolean>(false);
  const [racks, setRacks] = useState<Racks[] | undefined>(undefined);

  return (
    <>
      <Head>
        <title>{"Dashboard | Scan Barcode"}</title>
      </Head>
      <form className="flex h-full w-full flex-col gap-2 p-4">
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

        {/* <BinLocation barcodeId={barcodeId} /> */}
      </form>
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
