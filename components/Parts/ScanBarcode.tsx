import React, { useEffect } from "react";
import ReusableInput from "./ReusableInput";
import Toast from "./Toast";

interface Barcode {
  barcodeId: string | null;
  setBarcodeId: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function ScanBarcode({
  barcodeId,
  setBarcodeId,
}: Barcode): JSX.Element {
  async function assignProduct() {
    // console.log("Assigning Product...");
    // setTimeout(() => {
    //   return console.log("Product Assigned");
    // }, 1200);

    const response = await fetch("/api/product/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        barcodeId,
      }),
    });
    const json = await response.json();
    console.log(json);
    try {
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    assignProduct();
  }, [barcodeId]);

  return (
    <>
      <ReusableInput
        name="Barcode Id:"
        value={barcodeId}
        onChange={function (value: any): void {
          setBarcodeId(value);

          if (value.length <= 12) {
            setBarcodeId(value);
          } else {
            setBarcodeId(value.slice(12));
          }
        }}
      />
      <Toast data={"+1"} />
    </>
  );
}
