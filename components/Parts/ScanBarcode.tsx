import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ReusableInput from "./ReusableInput";
import Toast from "./Toast";
import Loading from "./Loading";

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
  const [binId, setBinId] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const [capacity, setCapacity] = useState<number>(0);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function assignProduct() {
    setIsLoading(true);
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
    setIsLoading(false);
    setIsFetch(false);
    const json = await response.json();

    if (json?.isAuthenticated === false) {
      router.push("/login");
    }
    console.log(json?.message, json?.binId);
    setCount(json?.count);
    setCapacity(json?.capacity);
    setBinId(json?.binId);
    try {
    } catch (error) {
      setIsLoading(false);
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
      <label></label>
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
            min={0}
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
              count > 0 &&
              capacity > 0 &&
              count === capacity &&
              "border-none bg-pink-400 shadow-lg transition-all"
            } flex h-full w-full items-center justify-center rounded-lg border border-black transition-all`}>
            {isLoading ? <Loading /> : `${count ?? 0} / ${capacity ?? 0}`}
          </div>
        </div>
      )}
    </div>
  );
}

// function iterateAndCreateAnActivePosition() {
//   const array: number = [
//     [1, 2, 3, 4, 5, 6],
//     [7, 8, 9, 10, 11, 12], // 1st floor
//     [13, 14, 15, 16, 17, 18],
//     [19, 20, 21, 22, 23, 24], // 2nd floor
//     [25, 26, 27, 28, 29, 30],
//     [31, 32, 33, 34, 35, 36],
//   ];
//   const array: number = [
//     [6, 12, 18, 24, 30, 36],
//     [5, 11, 17, 23, 29, 35], // 1st floor
//     [4, 10, 16, 22, 29, 34],
//     [3, 9, 15, 21, 27, 33], // 2nd floor
//     [2, 8, 14, 20, 26, 32],
//     [1, 7, 13, 19, 25, 31],
//   ];

//   const ranges = [
//     { startRow: 0, endRow: 6, startCol: 0, endCol: 1 },
//     { startRow: 0, endRow: 6, startCol: 2, endCol: 3 },
//     // Add more ranges here if needed
//   ];

//   for (const range of ranges) {
//     const { startRow, endRow, startCol, endCol } = range;

//     for (let row = startRow; row <= endRow; row++) {
//       for (let col = startCol; col <= endCol; col++) {
//         array[row][col] = true;
//       }
//     }
//   }

//   console.log(array);
// }
