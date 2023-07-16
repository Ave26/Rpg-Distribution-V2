import React, { useEffect, useState } from "react";
import ReusableInput from "./ReusableInput";
import Toast from "./Toast";

interface Barcode {
  barcodeId: string;
  setBarcodeId: React.Dispatch<React.SetStateAction<string>>;
}

export default function ScanBarcode({
  barcodeId,
  setBarcodeId,
}: Barcode): JSX.Element {
  const [isTrigger, setIsTrigger] = useState<boolean>(false);

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
    setIsTrigger(false);
    const json = await response.json();
    console.log(json?.message);
    try {
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (isTrigger) {
      assignProduct();
    }
  }, [isTrigger]);

  return (
    <>
      <ReusableInput
        name="Barcode Id:"
        value={barcodeId}
        onChange={(value: string) => {
          setIsTrigger(true);
          setBarcodeId(value);
          if (value.length > 12) {
            setBarcodeId(value.slice(12));
          }
        }}
      />
      <Toast data={"+1"} />
    </>
  );
}
