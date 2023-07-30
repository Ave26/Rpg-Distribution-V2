import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ReusableInput from "./ReusableInput";
import Toast from "./Toast";
import Loading from "./Loading";

interface Barcode {
  barcodeId: string;
  setBarcodeId: React.Dispatch<React.SetStateAction<string>>;
  purchaseOrder: string;
  boxSize: string;
  expirationDate: Date | null;
  quality: string;
  quantity: number;
  isManual?: boolean;
}

export default function ScanBarcode({
  barcodeId,
  setBarcodeId,
  purchaseOrder,
  boxSize,
  expirationDate,
  quality,
  quantity,
  isManual,
}: Barcode): JSX.Element {
  const router = useRouter();
  const [isFetch, setIsFetch] = useState<boolean>(false);
  const [binId, setBinId] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const [capacity, setCapacity] = useState<number>(0);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isShow, setIsShow] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  async function assignProduct() {
    setIsLoading(true);
    const response = await fetch("/api/product/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        barcodeId,
        purchaseOrder,
        boxSize,
        expirationDate,
        quality,
        quantity,
      }),
    });
    setIsLoading(false);
    setIsFetch(false);
    const json = await response.json();

    if (json?.isAuthenticated === false) {
      router.push("/login");
    }

    if (response.status === 200 || response.status === 405) {
      console.log(json?.message);
      setMessage(json?.message);
      setIsShow(true);
    }
    console.log(json);
    setCount(json?.TotalAssignedProduct);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShow(false);
    }, 2100);
    return () => {
      clearTimeout(timer);
    };
  }, [isShow, barcodeId]);

  return (
    <div className="flex h-full w-full items-center justify-center font-bold transition-all">
      <ReusableInput
        autoFocus
        disableLabel={true}
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
        <div className="p-2 transition-all">
          <ReusableInput
            min={0}
            placeholder={""}
            type="number"
            name="Quantity"
            value={quantity}
            onChange={(value: number) => {
              setCount(value);
            }}
          />
        </div>
      ) : (
        <div className="h-24 w-28 p-1 transition-all">
          <div
            className={`${
              count >= capacity &&
              "border-none bg-pink-400/70 shadow-lg transition-all"
            } flex h-full w-full items-center justify-center rounded-lg border border-black bg-pink-400/30 transition-all`}>
            {isLoading ? <Loading /> : `${count ?? 0} / ${capacity ?? 0}`}
          </div>
        </div>
      )}
      <Toast data={message} isShow={isShow} />
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
