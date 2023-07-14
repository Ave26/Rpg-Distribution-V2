import React, { useEffect, useState } from "react";
import Image from "next/image";
import Toast from "./Toast";

import noImage from "@/public/assets/products/noProductDisplay.png";
import Loading from "./Loading";

interface ProductImageProps {
  barcodeId: string | null;
}

export default function ProductImage({
  barcodeId,
}: ProductImageProps): JSX.Element {
  const [productImage, setProductImage] = useState<string>("");
  const [msg, setMsg] = useState<string>("");
  const [isShow, setIsShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  async function handleSubmit() {
    if (!barcodeId === null) {
      setIsShow(false);
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/product/find", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          barcodeId,
        }),
      });
      const json = await response.json();
      const product = await json?.product;
      setProductImage(product?.image);
      setMsg(json?.message);
      setIsLoading(false);
      setIsShow(true);
      console.log(json?.message);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    handleSubmit();
  }, [barcodeId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShow(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [isShow]);

  return (
    <div className="flex w-full flex-col flex-wrap items-center justify-center gap-2 border p-3">
      View Product Image
      {isLoading ? (
        <Loading />
      ) : (
        <Image
          priority
          alt="Product Image"
          src={productImage || noImage}
          className="h-full w-full object-contain"
          width={0}
          height={0}
        />
      )}
      <Toast data={msg} isShow={isShow} />
    </div>
  );
}
