import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ReusableInput from "./ReusableInput";
import Toast from "./Toast";

interface Barcode {
  barcodeId: string;
  isManual?: boolean;
  purchaseOrder: string;
  boxSize: string;
  expirationDate: string;
  setBarcodeId: React.Dispatch<React.SetStateAction<string>>;
}

export default function ScanBarcode({
  barcodeId,
  setBarcodeId,
  isManual,
  purchaseOrder,
  boxSize,
  expirationDate,
}: Barcode): JSX.Element {
  const router = useRouter();
  const [isFetch, setIsFetch] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [capacity, setCapacity] = useState<number>(0);
  async function assignProduct() {
    const response = await fetch("/api/product/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        barcodeId,
        expirationDate,
      }),
    });
    setIsFetch(false);
    const json = await response.json();

    if (json?.isAuthenticated === false) {
      router.push("/login");
    }
    console.log(json?.message);
    setCount(json?.count);
    setCapacity(json?.capacity);
    try {
    } catch (error) {
      setCount(0);
      setCapacity(0);
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
          <div
            className={`${
              count === capacity &&
              "border-none bg-pink-400 shadow-lg transition-all"
            } flex h-full w-full items-center justify-center rounded-lg border border-black transition-all`}>
            {count}/{capacity}
          </div>
        </div>
      )}
    </div>
  );
}
