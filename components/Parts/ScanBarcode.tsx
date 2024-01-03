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
  expirationDate: Date | null | string;
  quality: string;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
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
  setQuantity,
  isManual,
}: Barcode): JSX.Element {
  const router = useRouter();
  const [isFetch, setIsFetch] = useState<boolean>(false);
  const [binId, setBinId] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const [capacity, setCapacity] = useState<number>(0);
  const [binIndex, setBinIndex] = useState<number>(0);
  const [shelfLevel, setShelfLevel] = useState<number>(0);
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

    if (response.status === 200 || response.status === 405) {
      setBinIndex(json?.row);
      setShelfLevel(json?.shelfLevel);
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
    } finally {
      setQuantity(0);
    }
  }

  useEffect(() => {
    if (isFetch) {
      assignProduct();
    }
    return () => setIsFetch(false);
  }, [isFetch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShow(false);
    }, 2100);
    return () => {
      clearTimeout(timer);
    };
  }, [isShow]);

  return (
    <div className="flex h-full w-full items-center justify-center gap-2 font-bold transition-all">
      <ReusableInput
        autoFocus
        disableLabel={true}
        name="Barcode Id:"
        value={barcodeId}
        onChange={(value: string) => {
          setBarcodeId(value);
          if (value.length > 14) {
            setBarcodeId(value.slice(14));
          } else if (value.length === 14) {
            setIsFetch(true);
          }
        }}
      />

      <div className="relative  flex h-1/2 w-32 flex-col gap-2 p-1 transition-all">
        <h1 className="text-center">
          Bin: {binIndex} - {shelfLevel}
        </h1>
        <div
          className={`${
            count >= capacity &&
            "border-none bg-pink-400/70 shadow-lg transition-all"
          } flex h-full w-full items-center justify-center rounded-lg bg-pink-400/30 transition-all`}>
          {isLoading ? <Loading /> : `${count ?? 0} / ${capacity ?? 0}`}
        </div>
        {isManual && (
          <input
            type="number"
            min={0}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="h-fit w-full animate-emerge border p-2"
          />
        )}
      </div>
      <Toast data={message} isShow={isShow} />
    </div>
  );
}
