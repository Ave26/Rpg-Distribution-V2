import React, { useEffect, useState } from "react";
import ReusableInput from "./ReusableInput";
import Toast from "./Toast";

interface Barcode {
  barcodeId: string;
  isManual?: boolean;
  setBarcodeId: React.Dispatch<React.SetStateAction<string>>;
}

export default function ScanBarcode({
  barcodeId,
  setBarcodeId,
  isManual,
}: Barcode): JSX.Element {
  const [isFetch, setIsFetch] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  async function assignProduct() {
    const response = await fetch("/api/product/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        barcodeId,
      }),
    });
    setIsFetch(false);
    const json = await response.json();
    console.log(json?.message);
    setCount(json?.count);
    try {
    } catch (error) {
      setCount(0);
      console.log(error);
    }
  }

  useEffect(() => {
    if (isFetch) {
      assignProduct();
    }
  }, [isFetch]);

  return (
    <div className="flex h-full w-full items-center justify-center gap-2 font-bold">
      <ReusableInput
        name="Barcode Id:"
        value={barcodeId}
        onChange={(value: string) => {
          setIsFetch(true);
          setBarcodeId(value);
          if (value.length > 12) {
            setBarcodeId(value.slice(12));
          }
        }}
      />
      {isManual ? (
        <div className="transition-all">
          <ReusableInput
            type="number"
            name="Quantity"
            value={count}
            onChange={(value: any) => {
              setCount(value);
            }}
          />
        </div>
      ) : (
        <div className="h-24 w-28 p-4 transition-all">
          <div className="flex h-full w-full items-center justify-center rounded-lg border border-black">
            {count}
          </div>
        </div>
      )}
    </div>
  );
}
