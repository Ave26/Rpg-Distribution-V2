import Layout from "@/components/layout";
import React, { useEffect, useState } from "react";

import ReusableButton from "@/components/Parts/ReusableButton";
import ReusableInput from "@/components/Parts/ReusableInput";
import ProductImage from "@/components/Parts/ProductImage";
import Toggle from "@/components/Parts/Toggle";
import ScanBarcode from "@/components/Parts/ScanBarcode";
import OperationalToggle from "@/components/Parts/OperationalToggle";

function BarcodeScanner() {
  const [barcodeId, setBarcodeId] = useState<string>("");
  const [purchaseOrder, setPurchaseOrder] = useState<string>("");
  const [boxSize, setBoxSize] = useState<string>("thisi");
  const arraySize: string[] = ["Small", "Medium", "Large"];
  const [expirationDate, setExpirationDate] = useState<string>("");
  const [isToggle, setIsToggle] = useState<boolean>(false);
  const [isManual, setIsManual] = useState<boolean>(false);

  // kailangan naka base na sa expiry and category

  return (
    <Layout>
      <div className="break-all  p-5 font-bold">
        <OperationalToggle isManual={isManual} setIsManual={setIsManual} />
        <form className="flex h-full w-full flex-col flex-wrap items-center justify-center gap-2 rounded-lg bg-transparent p-4 shadow-2xl">
          <ScanBarcode
            barcodeId={barcodeId}
            setBarcodeId={setBarcodeId}
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
            name="Expiration Date"
            value={expirationDate}
            onChange={(value: any) => {
              setExpirationDate(value);
            }}
          />

          <Toggle setIsToggle={setIsToggle} isToggle={isToggle} />
          <ProductImage barcodeId={barcodeId} />

          {isManual && (
            <ReusableButton name={"Find"} type={"submit"}></ReusableButton>
          )}
        </form>
      </div>
    </Layout>
  );
}

export default BarcodeScanner;
