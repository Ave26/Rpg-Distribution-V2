import Layout from "@/components/layout";
import React, { useState } from "react";
import AssignPallette from "@/components/Actions/AssignPallette";
import RecieveProduct from "@/components/RecieveProduct";
import BarcodeScanner from "@/components/BarcodeScanner";

interface Prod {
  barcodeId: string;
}

export default function AddProducts() {
  const [isLocationOpen, setIsLocationOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [barcodeId, setBarCodeId] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [sku, setSku] = useState<string>("");
  const [palletteLocation, setPalletteLocation] = useState<string>("");
  const [dateReceived, setDateReceive] = useState<string>("");
  const [expirationDate, setExpirationDate] = useState<string>("");
  const [poId, setpoId] = useState<string>("");
  const [image, setImage] = useState<string>("");

  const body = {
    barcodeId,
    productName,
    quantity,
    sku,
    palletteLocation,
    dateReceived,
    expirationDate,
    poId,
    image,
  };

  const handleProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("click");
    setIsLoading(true);
    try {
      const response = await fetch("/api/receive-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.status === 200) {
        console.log(response);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setBarCodeId("");
      setProductName("");
      setQuantity(0);
      setSku("");
      setPalletteLocation("");
      setDateReceive("");
      setExpirationDate("");
      setpoId("");
      setImage("");
      setIsLoading(false);
    }
  };

  const inputStyle =
    "rounded-md py-3 px-4 focus:ring-4 focus:outline-none border-2 md:w-full";
  return (
    <Layout>
      <RecieveProduct />
      {/* <BarcodeScanner /> */}
    </Layout>
  );
}
